## 摘要

通过对single-spa、qiankun等比较火的微前端框架使用学习之后。基于个人的一些理解，决定通过webcomponents实现一个微前端框架。内容包含了从渲染到卸载的整体流程。本篇内容没有任何出彩的代码。但是如果认真读下来，能够帮助大家对微前端的实现有一个新的认识。

## 思路

### 乾坤实现方式

qiankun在做介绍的时候有一句话我记忆特别深：`微前端方案的目标应该是：方案上跟使用 iframe 做微前端一样简单，同时又解决了 iframe 带来的各种体验上的问题`。目前在使用的便利程度上，qiankun相比与single-spa有了很大提升，但是和iframe相比还有一定的接入成本。期望后期qiankun能够达成`方案上跟使用 iframe 做微前端一样简单`的这样一个目标。同时呢，也是基于这样的畅想，计划借助webcomponents中的CustomElement为入口，实现像`iframe`做微前端一样简单。

首先我们先简单的了解一下qiankun的渲染流程, qiankun以url为入口加载相应的HTML，请求下来url对应的文档后，先识别文档内容中的外链资源，然后自己去加载对应的资源内容。并删除文档中的资源，然后对加载内容做处理后（js沙箱、样式隔离）再加回dom上。

### qiankun渲染流程图


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8be49737cc24a9fadca30d90e182f26~tplv-k3u1fbpfcp-watermark.image?)

接下来开始基于以上的渲染流程的实现思路；并基于webcomponents提供的能力，来实现一个简单的微前端框架。
先给大家看一下最终实现成果吧。这样方便接下来的讲解。

在app-react应用的App.js文件中，使用我们实现的微前端框架。使用方式像使用iframe一样简单。也就直接标签形式使用。代码如下：
````js
// ./app-react/src/App.js
import logo from './logo.svg';
// 引入自定义标签 web-sandbox;
import './web-sandbox'
import './App.css';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {window.a}
      </header>
      <web-sandbox entry="http://localhost:8080" name={'app1'}/>
    </div>
  );
}
export default App;
````
渲染后效果如下图，整个vue微应用都被封装在自定义标签wed-sandbox的shadowDOM中。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70da2b6d05a84e43b1440c58690d39c1~tplv-k3u1fbpfcp-watermark.image?)

所以我们整体架构思路为：以 **CustomElement** 替代iframe，作为 **HTMLEntry**。

