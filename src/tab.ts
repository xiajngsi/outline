import { h, ElementClass } from "./element";
interface TabOptions {
  prefix?: string // 样式名的前缀 默认 ‘js’
}

interface ITem {
  label: string,
  value: string
}

export class Tab {
  options: TabOptions
  el: ElementClass
  constructor(options: TabOptions) {
    this.options = options
  }

  generatorDom({tabs, onClick}: {tabs?: ITem[], onClick: (value: string) => void}) {
    const prefix = this.options.prefix
    this.el = h('div', `${prefix}-tab`)
    tabs?.forEach(tab => {
      const item = h('div', `${prefix}-tab-item`)
      item.innerHTML(tab.label)
      this.el.child(item)
      item.addEvent('click', () => {
        this.el.el?.childNodes.forEach((node: any) => {
          node.classList.remove('active')
        })
        onClick(tab.value)
        item.addClassName('active')
      })
    });
  }

  getStyle() {
    const {prefix} = this.options
    return `
      .${prefix}-tab {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .${prefix}-tab-item {
        padding: 2px 8px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
        font-size: 16px;
        width: 100%;
      }
      .${prefix}-tab-item.active {
        border-bottom: 1px solid #3245ff;
      }
    `
  }



}