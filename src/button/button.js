import * as styleContent from './button.scss'
import { parseCss } from '../utils/utils'

const template = document.createElement('template')
const templateTagA = document.createElement('template')
const prefix = 'wheat-button'

const styles = `
<style>
    ${parseCss(styleContent)}
  </style>`

template.innerHTML = `
  ${styles}
  <div class="wheat-button-container">
    <button class='wheat-button'>
      <span class='wheat-content'>label</span>
    </button>
    <slot name='icon'/>
  </div>
`
templateTagA.innerHTML = `
  ${styles}
  <div class="wheat-button-container">
    <a class='wheat-button'>
    <span class='wheat-content'>label</span>
    <slot name='icon'/>
    </a>
  </div>
`

class WheatButton extends HTMLElement {
  constructor() {
    super()
    this.href = this.getAttribute('href')
    this.render()
    this.$button = this._shadowRoot.querySelector('.wheat-button')
  }

  static get observedAttributes() {
    return ['disabled', 'href', 'target']
  }

  attributeChangedCallback(name, oldVal, newVal) {
    name === 'disabled' && this.setDisabled(name, oldVal, newVal)
    name === 'href' && this.$button.setAttribute(name, newVal)
    name === 'target' && this.$button.setAttribute(name, newVal)
  }

  setDisabled(name, oldVal, newVal) {
    if (name === 'disabled') {
      this.$button.setAttribute(name, newVal)
      newVal === 'false' && this.$button.removeAttribute(name)
    }
  }

  initBtnStyle() {
    const prefixclassType = 'wheat-button--type--'
    const prefixclassAppearance = 'wheat-button--appearance--'
    const prefixSizeClass = 'wheat-button--size--'
    const size = prefixSizeClass + (this.getAttribute('size') || 'default')
    const type = prefixclassType + (this.getAttribute('type') || 'primary')
    const appearance = prefixclassAppearance + (this.getAttribute('appearance') || 'button')
    this.$button.classList.add(type, appearance, size)
  }

  connectedCallback() {
    this.initBtnStyle()
    console.log('this.innerHTML', this.innerHTML);
    this.$button.innerHTML = this.innerHTML
  }
  render() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(this.href ? templateTagA.content.cloneNode(true) : template.content.cloneNode(true))
    // Apply external styles to the shadow dom
  }
}
// 判定是否已经被注册
!window.customElements.get(prefix) && window.customElements.define(prefix, WheatButton)
