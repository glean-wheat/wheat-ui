import React from 'react'
import ReactDOM from 'react-dom/client'
import Table from 'antd/es/table'
// import Tag from 'antd/es/tag'
// import Space from 'antd/es/space'
import Input from 'antd/es/input'
import * as styleContent from './table.scss'

const template = document.createElement('template')
const prefix = 'wheat-table'


const styles = `
<style>
    ${styleContent}
  </style>`

template.innerHTML = `
  ${styles}
  <div class="wheat-table">
  </div>
`

class WheatTable extends HTMLElement {
  constructor() {
    super()
    this.tableData = [];
    this.columns = [];
    // 给默认值
    this.changeFn = (e) => {}
    console.log('react', React.createElement)
    this.render()
  }

  static get observedAttributes() {
    return ['table-data', 'columns']
  }
  setChangeFn(fn) {
    console.log('fn', fn)
    this.changeFn = fn
  }

  setColumns(columns) {
    console.log('columns', columns)
    const columnsData = [];
    columns.forEach(item => {
      const _item = {}
      Object.keys(item).forEach(key => {
        if(key === 'render'){
          console.log('item.render(text)', )
          _item.render = (text) => {
            const {type, ...other} = item.render(text)
            console.log('type', type);
            if(type === 'Input'){
              return <Input {...other}/>
            }
            return React.createElement(type, {...other}, text)
          };
        } else {
          _item[key] = item[key]
        }
      })
      columnsData.push(_item)
    })
    this.columns = columnsData
    this.renderReactElement()
  }

  attributeChangedCallback(name, oldVal, newVal) {
    console.log('属性发生变化', name, oldVal, newVal, typeof newVal)
    if(name === 'inputchange') {
      this.inputChangeCallback = new Function(newVal) ;
      console.log('inputchange', this.inputChangeCallback);
    } else if(typeof newVal === 'string'){
      this[name] = JSON.parse(newVal)
    }
    // const a = eval(newVal)
    // console.log(a)
    this.renderReactElement()
  }
  renderReactElement() {
    const data = this['table-data'];
    const root = ReactDOM.createRoot(this.$table);
    root.render(<Table columns={this.columns} dataSource={data} />);
  }

  connectedCallback() {
    console.log('----', this.tableData, this.columns)
    this.renderReactElement()
  }
  render() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    const mountPoint = template.content.cloneNode(true);
    this._shadowRoot.appendChild(mountPoint);
    this.$table = this._shadowRoot.querySelector('.wheat-table')
  }

}

// 判定是否已经被注册
!window.customElements.get(prefix) && window.customElements.define(prefix, WheatTable)
