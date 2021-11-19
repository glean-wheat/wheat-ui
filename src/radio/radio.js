import * as styleContent from './radio.scss'
import { parseCss } from '../utils/utils'

const WheatRadiotemplate = document.createElement('template')
const prefix = 'wheat-radio'


WheatRadiotemplate.innerHTML = `
<style>
${parseCss(styleContent)}
</style>
<div class="wheat-radio">
  <input class="input-radio" type="radio"></input>
</div> 
`
// HTMLElement HTMLParagraphElement
class WheatRadio extends HTMLElement {
  constructor() {
    super()
    this.data = {
      name: this.getAttribute('name'),
      value: this.getAttribute('value'),
      autoFocus: this.getAttribute('autoFocus') || 'false',
    }
    this.renderShadowDom()

    // this.setAttribute('type','radio')
    this.$rootRadio = this._shadowRoot.querySelector('.wheat-radio')
    this.$inputRadio = this._shadowRoot.querySelector('.input-radio')
    console.log('222',this.$rootRadio);
  }
  static get observedAttributes() {
    return ['value', 'autoFocus', 'checked',
    // 'disabled'
  ]
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
    console.log(name+'---'+oldVal+'----'+newVal);
    for (const key in this.data) {
      if (Object.hasOwnProperty.call(this.data, key)) {
        const element = this.data[key];
        console.log('---'+element);
        this.$inputRadio.setAttribute(key,element)
      }
    }

  }

  renderShadowDom() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(WheatRadiotemplate.content.cloneNode(true))

    
  }
}
 /**
   * 生命周期的执行顺序  挂载的时候 按照react 或者vue中的执行顺序是相同的
   * constructor -> attributeChangedCallback -> connectedCallback
   */
// this 指代该标签
!window.customElements.get(prefix) && window.customElements.define(prefix, WheatRadio)
