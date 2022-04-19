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