import React from 'react'
import ReactDOM from 'react-dom/client'
import Table from 'antd/es/table'
import Tag from 'antd/es/tag'
import Space from 'antd/es/space'
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

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];


const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

class WheatTable extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    const mountPoint = template.content.cloneNode(true);
    this._shadowRoot.appendChild(mountPoint);
    this.$table = this._shadowRoot.querySelector('.wheat-table')


    // const name = this.getAttribute('name');
    // const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    const root = ReactDOM.createRoot(this.$table);
    root.render(<Table columns={columns} dataSource={data} />);
  }

}
// 判定是否已经被注册
!window.customElements.get(prefix) && window.customElements.define(prefix, WheatTable)
