import {Tree, TreeOptions} from './tree'
import {h} from './element';
import { deepMerge } from './help';
interface Options extends TreeOptions{
  
}

const defaultOptions = {
  headerTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  contentId: ['article', 'main', 'body'],
  prefix: 'js'
}

let styleHtml = `
  :root {
    --toggler-color-bg: #f5f5f5;
    --color-border-default: #e6e6e6;
  }
  @media (prefers-color-scheme: dark) {
    --toggler-color-bg: dard;
  }
  a {
    decorator: none;
  }
`;
function setStyle(innerStyle: string) {
  styleHtml += innerStyle;
}

class Outline {
  tree: any
  options?: Options
  domId?: string
  styleDomId?: string

  //@ts-ignore
  constructor(el?: HTMLElement, options: Options) {
    console.log('Outline contructor')
    this.options = deepMerge(defaultOptions, options)
    this.domId = `${this.options.prefix}-outline`
    this.styleDomId = `${this.options.prefix}-style`;
    this.tree = new Tree(this.options)
    
    this.init(el)
  }


  init(el?: HTMLElement) {
    const allTags = this.tree.getAllTags();
    if (!allTags.length) {
      return;
    }
    this.clear()
    this.tree.getTags()
    if(el) {
    } else {
      this.generatorDom()
      this.insertStyle()
      this.events()
    }
  }

  events() {
    const {outlineItemClass, toggleClassName, wrapClassName, closeClassName} = this.getClassNames()
    document.querySelectorAll(`.${outlineItemClass}`).forEach((item: any) => {
      const handleClick = () => {
        const tag = item.dataset.tag;
        const target = getHeadingEleByDataId(tag);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        this.activeHandler();
      };
      item.addEventListener('click', handleClick);
    });
    window.addEventListener('scroll', this.activeHandler);
    document.querySelector(`.${toggleClassName}`)?.addEventListener('mouseenter', () => {
      (document.querySelector(`.${wrapClassName}`) as HTMLElement)?.style.setProperty('display', 'block');
      (document.querySelector(`.${toggleClassName}`) as HTMLElement)?.style.setProperty('display', 'none');
    });
    document.querySelector(`.${closeClassName}`)?.addEventListener('click', () => {
      (document.querySelector(`.${wrapClassName}`) as HTMLElement)?.style.setProperty('display', 'none');
      (document.querySelector(`.${toggleClassName}`) as HTMLElement)?.style.setProperty('display', 'block');
    });
}

getClassNames() {
  const {prefix} = this.options!
  return {
    ...this.tree.getClassNames(),
    outlineItemClass: `${prefix}-outline-item`,
    toggleClassName: `${prefix}-toggle`,

  }

}

activeHandler() {
  const {outlineItemClass, activeItemClassName} = this.getClassNames()
  const tags = this.tree.getAllTags();
  document.querySelectorAll(`.${outlineItemClass}`).forEach((node) => {
    node.classList.remove(activeItemClassName);
  });

  let lastDisNode: any;
  let viewFirstEleDis: any;
  const viewFirstEleIndex = tags.findIndex((tag: any) => {
    const ele = getHeadingEleByDataId(tag.tagNodeIndex);
    const dis = ele!.getBoundingClientRect().top;
    viewFirstEleDis = dis;
    return dis > 0;
  });
  if (viewFirstEleIndex == -1) {
    lastDisNode[tags.length - 1];
  }
  if (viewFirstEleIndex == 0) {
    lastDisNode = tags[0];
  }
  if (viewFirstEleIndex > 0) {
    if (viewFirstEleDis < 50) {
      lastDisNode = tags[viewFirstEleIndex];
    } else {
      lastDisNode = tags[viewFirstEleIndex - 1];
    }
  }
  getOutlineItemByDataTag(lastDisNode.tagNodeIndex!)?.classList.add(activeItemClassName);
}

  generatorDom() {
    const body = document.querySelector('body');
    const outlineEle = h('div', '', {id: this.domId})
    // const outlineEle = document.createElement('div');
    // outlineEle.id = domId;
  
    // const ul = document.createElement('ul');
    // ul.id = 'metismenu'
    // console.log('treeData', treeData);
  
    // 关闭按钮
  
    // 目录展示
    const { node: treeNode, style: treeStyle } = this.tree.generatorTree();
  
    outlineEle.child(treeNode);
  
    setStyle(treeStyle);
  
    // toggleEle
    const { node: toggleEle, style: toggleStyle } = this.generatorToggle();
  
    setStyle(toggleStyle);
    outlineEle.child(toggleEle);
    body?.appendChild(outlineEle!.el as Node);
  }