`HTMLEntry`就是以html文件作为入口地址进行渲染，如上图中的[http://localhost:8080/ ](http://localhost:8080/就是一个html地址。)就是一个html地址。

如果大家对webcomponents相关知识不是太熟悉的话；可以看一下个人之前对webcomponents相关的介绍，这里就不做详细的介绍了。[文章地址](https://juejin.cn/post/6969341653760868360)。接下来用的相关技术以及知识点，均有详细的备注信息
## 前期准备

开始之前，明确目录结构。分别基于vue-cli、react-creat-app创建 app-vue、app-react 两个应用。项目目录如下。避免产生其他负担，所以采用最基础的项目结构。

```
web-sandbox
├─app-vue                     // vue 应用
|    ├─src
|    |  ├─App.vue
|    |  ├─main.js
|    |  ├─components
|    |  |     └HelloWorld.vue
|    |  ├─assets
|    |  |   └logo.png
|    ├─public
|    |   ├─favicon.ico
|    |   └index.html
├─app-react                   // react 应用 基座应用
|     ├─src
|     |  ├─App.css
|     |  ├─App.js
|     |  ├─App.test.js
|     |  ├─index.css
|     |  ├─index.js
|     |  ├─logo.svg
|     |  ├─reportWebVitals.js
|     |  ├─setupTests.js
|     |  ├─web-sandbox         // 添加web-sandbox 文件，本次全部内容代码。
|     |  |      ├─app.js       // 注册应用
|     |  |      ├─index.js     // 入口文件
|     |  |      └source.js    //  获取资源文件
```

## 1. 创建容器 web-sandbox

首先我们简单了解一下qiankun的**HTMEntry**的实现方式。**HTMEntry** 简单的表述其实是将子应用的js、css等静态资源加载到基座应用中执行；同时在基座中创建了一个`div`标签，并将相应的资源放在相应的标签中进行执行。**HTMEntry** 实现方式其实是模仿了 **iframe** 原生标签的渲染能力。大家应该比较清楚 **iframe** 标签的能力；就是实现了**一个内联框架**；**一个内联框架**被用来在当前 HTML 文档中嵌入另一个文档。

qiankun的**HTMEntry**本质上借鉴 iframe 的使用方式。直接通过标签，添加链接渲染子应用。从而实现qiankun的简单易用。

webcomponents 的标准中，有一种能力 [**custom elements**](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements) **。** 我们可以**自定义标签**作为入口，自定义标签天然的提供了一个元素容器，另外自定标签具备**挂载、更新、卸载**等完备的生命周期。

正式开始微前端框架之前，我们需要先熟悉一下 [**custom elements**](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements) **。** 的生命周期 **。**

下图中，将我们常用的react、vue等框架生命周期与 [**custom elements**](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements)**的**[**生命周期**](https://juejin.cn/post/6969342045135568903) **。** 做了一个简单的对比


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd098c0c7e054f2ead90cb963676e8a9~tplv-k3u1fbpfcp-watermark.image?)

我们可以在这些钩子函数中进行加载渲染等操作，从而简化步骤。相应的相关自定义标签的关键生命周期，都一一添加的详细的备注。

```js
// ./app-react/src/web-sandbox/index.js
/*
 * @Last Modified by: wugaoliang
 * @Last Modified by: wugaoliang
 * @Last Modified time: 2022-04-19 09:22:00
 * @Last Modified time: 2022-06-10 15:09:22
 */
const customElementsName = 'web-sandbox';
const template = document.createElement('template');
const styles = `
<style>
    :host {
        width: 100%;
        height: 50vh;
        display: block;
        overflow: scroll;
    }
  </style>`
template.innerHTML = `
    ${styles}
    <div class="web-sandbox-content"></div>
`
// 创建自定义元素
class WebSandbox extends HTMLElement {
    // 元素初始化的时候执行
    constructor(props) {
        super(props);
        console.log('props', props);
        this.render();
        // 获取容器
        this.$wrapper = this._shadowRoot.querySelector('.web-sandbox-content');
        // 记录应用名称。方便卸载使用
        this.microApp = new Map();
    }
    /**
     * 添加需要监控的属性名称
     * 监控entry的变化
     * 只有这些属性变化时才会触发 attributeChangedCallback
     */
    static get observedAttributes() {
        return ['name', 'entry']
    }
    
    /**
     * connectedCallback
     * 当元素插入到 DOM 中时，将调用 connectedCallback。
     * 这是运行安装代码的好地方，比如获取数据或设置默认属性。
     * 可以将其与React的componentDidMount方法进行比较
     * vue的mount方法作比较
    */
    connectedCallback() {
        // 当元素被插入到DOM中时，此时去加载相关entry的子应用并渲染。
        console.log('web sandbox 渲染完成')
    }
    /**
     * disconnectedCallback
     * 只要从 DOM 中移除元素，就会调用 disconnectedCallback。清理时间到了！
     * 我们可以使用 disconnectedCallback 删除事件监听，或取消记时。
     * 但是请记住，当用户直接关闭浏览器或浏览器标签时，这个方法将不会被调用。
     *
     * 可以用window.unload beforeunload或者widow.close 去触发在浏览器关闭是的回调
     *
     * 可以与 react 中的 componentWillUnmount 的方法进行比较
     * vue 中的 destory中是生命周期函数进行对比
     */
    disconnectedCallback () {
        // 元素从DOM中删除时执行，此时进行一些卸载操作
        console.log('web sandbox 已被卸载');
        // 执行micorApp的卸载
    }
    attributeChangedCallback (attrName, _oldVal, newVal) {
        // 元素属性发生变化时执行，可以获取name、entry等属性的值
        console.log(`attribute ${attrName}: ${newVal}, _oldVal: ${_oldVal}`);
        this[attrName] = newVal;
    }
    render () {
        // 构建shadow dom
        this._shadowRoot = this.attachShadow({mode: 'open'})
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }
}
// 不可重复定义标签，需要判断一下
!window.customElements.get(customElementsName) && window.customElements.define(customElementsName, WebSandbox)
```

接下来 我们在react项目中使用该标签。
```js
// ./app-react/src/App.jsx
import logo from './logo.svg';
import './web-sandbox';   // 引入自定义标签 web-sandbox;   
import './App.css';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {window.a}
      </header>
      // 和正常标签一样使用。自定义了entry 以及 name 属性。
      <web-sandbox entry="http://localhost:8080" name={'app1'}/>
    </div>
  );
}
export default App;
```
如图,控制台中已经打印出来了。说明`web-sandbox`自定义标签已经渲染成功。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e375e92d062c4769aac10088088b6b05~tplv-k3u1fbpfcp-watermark.image?)

以上我们就完成了微应用容器元素的初始化，接下来就是将子应用的所有静态资源、以及相应的DOM结构放在 web-sandbox 这个标签下。接下来我们就需要完成子应用的静态资源加载及渲染。

## 渲染子应用

在 `web-sandbox` 标签中有两个关键属性。其中有一个是`entry`, 它是入口地址，需要通过fetch请求后拿到这个HTML内容。那接下的工作就很清晰了。首先就是获取HTML内容。\
根据`CustomElement`的生命周期中，我们需要在 `connectedCallback` 中注册这个子应用。

我们声明一个类`RegisterMicroApp`，用来实例化子应用。

```js
// ./app-react/src/web-sandbox/app.js
export default class RegisterMicroApp {
    constructor ({ name, entry, container }) {
        this.status = 'created' // 子应用状态，包括 created/loading/mount/destroyed
        this.name = name // 应用名称
        this.entry = entry  // url地址
        this.container = container // web-sandbox元素，子应用的entry-html放置的位置
        this.status = 'loading'
    }
  
    // 静态资源js、css；
    source = { 
      links: new Map(), // link元素对应的静态资源
      scripts: new Map(), // script元素对应的静态资源
    }
  
    // 资源加载完时执行
    onLoad (html) {
      this.status = 'loaded'
    }
  
    /**
     * 资源加载完成后进行渲染, 并放在shadowDOM中
     */
    mount () {
      // 标记应用为已渲染
      this.status = 'mounted'
    }
  
    /**
     * 卸载应用
     * 清空shadow DOM
     * 以及相关的静态资源
     */
    destroyed () {
      // 标记应用为已卸载
      this.status = 'destroyed';
    }
  }
```
接下来，在 `CustomElement` 的 `connectedCallback` 的钩子中，调用注册类，实例化子应用。

```js
/*
 * @Last Modified by: wugaoliang
 * @Last Modified by: wugaoliang
 * @Last Modified time: 2022-04-19 09:22:00
 * @Last Modified time: 2022-04-19 09:52:12
 */
import RegisterMicroApp from './app';
...
// 创建自定义元素
class WebSandbox extends HTMLElement {
  // 元素初始化的时候执行
    constructor(props) {
        ...
        // 记录子应用，方便卸载使用
        this.microApp = new Map();
    }
    ...
    connectedCallback() {
        // 当元素被插入到DOM中时，此时去加载相关URL的子应用并渲染。
        console.log('web sandbox 渲染完成')
        // 当元素被插入到DOM中时，此时去加载相关URL的子应用并渲染。
        const app = new RegisterMicroApp({
            name: this.name,
            entry: this.entry,
            container: this,
        })
        // 记录当前的子应用
        console.log('app', app);
        // 挂载完成，记录子应用，方便做缓存、卸载。
        this.microApp.set(this.name, app);
    }
    ...
}
...
```

注册子应用时，需要获取HTML。直接使用`fetch`进行请求即可。

```js
// ./app-react/src/web-sandbox/app.js
import importEntryHtml from './source';
export default class RegisterMicroApp {
    constructor ({ name, entry, container }) {
        ...
        this.status = 'loading'
        importEntryHtml(this)
    }
    ...
  }
```
```js
/*
 * @Author: wugaoliang 
 * @Date: 2022-04-13 09:17:39 
 * @Last Modified by: wugaoliang
 * @Last Modified time: 2022-04-19 09:37:10
 */
function fetchSource (entry) {
  return fetch(entry).then((res) => {
    return res.text()
  })
}
export default function importEntryHtml (app) {
  fetchSource(app.entry).then((html) => {
      console.log('html:', html);
}
```

直接访问肯定会出现跨域问题，

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed3706c875f14c59873be97d685793de~tplv-k3u1fbpfcp-watermark.image?)
需改vue文件相关配置，防止`web-sandbox`访问跨域情况。

