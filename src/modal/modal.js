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
      visiable: this.getAttribute('visiable'),
      closeable: this.getAttribute('closeable') || 'true',
      maskCloseable: this.getAttribute('maskCloseable') || 'true'
    }
    this.renderShadowDom()
    this.$modalRoot = this._shadowRoot.querySelector('.wheat-modal')
    this.$closeBtn = this._shadowRoot.querySelector('.wheat-modal-header-close')
    this.$wrapper = this._shadowRoot.querySelector('.wheat-modal-wrapper')
    this.$mask = this._shadowRoot.querySelector('.wheat-modal-mask')
    this.bindEvents()
  }
  static get observedAttributes() {
    return ['visiable', 'title', 'size']
  }
  attributeChangedCallback(name, oldVal, newVal) {
    this.data[name] = newVal
    this.$modalRoot.style.display = name === 'visiable' && newVal !== 'false' ? 'block' : 'none'
    if (name === 'visiable' && newVal !== 'false') {
      this.$mask.classList.add('wheat-modal-mask-show')
      this.$wrapper.classList.add('wheat-modal-wrapper-show')
    }
    if (name === 'size') {
      this.$wrapper.classList.add('wheat-modal-wrapper--' + newVal)
    }
  }

  connectedCallback() {
    this._shadowRoot.querySelector('.wheat-modal-header-text').innerHTML = this.data.title
    this._shadowRoot.querySelector('.wheat-modal-content')
    this.$closeBtn.style.display = this.data.closeable ? 'display' : 'none'
  }
  bindEvents() {
    this.hide()
    this.show()
  }
  disconnectedCallback() {
    this.removeEventListener('keydown', this._onKeyDown)
    this.removeEventListener('click', this._onClick)
  }
  onCancel() {
    this.dispatchEvent(
      // 自定义事件
      new CustomEvent('onCancel', {
        detail: { visiable: false }
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
  maskHide() {
    this.$modalRoot.style.display = 'none'
  }
  hide() {
    this.$cancelBtn = this._shadowRoot.querySelector('.wheat-modal-footer-cancel')

    // 添加自定义事件
    this.$cancelBtn.removeEventListener('click', this.onCancel.bind(this))
    this.$cancelBtn.addEventListener('click', this.onCancel.bind(this))

    // 添加自定义事件
    this.$closeBtn.removeEventListener('click', this.onCancel.bind(this))
    this.$closeBtn.addEventListener('click', this.onCancel.bind(this))
    
    this.$closeBtn.removeEventListener('click', this.maskHide.bind())
    this.data.maskCloseable === 'true' &&
      this.$mask.addEventListener('click', this.maskHide.bind())
  }
  show() {
    this.$confirmBtn = this._shadowRoot.querySelector('.wheat-modal-footer-confirm')
    // 添加自定义事件
    this.$confirmBtn.removeEventListener('click', this.onConfirm.bind(this))
    this.$confirmBtn.addEventListener('click', this.onConfirm.bind(this))
  }
  renderShadowDom() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(WheatModaltemplate.content.cloneNode(true))
  }
}
// this需要讲解
!window.customElements.get(prefix) && window.customElements.define(prefix, WheatModal)
