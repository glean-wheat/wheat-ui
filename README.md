# wheat-ui

通过 web components 打造全新组件库

## 适配所有框架

无论你的技术栈使用的是 angular、vue、react；不存在框架兼容问题，你就当做标签直接使用

## 示例
![image](https://user-images.githubusercontent.com/24740506/121101469-7a400980-c82e-11eb-9b25-ba99cc5a4041.png)

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
    <wheat-modal title="弹窗" visible="false" maskCloseable="true">
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
        detail: { visible }
      } = value
      console.log('触发取消方法')
      MyModalDom.setAttribute('visible', visible)
    })

    MyModalDom.addEventListener('onConfirm', (value) => {
      console.log('触发确定方法')
      MyModalDom.setAttribute('visible', false)
    })
    const showModal = () => {
      MyModalDom.setAttribute('visible', true)
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
  const [visible, setvisible] = useState(false)
  useEffect(() => {
    const MyModalDom = document.querySelector('wheat-modal')
    MyModalDom.addEventListener('onCancel', (value) => {
      const {
        detail: { visible }
      } = value
      console.log('触发取消方法')
      setvisible(visible)
    })

    MyModalDom.addEventListener('onConfirm', (value) => {
      console.log('触发确定方法')
      setvisible(false)
    })
  }, [])
  return (
    <div className="App">
      <button
        onClick={() => {
          setvisible(true)
        }}
      >
        显示弹框
      </button>
      <wheat-modal title="title" visible={visible}>
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
    <wheat-modal title="title" :visible="visible.toString()">
      <div slot="content">弹框内容</div>
    </wheat-modal>
    <div>{{ visible }}</div>
  </div>
</template>

<script>
import 'web-component-wheat-ui'

export default {
  data() {
    return {
      visible: false
    }
  },
  mounted() {
    const MyModalDom = document.querySelector('wheat-modal')
    MyModalDom.addEventListener('onCancel', (value) => {
      const {
        detail: { visible }
      } = value
      console.log('触发取消方法', value)
      this.visible = visible
    })

    MyModalDom.addEventListener('onConfirm', (value) => {
      console.log('触发确定方法', value)
      this.visible = false
      this.hidden()
    })
  },
  methods: {
    showModal() {
      this.visible = true
    },
    hidden() {
      this.visible = false
    }
  }
}
</script>
```

[更多>>](https://github.com/glean-wheat/wheat-ui/tree/master/src)

## 贡献流程
1.  添加 SSH 
2. clone 仓库

```
https://github.com/glean-wheat/wheat-ui
```
3. 新建 issue

发现问题或者有开发者提出的问题了后，在`https://github.com/glean-wheat/wheat-ui/issues`创建issue;

4. 在develop中拉取分支

- 根据第三步创建的`issue`后，根据生成的`id`,创建分支，一般`bug`类的 命名为 `hotfix/#+ issueID`; 新增功能 `feature/#+issueID`

eg:

```
feature/#3
```

5. 提交

- 提交的时可根据 `commitlint` 规范进行提交；描述信息为该 `issue`的`id`;这样`github`会根据`id`进行关联

eg:

```
git commit -m "feat: #3"
```

6: 提交PR

master 是保护分支；需要有 review 之后；才可合并
## 物料参考

- https://xiaomi.github.io/hiui/zh-CN

## 文档规划

- [ ] 文档接入； storybook
- [ ] 单测接入
- [ ] react、vue 使用样式案例

