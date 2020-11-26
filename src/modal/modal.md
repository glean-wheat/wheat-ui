
## 在 React 中使用
```js
import React, { useState, useEffect } from 'react'
import 'web-component-wheat-ui/dist/modal'
import 'web-component-wheat-ui/dist/button'
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
     <wheat-button  onClick={() => {
          setVisiable(true)
        }} id="open" type="line">
      打开弹框
    </wheat-button>
    <wheat-modal title='title' visiable={visiable}>
      <div slot='wheat-modal-close-icon'>close</div>
      <div slot='content'>弹框内容</div>
    </wheat-modal>
    </div>
  )
}

export default App
```
## Attribute

| 参数          | 说明                       | 类型                | 可选值               | 默认值    |
| ------------- | -------------------------- | ------------------- | -------------------- | --------- |
| title         | 模态框标题                 | string \| ReactNode | -                    | -         |
| visible       | 是否显示模态框             | boolean             | true \| false        | false     |
| closeable     | 是否展示右上角关闭按钮     | boolean             | true \| false        | true      |
| maskClosable | 是否允许点击蒙层关闭模态框 | boolean             | true \| false        | true      |
| cancelText    | 取消按钮文案               | string              | -                    | '取消'    |
| confirmText   | 确认按钮文案               | string              | -                    | '确定'    |
| style         | 自定义模态框样式           | object              | -                    | -         |
| footer        | 自定义模态框底部           | ReactNode \| null   | -                    | -         |