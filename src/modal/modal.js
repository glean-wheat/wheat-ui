import * as styleContent from './modal.scss'
import { parseCss } from '../utils/utils'

const WheatModaltemplate = document.createElement('template')
const prefix = 'wheat-modal'


WheatModaltemplate.innerHTML = `
<style>
${parseCss(styleContent)}
</style>
<div class="wheat-modal">
  <div class="wheat-modal-mask"></div>
  <div class="wheat-modal-container">
    <div class="wheat-modal-wrapper">
      <div class="wheat-modal-header">
        <span class="wheat-modal-header-text"></span>
        <span class="wheat-modal-header-close">

        <slot name='wheat-modal-close-icon'>
          X
        </slot>

        </span>
      </div>

      <div class="wheat-modal-content">

        <slot name="content">
          content
        </slot>
        
      </div>

      <div class="wheat-modal-footer">

        <slot name='wheat-modal-footer'>
          <wheat-button class="wheat-modal-footer-cancel" type='line'>取消</wheat-button>
          <wheat-button class="wheat-modal-footer-confirm" type='primary'>确定</wheat-button>
        </slot>
        
      </div>


    </div>
  </div>
</div>
`
class WheatModal extends HTMLElement {
  constructor() {
    super()
    this.data = {
      title: this.getAttribute('title') || '弹层组件',
      visible: this.getAttribute('visible'),
      closeable: this.getAttribute('closeable') || 'true',
      maskCloseable: this.getAttribute('maskCloseable') || 'true'
    }
    this.renderShadowDom()
    this.$modalRoot = this._shadowRoot.querySelector('.wheat-modal')
    this.$closeBtn = this._shadowRoot.querySelector('.wheat-modal-header-close')
    this.$wrapper = this._shadowRoot.querySelector('.wheat-modal-wrapper')
    this.$mask = this._shadowRoot.querySelector('.wheat-modal-mask')
  }
  static get observedAttributes() {
    return ['visible', 'title', 'size']
  }
  
  /**
   *
   * @param {*} name
   * @param {*} oldVal
   * @param {*} newVal
   *
   * 每当添加到observedAttributes数组的属性发生变化时，就会调用这个函数。使用属性的名称、旧值和新值调用该方法
   * react 中的 static getDerivedStateFromProps(props, state) 有些类似
   * 基本上和vue中的watch使用和observedAttributes + attributeChangedCallback使用雷同；
   */
  attributeChangedCallback(name, oldVal, newVal) {
    this.data[name] = newVal
    this.$modalRoot.style.display = name === 'visible' && newVal !== 'false' ? 'block' : 'none'
    if (name === 'visible' && newVal !== 'false') {
      this.$mask.classList.add('wheat-modal-mask-show')
      this.$wrapper.classList.add('wheat-modal-wrapper-show')
    }
    if (name === 'size') {
      this.$wrapper.classList.add('wheat-modal-wrapper--' + newVal)
    }
  }
   /**
   * connectedCallback
   * 当元素插入到 DOM 中时，将调用 connectedCallback。
   * 这是运行安装代码的好地方，比如获取数据或设置默认属性。
   * 可以将其与React的componentDidMount方法进行比较
   * vue的mount方法作比较
   */

  connectedCallback() {

    this._shadowRoot.querySelector('.wheat-modal-header-text').innerHTML = this.data.title
    this._shadowRoot.querySelector('.wheat-modal-content')
    this.$closeBtn.style.display = this.data.closeable ? 'display' : 'none'
    this.bindEvents()

  }
  bindEvents() {
    this.hide()
    this.show()
  }

  /**
   * disconnectedCallback
   * 只要从 DOM 中移除元素，就会调用 disconnectedCallback。清理时间到了！
   * 我们可以使用 disconnectedCallback 删除事件监听，或取消记时。
   * 但是请记住，当用户直接关闭浏览器或浏览器标签时，这个方法将不会被调用。
   *
   * 可以用window.unload beforeunload或者widow.close 去触发在浏览器关闭时的回调
   *
   * 可以与 react 中的 componentWillUnmount 的方法进行比较
   * vue 中的 destory中是生命周期函数进行对比
   */
  disconnectedCallback() {
    this.$cancelBtn = this._shadowRoot.querySelector('.wheat-modal-footer-cancel')
    this.removeEventListener('keydown', this._onKeyDown)
    this.removeEventListener('click', this._onClick)
    this.$closeBtn.removeEventListener('click', this.onCancel.bind(this))
    this.$cancelBtn.removeEventListener('click', this.onCancel.bind(this))
    this.$closeBtn.removeEventListener('click', this.maskHide.bind(this))
  }
  maskHide() {
    this.$modalRoot.style.display = 'none'
  }

  onCancel() {
    this.dispatchEvent(
      // 自定义事件
      new CustomEvent('onCancel', {
        detail: { visible: false }
      })
    )
  }
  onConfirm() {
    this.dispatchEvent(
      // 自定义事件
      new CustomEvent('onConfirm', {
        detail: { isConfirmed: true }
      })
    )
  }
  // 添加自定义事件
  hide() {
    this.$cancelBtn = 
      this._shadowRoot.querySelector('.wheat-modal-footer-cancel')
    // 添加自定义事件
    this.$cancelBtn.addEventListener('click', this.onCancel.bind(this))
    // 添加自定义事件
    this.data.maskCloseable === 'true' &&
      this.$mask.addEventListener('click', this.maskHide.bind(this))
  }
  show() {
    this.$confirmBtn = 
      this._shadowRoot.querySelector('.wheat-modal-footer-confirm')
    // 添加自定义事件
    this.$confirmBtn.addEventListener('click', 
        this.onConfirm.bind(this))
  }
  renderShadowDom() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(WheatModaltemplate.content.cloneNode(true))
  }
}
 /**
   * 生命周期的执行顺序  挂载的时候 按照react 或者vue中的执行顺序是相同的
   * constructor -> attributeChangedCallback -> connectedCallback
   */
// this 指代该标签
!window.customElements.get(prefix) && window.customElements.define(prefix, WheatModal)
