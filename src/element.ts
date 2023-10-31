
class ElementClass  {
  el: HTMLElement | undefined
  constructor(el: string | HTMLElement, className: string, props: Record<string, any>) {
    if(typeof el === 'string') {
      this.el = document.createElement(el)
    } else {  
      this.el = el
    }
    this.el!.className = className
    Object.keys(props).forEach((propKey) => {
      this.el!.setAttribute(propKey, props[propKey])
    })
  }

  setStyle(name: string, value: any) {
    if(name && this.el) {
      this.el!.style[name as any] = value
    }
  }

  hide() {
    this.setStyle('display', 'none')
  }

  show() {
    this.setStyle('display', 'block')
  }

  addClassName(className: string) {
    this.el?.classList.add(className)
  }

  active(activeClassName = 'active') {
    this.el?.classList.add(activeClassName)
  }

  addEvent(eventName: string, eventFunc: EventListener) {
    this.el?.addEventListener(eventName, eventFunc)
  }

  remove() {
    this.el?.remove()
  }

  child(arg: string | ElementClass | Node ) {
    let ele: any = arg;
    if (typeof arg === 'string') {
      ele = document.createTextNode(arg);
    } else if (arg instanceof ElementClass) {
      ele = arg.el;
    } 
    this.el?.appendChild(ele);
    return this
  }
  prepend(arg: string | ElementClass | Node ) {
    let ele: any = arg;
    if (typeof arg === 'string') {
      ele = document.createTextNode(arg);
    } else if (arg instanceof ElementClass) {
      ele = arg.el;
    } 
    this.el?.prepend(ele);
    return this
  }



  innerHTML(html: string) {
    if(this.el) {
      this.el!.innerHTML = html
    }
  }

};

const h = (el: string | HTMLElement, className: string = '', props: Record<string, any> ={}) => new ElementClass(el, className, props)
export {
  ElementClass,
  h
}