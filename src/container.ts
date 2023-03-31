//  todo: 最外层的元素从 tree 中重构到这里面
import { h, ElementClass } from "./element";
interface Options {
  prefix?: string // 样式名的前缀 默认 ‘js’
}



export class Container {
  options: Options
  el: ElementClass
  constructor(options: Options) {
    this.options = options
    this.el = h('div', `${this.options.prefix}-tree-wrap`)
  }

  getStyle() {
    return `
    .${this.options.prefix}-tree-wrap {
      padding: 16px 0 0 0;
      background-color: white;
      position: fixed;
      top: 0;
      right:0;
      height: calc(100vh);
      width: 300px;
      z-index: 10002;
      overflow: auto;
      border-left: 1px solid #d0d7de;
    }`
  }
}