  generatorToggle() {
    const prefix = this.options!.prefix
    const toggleClassName = `${prefix}-toggle`;
    const html = `
    <div class="${toggleClassName}" style="display: block"> 
      <i class="${prefix}-toggle-icon" role="button"></i> 
      <div class="${prefix}-toggle__brand"><span>O</span>outline</div>  
      <div class="${prefix}-toggle__mover"></div> 
    </div>`;
  
    const toggleStyle = `
    .${toggleClassName} {
      --toggler-color-bg: #fff;
      --toggler-color-text: #6a6a6a;
      color: var(--color-fg-default,#24292f);
      background-color: var(--toggler-color-bg);
      box-shadow: 0 2px 8px var(--color-border-default,var(--color-border-primary));
      opacity: 1;
      line-height: 1;
      position: fixed;
      right: 0;
      top: 50vh;
      text-align: center;
      width: 30px;
      z-index: 1000000001;
      cursor: pointer;
      border-radius: 0px 6px 6px 0px;
      border-width: 1.5px 1.5px 1.5px;
      border-style: solid solid solid none;
      border-color: rgb(207, 215, 223) rgb(207, 215, 223) rgb(207, 215, 223);
      border-image: initial;
      border-left: none;
      padding: 2px 0px 32px;
      transition: right 0.25s ease-in 0.2s, opacity 0.35s ease-in 0.2s;
    }
    .${prefix}-toggle-icon {
      position: relative;
      opacity: 0.65;
      pointer-events: none;
      top: 5px;
    }
    .${prefix}-toggle-icon::before {
      // color: var(--toggler-color-text);
      // content: "";
      // font-size: 15px;
      // top: 0px;
      // width: 16px;
      // display: inline-block;
      // font-weight: 400;
      // position: relative;
      // font-variant: normal;
  }
    .${prefix}-toggle__brand {
      color: var(--toggler-color-text);
      display: inline-block;
      pointer-events: none;
      font-size: 14px;
      position: relative;
      top: 10px;
      transform: rotate(-180deg);
      writing-mode: tb-rl;
    }
    .${prefix}-toggle__brand > span {
      color: rgb(255, 92, 0) !important;
    }
    .${prefix}-toggle__mover {
      position: absolute;
      margin-left: 1px;
      bottom: -2px;
      left: -2px;
      right: -2px;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 24px;
      vertical-align: middle;
      user-select: none;
      cursor: move;
      opacity: 0.4;
      transition: opacity 0.1s ease 0s;
    }
    .${prefix}-toggle__mover::before {
      content: "";
      height: 2px;
      min-height: 2px;
      width: 12px;
      display: block;
      background-color: var(--toggler-color-text);
      border-radius: 1px;
    }
    .${prefix}-toggle__mover::after {
      margin-top: 2px;
    }
    .${prefix}-toggle__mover::after {
      content: "";
      height: 2px;
      min-height: 2px;
      width: 12px;
      display: block;
      background-color: var(--toggler-color-text);
      border-radius: 1px;
    }
  
  `;
    const toggleWrap = document.createElement('div');
    toggleWrap.innerHTML = html;
    return { node: toggleWrap, style: toggleStyle };
  }

  insertStyle() {
    const styleEl = h('style', '', {id: this.styleDomId})
    styleEl.innerHTML(styleHtml)
    const head = document.querySelector('head')
    if(head) {
      const headEl = h(head)
      headEl.child(styleEl);
    }
  }

  clear() {
    const styleDom = document.querySelector(`#${this.styleDomId}`);
    const bodyDom = document.querySelector(`#${this.domId}`);
    if (styleDom) {
      styleDom!.remove();
    }
    if (bodyDom) {
      bodyDom!.remove();
    }
  }

}

function getOutlineItemByDataTag(tag: string) {
  return document.querySelector(`[data-tag=${tag}]`);
}

function getHeadingEleByDataId(id: string) {
  return document.querySelector(`[data-id=${id}]`);
}

// new Outline()

export { Outline }