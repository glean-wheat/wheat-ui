import * as styleContent from './card.scss'
import { parseCss, watchAttributess } from '../utils/utils'

const template = document.createElement('template')
const prefix = 'wheat-card'

const styles = `
<style>
    ${parseCss(styleContent)}
  </style>`

template.innerHTML = `
  ${styles}
  <div class="wheat-card">
    <div class="wheat-card__title">
    </div>
    <div class="hi-card__content">
      <slot name="content"></slot>
    </div>
  </div>
`

class WheatCard extends HTMLElement {
  constructor() {
    super()
    this.render()
    this.$card = this._shadowRoot.querySelector('.wheat-card')
  }

  static get observedAttributes() {
    return ['title']
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this[name] = newVal
  }

  set title(value) {
    this.$card.querySelector('.wheat-card__title').innerHTML = value
  }

  setDisabled(name, oldVal, newVal) {
    if (name === 'disabled') {
      this.$card.setAttribute(name, newVal)
      newVal === 'false' && this.$card.removeAttribute(name)
    }
  }

  initBtnStyle() {
    const prefixclassType = 'wheat-card--type--'
    const prefixclassAppearance = 'wheat-card--appearance--'
    const prefixSizeClass = 'wheat-card--size--'
    const size = prefixSizeClass + (this.getAttribute('size') || 'default')
    const type = prefixclassType + (this.getAttribute('type') || 'primary')
    const appearance = prefixclassAppearance + (this.getAttribute('appearance') || 'button')
    this.$card.classList.add(type, appearance, size)
  }

  connectedCallback() {
    this.initBtnStyle()
  }
  render() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))
    // Apply external styles to the shadow dom
  }
}
// 判定是否已经被注册
!window.customElements.get(prefix) && window.customElements.define(prefix, WheatCard)
