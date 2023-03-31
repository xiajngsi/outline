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
      this.el.addEvent('click', () => {
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
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
      }
      .${prefix}-tab-item.active {
        background-color: #ccc;
      }
    `
  }



}