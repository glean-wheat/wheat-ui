# wheat-ui

通过 web component 打造全新组件库

## 适配所有框架

无论你的技术栈使用的是 angular、vue、react；不存在框架兼容问题，你就当做标签直接使用

## 在 html 中使用

### 将 dist 中的 wheat.ui.min.js 保存在本地或者 CDN 上，然后通过 script 引入即可

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Modal</title>
  </head>
  <style></style>
  <body>
    <button onclick="showModal()">显示弹框</button>
    <wheat-modal title="弹窗" visiable="false" maskCloseable="true">
      <div slot="content">
        弹框内容
      </div>
    </wheat-modal>
  </body>
  <script src="./dist/wheat.ui.min.js"></script>
  <script>
    const MyModalDom = document.querySelector('wheat-modal')

    MyModalDom.addEventListener('onCancel', (value) => {
      const {
        detail: { visiable }
      } = value
      console.log('触发取消方法')
      MyModalDom.setAttribute('visiable', visiable)
    })

    MyModalDom.addEventListener('onConfirm', (value) => {
      console.log('触发确定方法')
      MyModalDom.setAttribute('visiable', false)
    })
    const showModal = () => {
      MyModalDom.setAttribute('visiable', true)
    }
  </script>
</html>
```

## 在 angular、vue、react 项目中使用，

### 安装

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
    MyModalDom.addEventListener('onCancel', (value) => {
      const {
        detail: { visiable }
      } = value
      console.log('触发取消方法')
      setVisiable(visiable)
    })

    MyModalDom.addEventListener('onConfirm', (value) => {
      console.log('触发确定方法')
      setVisiable(false)
    })
  }, [])
  return (
    <div className="App">
      <button
        onClick={() => {
          setVisiable(true)
        }}
      >
        显示弹框
      </button>
      <wheat-modal title="title" visiable={visiable}>
        <div slot="content">弹框内容</div>
      </wheat-modal>
    </div>
  )
}

export default App
```

## 在 Vue 中使用

```vue
<template>
  <div>
    <button @click="showModal">
      显示弹框
    </button>
    <wheat-modal title="title" :visiable="visiable.toString()">
      <div slot="content">弹框内容</div>
    </wheat-modal>
    <div>{{ visiable }}</div>
  </div>
</template>

<script>
import 'web-component-wheat-ui'

export default {
  data() {
    return {
      visiable: false
    }
  },
  mounted() {
    const MyModalDom = document.querySelector('wheat-modal')
    MyModalDom.addEventListener('onCancel', (value) => {
      const {
        detail: { visiable }
      } = value
      console.log('触发取消方法', value)
      this.visiable = visiable
    })

    MyModalDom.addEventListener('onConfirm', (value) => {
      console.log('触发确定方法', value)
      this.visiable = false
      this.hidden()
    })
  },
  methods: {
    showModal() {
      this.visiable = true
    },
    hidden() {
      this.visiable = false
    }
  }
}
</script>
```

[更多>>](https://github.com/glean-wheat/wheat-ui/tree/master/src)

## 文档规划

左边是名称；中间是代码；右边是实时预览
