import React from 'react'
import ReactDOM from 'react-dom/client'
import * as antdComponent from 'antd'
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
    this.tableProps = {};
    // 给默认值
    this.changeFn = (e) => {}
    this.render()

  }

  setTableProps(props) {
    this.tableProps = props;
    this.renderReactElement();
  }

  setDataSource(data){
    this['table-data'] = data;
    this.renderReactElement();
  }
  parseRender (renderObj, text, row) {
    const renderInfo = renderObj.render(text, row)
    const renderNode = (item, rowText, row) => {
      if(item === null) return null;
      const {componentName, tagName, ...other} = item
      if(antdComponent && componentName && antdComponent[componentName]){
        const Component = antdComponent[componentName]
        return <Component {...other}/>
      }
      return React.createElement(tagName, {...other}, item.children)
    }
    if(Array.isArray(renderInfo)){
      return renderInfo.map(item => {
        return renderNode(item, text, row)
      })
    } else {
      return renderNode(renderInfo, text, row)
    }
  }

  setColumns(columns) {
    const columnsData = [];
    columns.forEach(item => {
      const _item = {}
      Object.keys(item).forEach(key => {
        if(key === 'render'){
          _item.render = (text, row) => {
            return this.parseRender(item, text, row)
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

  
  renderReactElement() {
    const data = this['table-data'];
    const Table = antdComponent['Table']
    this.root.render(<Table columns={this.columns} dataSource={data} {...this.tableProps} />);
  }

  connectedCallback() {
    this.renderReactElement()
  }
  render() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    const mountPoint = template.content.cloneNode(true);
    this._shadowRoot.appendChild(mountPoint);
    this.$table = this._shadowRoot.querySelector('.wheat-table')
    this.root = ReactDOM.createRoot(this.$table);
  }

}

// 判定是否已经被注册
!window.customElements.get(prefix) && window.customElements.define(prefix, WheatTable)
