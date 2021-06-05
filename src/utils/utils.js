export const parseCss = (styleContent) => {
    let string = styleContent.toString()
    const locals = styleContent.locals
    Object.keys(locals).forEach(key=>{
      var reg = new RegExp(locals[key],'g');
     string =  string.replace(reg, key)
    })
    return string
  }