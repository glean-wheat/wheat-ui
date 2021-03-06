export const parseCss = (styleContent) => {
    let string = styleContent.toString()
    const locals = styleContent.locals
    Object.keys(locals).forEach(key=>{
      var reg = new RegExp(locals[key],'g');
     string =  string.replace(reg, key)
    })
    return string
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