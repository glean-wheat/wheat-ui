class AbstractClass extends HTMLElement {
  constructor() {
    super()
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
}


/**
 * // Instead of extending HTMLElement directly, we can now extend our AbstractClass
class SomeElement extends AbstractClass {  }
customElements.define('some-element', SomeElement);
 */