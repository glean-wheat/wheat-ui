/*
 * @Author: wugaoliang 
 * @Date: 2022-04-12 10:22:09 
 * @Last Modified by: wugaoliang
 * @Last Modified time: 2022-04-19 11:31:35
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
        super(props);
        console.log('props', props);
        this.render();
        // 获取容器
        this.$wrapper = this._shadowRoot.querySelector('.web-sandbox-content');
        // 记录子应用
        this.microApp = new Map();
    }
    /**
     * 添加需要监控的属性名称
     * 监控Url的变化
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
        // 通过Url获取相应的HTML元素
        console.log('web sandbox 渲染完成')
        // 当元素被插入到DOM中时，此时去加载相关URL的子应用并渲染。
        const app = new RegisterMicroApp({
            name: this.name,
            entry: this.entry,
            container: this,
        })
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


    attributeChangedCallback (attrName, _oldVal, newVal) {
        // 元素属性发生变化时执行，可以获取name、url等属性的值
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
