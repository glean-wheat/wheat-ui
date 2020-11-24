const WheatModaltemplate = document.createElement('template')
WheatModaltemplate.innerHTML = `
<style>
:host{
  display: block;
}
.wheat-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
  transition: opacity 0.3s, height 0s 0.3s;
}
.wheat-modal-mask-show {
  opacity: 1;
  height: 100%;
  transition: opacity 0.3s;
}
.wheat-modal-container {
  z-index: 1000;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
}

.wheat-modal-header {
  border-bottom: 1px solid #e6e6e6;
  font-size: 16px;
  color: #333;
  font-weight: 600;
  height: 54px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.wheat-modal-wrapper {
  width: 600px;
  max-height: 600px;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.1);
}
.wheat-modal-wrapper-show {
  animation:scale 0.3s 1;
}
@keyframes scale
{
  from {transform: scale(0.4);opacity: 0;}
  to {opacity: 1;transform: scale(1);}
}
.wheat-modal-header-close {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em !important;
  overflow: hidden;
  cursor: pointer;
}
.wheat-modal-footer {
  border-top: 1px solid #e6e6e6;
  height: 54px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
}
.wheat-modal-content {
  box-sizing: border-box;
  flex: 1;
  overflow: auto;
  padding: 24px;
}

</style>
<div class="wheat-modal">
  <div class="wheat-modal-mask"></div>
  <div class="wheat-modal-container">
    <div class="wheat-modal-wrapper">
      <div class="wheat-modal-header">
        <span class="wheat-modal-header-text"></span>
        <span class="wheat-modal-header-close">X</span>
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
    return ['visiable', 'title']
  }
  attributeChangedCallback(name, oldVal, newVal) {
    this.$modalRoot.style.display =
      name === 'visiable' && newVal !== 'false' ? 'block' : 'none'
    if (name === 'visiable' && newVal !== 'false') {
      this.$mask.classList.add('wheat-modal-mask-show')
      this.$wrapper.classList.add('wheat-modal-wrapper-show')
    }
  }

  connectedCallback() {
    this._shadowRoot.querySelector(
      '.wheat-modal-header-text'
    ).innerHTML = this.data.title
    this._shadowRoot.querySelector('.wheat-modal-content')
    console.log(this.data)
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
  hide() {
    this.$cancelBtn = this._shadowRoot.querySelector(
      '.wheat-modal-footer-cancel'
    )

    // 添加自定义事件
    this.$cancelBtn.addEventListener('click', () => {
      this.dispatchEvent(
        // 自定义事件
        new CustomEvent('onCancel', {
          detail: { visiable: false }
        })
      )
    })

    // 添加自定义事件
    this.$closeBtn.addEventListener('click', () => {
      this.dispatchEvent(
        // 自定义事件
        new CustomEvent('onCancel', {
          detail: { visiable: false }
        })
      )
    })
    this.data.maskCloseable === 'true' &&
      this.$mask.addEventListener('click', () => {
        this.$modalRoot.style.display = 'none'
      })
  }
  show() {
    this.$confirmBtn = this._shadowRoot.querySelector(
      '.wheat-modal-footer-confirm'
    )
    // 添加自定义事件
    this.$confirmBtn.addEventListener('click', () => {
      this.dispatchEvent(
        // 自定义事件
        new CustomEvent('onConfirm', {
          detail: { isConfirmed: true }
        })
      )
    })
  }
  renderShadowDom() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(WheatModaltemplate.content.cloneNode(true))
  }
}
// this需要讲解
window.customElements.define('wheat-modal', WheatModal)
