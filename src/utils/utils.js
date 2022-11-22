export const parseCss = (styleContent) => {
    return styleContent
    // let string = styleContent.toString()
    // const locals = styleContent.locals
    // console.log('styleContent', styleContent, string, locals)
    // Object.keys(locals).forEach(key=>{
    //   let searchbarValue = locals[key]
    //   let _keyword = searchbarValue
    //   _keyword = searchbarValue.includes('[') ? _keyword.replace(/\[/gi, '\\[') : _keyword
    //   _keyword = searchbarValue.includes('(') ? _keyword.replace(/\(/gi, '\\(') : _keyword
    //   _keyword = searchbarValue.includes(')') ? _keyword.replace(/\)/gi, '\\)') : _keyword
    //   _keyword = searchbarValue.includes('+') ? _keyword.replace(/\+/gi, '\\+') : _keyword
    //   console.log('reg', _keyword, key)
    //   var reg = new RegExp(_keyword,'g');
    //   string = string.replace(reg, key)
    // })
    // return string
  }

export const watchAttributess = (_this) => {
    const {observedAttributes = []} = _this.constructor
    if(observedAttributes.length){
      observedAttributes.forEach(attribute=>{
        Object.defineProperties(_this, attribute, {
          get() {
            return _this.getAttribute(attribute)
          },
          set(attribute) {
            if(attribute) {
              _this.setAttribute(attribute, attrValue)
            } else {
              _this.removeAttribute(attribute)
            }
          }
        })
      })
    }
}