*这里需要说明一下。本篇文章想要简单实现一个微前端框架。像跨域代理等相关内容，就不过多的附加在这个框架上了。有兴趣的可以自己折腾一下。*

```js
// ./app-vue/vue.config.js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }
    
  }
})
```
完成之后我们已经能够顺利的拿到HTML相关的内容了。接下我们开始解析并获取相应的js、css等静态资源。


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a14575d81694c70a0cb66a0ee8406d1~tplv-k3u1fbpfcp-watermark.image?)

到此前期的工作已经基本完成了。接下来的工作就很明确了，就是要解析html以及相关个js、css等内容。

原先设想比较简单，就是拿到html之后直接放在`web-sandbox`的innerHTML中？这样就很白痴了，毕竟HTML 不能允许出现 两个head、两个body; 问题出现了那咱们就去解决，去解析相应的head以及body的内容。

正则匹配完全可以做到，替换标签。

接下来我们继续完善`importEntryHtml`方法。

```js
// ./app-react/src/web-sandbox/source.js
export default function importEntryHtml (app) {
  fetchSource(app.entry).then((html) => {
      console.log('html:', html);
      // 获取html中的head和body,并替换为自定义标签，一个html只能有一个head和一个body。对于body标签。不同的浏览器会有不同的响应方式。也需要进行替换。
      const head = html.match(/<head[^>]*>([\s\S]*?)</head>/i)[0].replace(/<head/i, '<web-sandbox-head').replace(/</head>/i, '</web-sandbox-head>');
      const body = html.match(/<body[^>]*>([\s\S]*?)</body>/i)[0].replace(/<body/i, '<web-sandbox-body').replace(/</body>/i, '</web-sandbox-body>');
      const _html = head + body;
      // 将html字符串转化为DOM结构。这里只是为了获取DOM，不会存在执行appendChild。
      const htmlDom = document.createElement('div')
      htmlDom.innerHTML = _html
      console.log('html:', htmlDom)
      
      // 获取静态资源
      getSource(htmlDom, app);
      console.log('app', app);
}
```

