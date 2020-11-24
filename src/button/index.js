const template = document.createElement('template')

template.innerHTML = `
  <style>
    .wheat-button-container {
      padding: 8px;
    }
    .wheat-button {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        margin: 0;
        height: 32px;
        padding: 4px 15px;
        border: 1px solid transparent;
        border-radius: 2px;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        text-align: center;
        text-decoration: none;
        vertical-align: middle;
        white-space: nowrap;
        touch-action: manipulation;
        cursor: pointer;
        transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
          color 0.3s ease-in, -webkit-box-shadow 0.15s ease-in;
        transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
          box-shadow 0.15s ease-in, color 0.3s ease-in;
        transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
          box-shadow 0.15s ease-in, color 0.3s ease-in,
          -webkit-box-shadow 0.15s ease-in;
          outline: none;
    }
    .line {
        background-color: #f0f5fe;
        border-color: #b4cffb;
    }
    .primary {
        background-color: #4387f4;
        color: #fff;
    }
  </style>
 
  <div class="wheat-button-container">
    <button class='wheat-button'>Label</button>
  </div>
`

class WheatButton extends HTMLElement {
  constructor() {
    super()
    this.renderShadowDom()
  }
  connectedCallback() {
    this.$button = this._shadowRoot.querySelector('.wheat-button')
    const type = this.getAttribute('type') || 'primary'
    this.$button.classList.add(type)
    this.$button.innerHTML = this.innerHTML
    this.$button.addEventListener('click', () => {
      new CustomEvent('click', {
        detail: { visiable: false }
      })
    })
  }
  renderShadowDom() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(WheatModaltemplate.content.cloneNode(true))
  }
}

window.customElements.define('wheat-button', WheatButton)
