const template = document.createElement('template')
const templateTagA = document.createElement('template')
const styles = `
<style>
    .wheat-button-container {
      padding: 8px;
    }
    .wheat-button {
      position: relative;
      display: inline-block;
      -webkit-box-sizing: border-box;
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
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      cursor: pointer;
      -webkit-transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
        color 0.3s ease-in, -webkit-box-shadow 0.15s ease-in;
      transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
        color 0.3s ease-in, -webkit-box-shadow 0.15s ease-in;
      transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
        box-shadow 0.15s ease-in, color 0.3s ease-in;
      transition: background-color 0.3s ease-in, border-color 0.3s ease-in,
        box-shadow 0.15s ease-in, color 0.3s ease-in,
        -webkit-box-shadow 0.15s ease-in;
    }
    .wheat-button.wheat-button--appearance--link {
      background-color: transparent !important;
      border: none !important;
      -webkit-box-shadow: none !important;
      box-shadow: none !important;
    }
    .wheat-button--type--primary {
      background-color: var(--color-primary);
      color: var(--color-white);
    }
    .wheat-button--type--primary:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-primary-30);
      box-shadow: 0 0 0 2px var(--color-primary-30);
    }
    .wheat-button--type--primary:not(.wheat-button--disabled):hover {
      background-color: var(--color-primary-60);
      color: var(--color-white);
    }
    .wheat-button--type--primary:not(.wheat-button--disabled):active {
      background-color: var(--color-primary-70);
      color: var(--color-white);
    }
    .wheat-button--type--primary.wheat-button--disabled:not(.wheat-button--loading),
    .wheat-button--type--primary[disabled]:not(.wheat-button--loading) {
      background-color: var(--color-primary-30);
      color: var(--color-white);
    }
    .wheat-button--type--primary.wheat-button--appearance--link {
      color: var(--color-primary);
    }
    .wheat-button--type--primary.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-primary-70);
    }
    .wheat-button--type--primary.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--primary.wheat-button--appearance--link[disabled] {
      color: var(--color-primary);
      opacity: 0.54;
    }
    .wheat-button--type--line {
      background-color: var(--color-primary-20);
      border-color: var(--color-primary-40);
      color: var(--color-primary);
    }
    .wheat-button--type--line:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-primary-30);
      box-shadow: 0 0 0 2px var(--color-primary-30);
    }
    .wheat-button--type--line:not(.wheat-button--disabled):hover {
      border-color: rgba(var(--color-primary), 0.8);
      color: var(--color-primary);
    }
    .wheat-button--type--line:not(.wheat-button--disabled):active {
      background-color: rgba(var(--color-primary), 0.15);
      color: var(--color-primary);
    }
    .wheat-button--type--line.wheat-button--disabled:not(.wheat-button--loading),
    .wheat-button--type--line[disabled]:not(.wheat-button--loading) {
      border-color: var(--color-primary-30);
      color: var(--color-primary-40);
    }
    .wheat-button--type--line.wheat-button--appearance--link {
      color: var(--color-primary);
    }
    .wheat-button--type--line.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-primary-50);
    }
    .wheat-button--type--line.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--line.wheat-button--appearance--link[disabled] {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-primary);
      opacity: 0.54;
    }
    .wheat-button--type--default:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-primary-30);
      box-shadow: 0 0 0 2px var(--color-primary-30);
    }
    .wheat-button:focus {
      outline: 0;
      z-index: 1;
    }
    .wheat-button + .wheat-button {
      margin-left: 8px;
    }
    .wheat-button .hi-icon {
      margin-right: 4px;
    }
    .wheat-button--size--large {
      height: 54px;
      padding: 13px 60px;
      font-size: 18px;
      line-height: 26px;
    }
    .wheat-button--size--large.wheat-button--icon {
      padding-left: 17px;
      padding-right: 17px;
    }
    .wheat-button--size--large .hi-icon {
      margin-right: 4px;
    }
    .wheat-button--size--small {
      height: 22px;
      padding: 1px 11px;
      font-size: 12px;
      line-height: 18px;
    }
    .wheat-button--size--small.wheat-button--icon {
      padding-left: 5px;
      padding-right: 5px;
    }
    .wheat-button--size--small .hi-icon {
      margin-right: 2px;
    }
    .wheat-button--icon {
      padding-left: 8px;
      padding-right: 8px;
    }
    .wheat-button--icon .hi-icon {
      margin-right: 0;
    }
    .wheat-button--type--default,
    .wheat-button--type--info {
      background-color: var(--color-white);
      border-color: var(--color-gray-30);
      color: var(--color-black);
    }
    .wheat-button--type--default:not(.wheat-button--disabled):hover,
    .wheat-button--type--info:not(.wheat-button--disabled):hover {
      border-color: var(--color-gray-50);
      color: var(--color-black);
    }
    .wheat-button--type--default:not(.wheat-button--disabled):active,
    .wheat-button--type--info:not(.wheat-button--disabled):active {
      background-color: var(--color-gray-20);
      color: var(--color-black);
    }
    .wheat-button--type--default.wheat-button--disabled,
    .wheat-button--type--default[disabled],
    .wheat-button--type--info.wheat-button--disabled,
    .wheat-button--type--info[disabled] {
      background-color: var(--color-gray-20);
      border-color: var(--color-gray-30);
      color: var(--color-gray-50);
    }
    .wheat-button--type--default.wheat-button--appearance--link:not(.wheat-button--disabled):hover,
    .wheat-button--type--info.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-gray-70);
    }
    .wheat-button--type--default.wheat-button--appearance--link:not(.wheat-button--disabled):active,
    .wheat-button--type--info.wheat-button--appearance--link:not(.wheat-button--disabled):active {
      color: var(--color-black);
    }
    .wheat-button--type--default.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--default.wheat-button--appearance--link[disabled],
    .wheat-button--type--info.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--info.wheat-button--appearance--link[disabled] {
      color: var(--color-black);
      opacity: 0.54;
    }
    .wheat-button--type--success {
      background-color: var(--color-success-20);
      border-color: var(--color-success-40);
      color: var(--color-success);
    }
    .wheat-button--type--success:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-success-30);
      box-shadow: 0 0 0 2px var(--color-success-30);
    }
    .wheat-button--type--success:not(.wheat-button--disabled):hover {
      border-color: rgba(var(--color-success), 0.8);
      color: var(--color-success);
    }
    .wheat-button--type--success:not(.wheat-button--disabled):active {
      background-color: rgba(var(--color-success), 0.15);
      color: var(--color-success);
    }
    .wheat-button--type--success.wheat-button--disabled:not(.wheat-button--loading),
    .wheat-button--type--success[disabled]:not(.wheat-button--loading) {
      border-color: var(--color-success-30);
      color: var(--color-success-40);
    }
    .wheat-button--type--success.wheat-button--appearance--link {
      color: var(--color-success);
    }
    .wheat-button--type--success.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-success-50);
    }
    .wheat-button--type--success.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--success.wheat-button--appearance--link[disabled] {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-success);
      opacity: 0.54;
    }
    .wheat-button--type--danger {
      background-color: var(--color-danger-20);
      border-color: var(--color-danger-40);
      color: var(--color-danger);
    }
    .wheat-button--type--danger:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-danger-30);
      box-shadow: 0 0 0 2px var(--color-danger-30);
    }
    .wheat-button--type--danger:not(.wheat-button--disabled):hover {
      border-color: rgba(var(--color-danger), 0.8);
      color: var(--color-danger);
    }
    .wheat-button--type--danger:not(.wheat-button--disabled):active {
      background-color: rgba(var(--color-danger), 0.15);
      color: var(--color-danger);
    }
    .wheat-button--type--danger.wheat-button--disabled:not(.wheat-button--loading),
    .wheat-button--type--danger[disabled]:not(.wheat-button--loading) {
      border-color: var(--color-danger-30);
      color: var(--color-danger-40);
    }
    .wheat-button--type--danger.wheat-button--appearance--link {
      color: var(--color-danger);
    }
    .wheat-button--type--danger.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-danger-50);
    }
    .wheat-button--type--danger.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--danger.wheat-button--appearance--link[disabled] {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-danger);
      opacity: 0.54;
    }
    .wheat-button--type--warning {
      background-color: var(--color-warning-20);
      border-color: var(--color-warning-40);
      color: var(--color-warning);
    }
    .wheat-button--type--warning:not(.wheat-button--disabled):focus {
      -webkit-box-shadow: 0 0 0 2px var(--color-warning-30);
      box-shadow: 0 0 0 2px var(--color-warning-30);
    }
    .wheat-button--type--warning:not(.wheat-button--disabled):hover {
      border-color: rgba(var(--color-warning), 0.8);
      color: var(--color-warning);
    }
    .wheat-button--type--warning:not(.wheat-button--disabled):active {
      background-color: rgba(var(--color-warning), 0.15);
      color: var(--color-warning);
    }
    .wheat-button--type--warning.wheat-button--disabled:not(.wheat-button--loading),
    .wheat-button--type--warning[disabled]:not(.wheat-button--loading) {
      border-color: var(--color-warning-30);
      color: var(--color-warning-40);
    }
    .wheat-button--type--warning.wheat-button--appearance--link {
      color: var(--color-warning);
    }
    .wheat-button--type--warning.wheat-button--appearance--link:not(.wheat-button--disabled):hover {
      color: var(--color-warning-50);
    }
    .wheat-button--type--warning.wheat-button--appearance--link.wheat-button--disabled,
    .wheat-button--type--warning.wheat-button--appearance--link[disabled] {
      background-color: transparent;
      border-color: transparent;
      color: var(--color-warning);
      opacity: 0.54;
    }
    .wheat-button--loading {
      position: relative;
    }
    .wheat-button--loading::before {
      position: absolute;
      top: -1px;
      bottom: -1px;
      left: -1px;
      right: -1px;
      content: '';
      background-color: var(--color-white);
      cursor: default;
      opacity: 0.4;
    }
    .wheat-button--loading--icon {
      display: inline-block;
      width: 1em;
      height: 1em;
      cursor: default;
    }
    .wheat-button--loading--icon svg {
      -webkit-animation: rotate 1s linear infinite;
      animation: rotate 1s linear infinite;
    }
    @-webkit-keyframes rotate {
      to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    @keyframes rotate {
      to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
      }
    }
    .wheat-button--disabled,
    .wheat-button[disabled]:not(.wheat-button--loading) {
      cursor: not-allowed;
    }
    .wheat-button--block {
      display: block;
      width: 100%;
    }
    .wheat-button--block + .wheat-button--block {
      margin-top: 4px;
    }
    .wheat-button-group {
      display: inline-block;
    }
    .wheat-button-group > .wheat-button {
      margin-left: 0;
      margin-right: 0;
    }
    .wheat-button-group > .wheat-button:hover {
      z-index: 1;
    }
    .wheat-button-group > .wheat-button:not(:first-child) {
      margin-left: -1px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .wheat-button-group > .wheat-button:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    
  </style>`

template.innerHTML = `
  ${styles}
  <div class="wheat-button-container">
    <button class='wheat-button'>
      <slot name='icon'/>
      Label
    </button>
  </div>
`
templateTagA.innerHTML = `
  ${styles}
  <div class="wheat-button-container">
    <a class='wheat-button'><slot name='icon'/>链接</a>
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
    return ['disabled', 'href']
  }
  attributeChangedCallback(name, oldVal, newVal) {
    name === 'disabled' && this.setDisabled(name, oldVal, newVal)
    name === 'href' && this.$button.setAttribute(name, newVal)
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
    const appearance =
      prefixclassAppearance + (this.getAttribute('appearance') || 'button')
    this.$button.classList.add(type, appearance, size)
  }

  connectedCallback() {
    this.initBtnStyle()
    this.$button.innerHTML = this.innerHTML
  }
  render() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    this._shadowRoot.appendChild(
      this.href
        ? templateTagA.content.cloneNode(true)
        : template.content.cloneNode(true)
    )
    // Apply external styles to the shadow dom
  }
}

window.customElements.define('wheat-button', WheatButton)