提取js、css等静态资源地址。\
我们在`getSource`方法中。获取head和body中的link和script标签链接地址，并删除link和script标签。因为需要拿到内容，并立刻执行，所以仅仅拿链接地址，其他附属属性例如type/defer/async/chartset等等暂时先不考虑。

```js
// ./app-react/src/web-sandbox/source.js
/**
 * 获取head和body中的link和script标签链接地址，并删除link和script标签
 * @param {HTMLElement} htmlDom 
 * @param {CustomElementConstructor} app 
 */
function getSource(htmlDom, app) {
  const headLinks = htmlDom.querySelectorAll('web-sandbox-head link');
  const headScripts = htmlDom.querySelectorAll('web-sandbox-head script');
  const bodyScripts = htmlDom.querySelectorAll('web-sandbox-body script');
  // 删除head和body中的link和script标签
  headLinks.forEach((link) => {
    const linkUrl = link.getAttribute('href');
    // 计入source缓存中
    app.source.links.set(linkUrl, {
      code: '', // 代码内容
    });
    link.remove();
  });
  headScripts.forEach((script) => {
    const scriptUrl = script.getAttribute('src');
    app.source.scripts.set(scriptUrl, {
      code: '', // 代码内容
    });
    script.remove();
  });
  bodyScripts.forEach((script) => {
    const scriptUrl = script.getAttribute('src');
    app.source.scripts.set(scriptUrl, {
      code: '', // 代码内容
    });
    script.remove();
  });
}
```

获取静态资源源码\
在获取了css、js等静态资源的地址，接下来就是请求这些地址，拿到资源的内容。

接着完善importEntryHtml，在getSource下面添加请求资源的方法。

```js
// ./app-react/src/web-sandbox/source.js
export default function importEntryHtml (app) {
  fetchSource(app.entry).then((html) => {
      ...
      // 获取静态资源
      getSource(htmlDom, app);
      console.log('app', app);
      ...
      // 获取web-sandbox-head元素
      const webSandboxHead = htmlDom.querySelector('web-sandbox-head')
      // 如果有远程css资源，则通过fetch请求;
      // 这个地方会重复渲染容器。但是不会多次触发资源的获取。
      if (app.source.links.size) {
        getExternalStyleSheets(app, webSandboxHead, htmlDom)
      } else {
        app.onLoad(htmlDom)
      }
  
      // 如果有远程js资源，则通过fetch请求
      if (app.source.scripts.size) {
        getExternalScripts(app, htmlDom)
      } else {
        app.onLoad(htmlDom)
      }
    }).catch((e) => {
      console.error('加载html出错', e)
    })
}
```

