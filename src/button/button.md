
## 在 React 中使用
```js
import 'web-component-wheat-ui/dist/button'

<wheat-button id="open" type="line" appearance="link" href="pp">
      <span slot="icon">+</span>
    打开弹框
</wheat-button>
```
## Attribute

| 参数       | 说明                                          | 类型    | 可选值                                                    | 默认值    |
| ---------- | --------------------------------------------- | ------- | --------------------------------------------------------- | --------- |
| type       | 设置按钮类型                                  | string  | 'primary' \| 'line' \| 'success' \| 'danger' \| 'default' | 'default' |
| appearance | 设置按钮外观                                  | string  | 'link' \| 'button'                                        | 'button'  |
| disabled   | 设置按钮是否禁用                              | boolean | true \| false                                             | false     |
| size       | 设置按钮尺寸                                  | string  | 'large' \| 'default' \| 'small'                           | 'default' |
| href       | 设置按钮链接，设置后将用 a 标签渲染按钮       | string  | ︎                                                         | -         |
| target     | 同 a 标签的 target 属性，仅在设置 href 后有效 | string  | ︎'\_self' \| '\_blank' \| '\_parent' \| '\_top'           | -         |
| loading    | 是否显示 loading                              | boolean | ︎-                                                        | false     |