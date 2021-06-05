import * as styleContent from './input.scss'
import { parseCss } from '../utils/utils'
const template = document.createElement('template')
const prefix = 'wheat-input'

const styles = `
<style>
${parseCss(styleContent)}
</style>
`

template.innerHTML = `
${styles}
<div class="wheat-input text">
    <div class="wheat-input__out">
        <div class="wheat-input__inner">
            <input class="wheat-input__text " autocomplete="off" type="text" placeholder="请输入" value="">
        </div>
    </div>
</div>
`
class WheatInput extends HTMLElement {
  constructor() {
    super()
    this.render()
    this.$input = this._shadowRoot.querySelector('.wheat-input')
    this.$input.style.width = '240px'
  }
  render() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

!window.customElements.get(prefix) && window.customElements.define(prefix, WheatInput)
