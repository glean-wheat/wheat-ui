# wheat-ui

通过 web component 打造全新组件库

## 适配所有框架

无论你的技术栈使用的是 angular、vue、react；不存在框架兼容问题，你就当做标签直接使用

## 安装

```bash
npm i web-component-wheat-ui

```

## 使用

```bash
import 'web-component-wheat-ui'

```

## 在 React 中使用

```jsx
import React, { useState, useEffect } from 'react'
import 'web-component-wheat-ui'
const App = () => {
  const [visiable, setVisiable] = useState(false)
  useEffect(() => {
    const MyModalDom = document.querySelector('wheat-modal')
    MyModalDom.addEventListener('onCancel', value => {
      const {
        detail: { visiable }
      } = value
      console.log('触发取消方法')
      setVisiable(visiable)
    })

    MyModalDom.addEventListener('onConfirm', value => {
      console.log('触发确定方法')
      setVisiable(false)
    })
  }, [])
  return (
    <div className='App'>
      <button
        onClick={() => {
          setVisiable(true)
        }}
      >
        显示弹框
      </button>
      <wheat-modal title='title' visiable={visiable}>
        <div slot='content'>弹框内容</div>
      </wheat-modal>
    </div>
  )
}

export default App
```

## 在 Vue 中使用
