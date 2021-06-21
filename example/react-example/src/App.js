/** disable-eslint */
import { useState, useRef, useEffect } from 'react'
import './App.css'
// import './wheatui/static/variables.css'
// import './wheatui/button'
// import './wheatui/modal'

// 基础样式文件
import 'web-component-wheat-ui/dist/static/variables.css'
import 'web-component-wheat-ui'

const App = () => {
  const [visible, setVisible] = useState(false)
  const myModal = useRef()
  useEffect(() => {
    myModal.current.addEventListener('onCancel', (e) => {
      console.log(e)
      setVisible(false)
    })
  }, [])
  return (
    <div className="App">
      <wheat-button
        onClick={() => {
          setVisible(true)
        }}
      >
        打开弹窗
      </wheat-button>

      <wheat-modal
        ref={myModal}
        title="弹窗是否打算"
        onCancel={(e) => {
          console.log('new', e)
        }}
        visible={visible}
      >
        <div slot="content">弹框内容</div>
      </wheat-modal>
    </div>
  )
}

export default App