getExternalStyleSheets和getExternalScripts分别请求css和js资源, 关于这一块的内容建议大家可以深入了解下 [import-html-entry](https://github.com/kuitos/import-html-entry)。里面会有更加详细的介绍。在此就不过多介绍了，毕竟不是源码分析文章。\
请求资源后的处理方式不同，css资源会转化为style标签插入DOM中，而js不会立即执行，我们会在应用的mount方法中执行js。

```js
// ./app-react/src/web-sandbox/source.js
/**
 * 获取link远程资源
 * @param app 应用实例
 * @param webSandboxHead web-sandbox-head
 * @param htmlDom html DOM结构
 * 更加完整的请求方式请移步一下链接
 * https://github.com/kuitos/import-html-entry/blob/09cc30adb60317556ac35b2d58e08a8398d75007/src/index.js#L68
 */
 export function getExternalStyleSheets (app, webSandboxHead, htmlDom) {
  const linkEntries = Array.from(app.source.links.entries())
  // 通过fetch请求所有css资源
  const fetchLinkPromise = []
  for (const [entry] of linkEntries) {
    fetchLinkPromise.push(fetchSource(app.entry + entry))
  }
  Promise.all(fetchLinkPromise).then((res) => {
    for (let i = 0; i < res.length; i++) {
      const code = res[i]
      // 拿到css资源后放入style元素并插入到web-sandbox-head中
      const link2Style = document.createElement('style')
      link2Style.textContent = code
      webSandboxHead.appendChild(link2Style)
    }
    // 处理完成后执行onLoad方法
    app.onLoad(htmlDom)
  }).catch((e) => {
    console.error('加载css出错', e)
  })
}
/**
 * 获取js远程资源
 * @param app 应用实例
 * @param htmlDom html DOM结构
 * 更加完整的请求方式请移步一下链接
 * https://github.com/kuitos/import-html-entry/blob/09cc30adb60317556ac35b2d58e08a8398d75007/src/index.js#L84
 */
 export function getExternalScripts (app, htmlDom) {
  const scriptEntries = Array.from(app.source.scripts.entries())
  // 通过fetch请求所有js资源
  const fetchScriptPromise = []
  for (const [entry, info] of scriptEntries) {
    // 如果是内联script，则不需要请求资源
    fetchScriptPromise.push(info.code ? Promise.resolve(info.code) :  fetchSource(app.entry + entry))
  }
  Promise.all(fetchScriptPromise).then((res) => {
    for (let i = 0; i < res.length; i++) {
      const code = res[i]
      // 将代码放入缓存，再次渲染时可以从缓存中获取
      scriptEntries[i][1].code = code
    }
    // 处理完成后执行onLoad方法
    app.onLoad(htmlDom)
  }).catch((e) => {
    console.error('加载js出错', e)
  })
}
```

在处理完成相应的资源，以及相应的HTML后，我们在开始执行渲染。在mount方法中将DOM结构插入文档中，然后执行js文件进行渲染操作，此时微应用即可完成基本的渲染。 其中有一个点应该注意，关于执行js沙箱。应该在onLoad阶段。获取js资源后。执行js沙箱。

```
// ./app-react/src/web-sandbox/app.js
import importEntryHtml from './source';
export default class RegisterMicroApp {
    constructor ({ name, entry, container }) {
        this.name = name // 应用名称
        this.entry = entry  // url地址
        this.container = container // web-sandbox元素，子应用的entry-html放置的位置
        this.status = 'loading'
        importEntryHtml(this)
      }
  
    status = 'created' // 组件状态，包括 created/loading/mount/destroyed
  
    // 存放应用的静态资源
    source = { 
      links: new Map(), // link元素对应的静态资源
      scripts: new Map(), // script元素对应的静态资源
    }
  
    // 资源加载完时执行
    onLoad (html) {
      // 清空web-sandbox
      this.container.$wrapper.innerHTML = '';
      // 创建一个模板标签，放置内容
      const template = document.createElement('template')
      template.appendChild(html.cloneNode(true))
      // 将格式化后的DOM结构插入到容器中
      this.container.appendChild(template.cloneNode(true))
      // 执行js 以便执行应用的初始化
      this.source.scripts.forEach((info) => {
        // 通过with(window)执行js代码
        // 沙箱应该这个地方添加。 ShadowRealm 实现待完善
        new Function(`${info.code}`)()
      })
      this.mount()
    }
  
    /**
     * 资源加载完成后进行渲染
     */
    mount () {
      // 添加到shadow DOM中
      this.container.$wrapper.appendChild(this.container.querySelector('web-sandbox-head'));
      this.container.$wrapper.appendChild(this.container.querySelector('web-sandbox-body'));
      // 标记应用为已渲染
      this.status = 'mounted'
    }
  
    /**
     * 卸载应用
     * 清空shadow DOM
     * 以及相关的静态资源
     */
    destroyed () {
      this.status = 'unmounted';
      this.container.$wrapper.innerHTML = '';
      this.source.links.clear();
      this.source.scripts.clear();
    }
  }
```

我们继续完善一下 `web-sandbox`卸载方法。

```js
/*
 * @Author: wugaoliang 
 * @Date: 2022-04-12 10:22:09 
 * @Last Modified by: wugaoliang
 * @Last Modified time: 2022-04-19 09:55:22
 */
import RegisterMicroApp from './app';
const customElementsName = 'web-sandbox';
const template = document.createElement('template');
const styles = `
<style>
    :host {
        width: 100%;
        height: 50vh;
        display: block;
        overflow: scroll;
    }
  </style>`
template.innerHTML = `
    ${styles}
    <div class="web-sandbox-content"></div>
`
// 创建自定义元素
class WebSandbox extends HTMLElement {
    // 元素初始化的时候执行
    constructor(props) {
        ...
        // 记录子应用
        this.microApp = new Map();
    }
    
    /**
     * connectedCallback
     * 当元素插入到 DOM 中时，将调用 connectedCallback。
     * 这是运行安装代码的好地方，比如获取数据或设置默认属性。
     * 可以将其与React的componentDidMount方法进行比较
     * vue的mount方法作比较
    */
    connectedCallback() {
        ...
        // 记录当前的子应用
        console.log('app', app);
        this.microApp.set(this.name, app);
    }
    /**
     * disconnectedCallback
     * 只要从 DOM 中移除元素，就会调用 disconnectedCallback。清理时间到了！
     * 我们可以使用 disconnectedCallback 删除事件监听，或取消记时。
     * 但是请记住，当用户直接关闭浏览器或浏览器标签时，这个方法将不会被调用。
     *
     * 可以用window.unload beforeunload或者widow.close 去触发在浏览器关闭是的回调
     *
     * 可以与 react 中的 componentWillUnmount 的方法进行比较
     * vue 中的 destory中是生命周期函数进行对比
     */
    disconnectedCallback () {
        // 元素从DOM中删除时执行，此时进行一些卸载操作
        console.log('web sandbox 已被卸载');
        // 执行micorApp的卸载
        this.microApp[this.name].destroyed();
    }
    ...
}
// 不可重复定义标签，需要判断一下
!window.customElements.get(customElementsName) && window.customElements.define(customElementsName, WebSandbox)
```

经过一番折腾后最终希望能够实现的效果如下。vue应用已经可以在React应用中正常渲染了。


![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/744a9f1df41f4a3fb0939e39bf35937e~tplv-k3u1fbpfcp-watermark.image?)


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/906f54c0c7e24b729dd011add7eeebbc~tplv-k3u1fbpfcp-watermark.image?)

## 总结

微前端在技术方面最大的价值就是希望能够实现 **技术栈无关**, 也是基于这样的想法，采用原生的js能力去实现微前端框架是一个比较合理的想法。随着webcomponents的融合标准能力的越来越强，我们去**解构巨石应用会变得**越来越简单。

建议大家去看一下[**微前端的核心价值**](https://www.yuque.com/kuitos/gky7yw/rhduwc)的一些讨论，里面好多的关键都是有很高的格局才能提出来的。个人体会最大的就是不要迷恋技术，技术存在的意义是为了实现业务价值。

## 源码

相关代码已提交个人github：

<https://github.com/glean-wheat/wheat-ui/tree/master/web-sandbox>