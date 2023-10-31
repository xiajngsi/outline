import {Tree, TreeOptions} from './tree'
import { ElementClass, h } from './element';
import { getContentIdBySiteMap} from './help';
import {Tab} from './tab';
import {Container} from './container';
interface Options extends TreeOptions {
  siteContentIdMap?: Record<string, string>// 网站和文章内容选择器的 map
  contentIds?: string[] // 从一个选择器往后遍历，找到了选择器就会从选择器中生成 toc
}

const defaultWebsiteMap = {
  'reactrouter.com': '.md-prose',
  'infoq.cn': '.article-main',
  'cnblogs.com': '#cnblogs_post_body'
}

const defaultOptions = {
  headerTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  contentIds: ['article', 'main', 'body'],
  siteContentIdMap: defaultWebsiteMap, // 和 contentId 同时传，优先级比 contentId 高
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

const tabs = [
  {label: '目录', value: 'toc'}, 
  {label: '总结', value: 'summarize'},
  {label: '全文翻译', value: 'translate'}]
class Outline {
  tree?: Tree
  options?: TreeOptions
  domId?: string
  styleDomId?: string
  treeNode: any
  originOptions: Options


  containerEl?: Container

  //@ts-ignore
  constructor(el?: HTMLElement, options: Options) {
    this.originOptions = options
    this.options = this.transformOptions(options)
    
    this.domId = `${this.options.prefix}-outline`
    this.styleDomId = `${this.options.prefix}-style`;
    this.init() 
  }

  transformOptions = (options?: Options) => {
    const {siteContentIdMap = {}, contentIds = [], headerTags = [], prefix } = options || {}
    const resultOptions: TreeOptions = {...options}

    let siteContentId
    let contentPiriority = [...contentIds, ...defaultOptions.contentIds]

    if(siteContentIdMap) {
      siteContentId = getContentIdBySiteMap({...defaultOptions.siteContentIdMap, ...siteContentIdMap})  
      if(siteContentId) {
        contentPiriority = [siteContentId, ...contentPiriority]
      }   
    }
    const resultId = contentPiriority.find((selector) => {
        return document.querySelector(selector);
      });
    resultOptions.contentId = resultId

    const {host} = location  
    if(!Array.isArray(headerTags) || headerTags.length === 0) {
      if ( host.startsWith('aliyuque')) {
        const headTagPrefix = 'ne-h';
        //@ts-ignore
        resultOptions.headerTags = new Array(6).map((item, index) => `${headTagPrefix}${index}`)
      } if (host === 'chat.openai.com') {
        resultOptions.headerTags = ['div[data-message-author-role="user"] > div']
      } 
      else {
        resultOptions.headerTags = defaultOptions.headerTags
      }
    }

    if(!prefix) {
      resultOptions.prefix = defaultOptions.prefix
    }

    return resultOptions
  }

  getBaseStyle = () => {
    const baseHtml = `
      ${this.domId} {
        li {

        }
        ul {

        }
      }
    `
    return baseHtml
  }
  tabInstance?: Tab

  handleTabClick(key) {
    console.log(key)
  }

  initTabs = () => {
    this.tabInstance = new Tab(this.options)
    this.tabInstance.generatorDom({tabs, onClick: this.handleTabClick})
    this.insertStyle(this.tabInstance.getStyle(), 'tabStyle')
    this.containerEl?.el.prepend(this.tabInstance?.el?.el)
  }


  init = (el?: HTMLElement) => {
    this.clear()
    if(el) {
    } else {
      
      this.generatorDom()
      setStyle(this.getBaseStyle())
      this.insertStyle(styleHtml, this.styleDomId)
      this.events()
    }
  }

  treeStyleId = 'treeStyleId'



  handleOpen = () => {
    // this.getArticleContent()
    const options = this.transformOptions(this.originOptions)
    this.tree = new Tree(options, this.getClassNames())
    const allTags = this.tree.getAllTags();
    if (!allTags.length) {
      return;
    }

    this.containerEl = new Container(this.options)
    const { closeClassName, outlineItemClass, toggleClassName } = this.getClassNames()
    this.tree.getTags()
    // @ts-ignore
    document.querySelector(`.${toggleClassName}`)?.style.setProperty('display', 'none');
    // 目录展示
    const { node: treeNode, style: treeStyle } = this.tree.generatorTree();
    this.treeNode = treeNode

    this.containerEl?.el?.child(treeNode)

    // const genSummarizeButton = this.generateArticleButton()
    // treeNode.insertBefore(genSummarizeButton.el, treeNode.firstChild)
    // document.querySelector(`#${this.domId}`)?.appendChild(genSummarizeButton.el);
    console.log(this.containerEl?.el?.el)
    document.querySelector(`#${this.domId}`)?.appendChild(this.containerEl?.el?.el);
    this.insertStyle(treeStyle + this.containerEl.getStyle(), this.treeStyleId)

  
    document.querySelector(`.${closeClassName}`)?.addEventListener('click', () => {
      this.handleClose()
    });
    document.querySelectorAll(`.${outlineItemClass}`).forEach((item) => {
      const handleClick = () => {
        // @ts-ignore
        const tag = item.dataset.tag!;
        const target = getHeadingEleByDataId(tag);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        this.activeHandler();
      };
      item.addEventListener('click', handleClick);
    });

    this.initTabs()
  }

  handleClose = () => { 
    const { toggleClassName } = this.getClassNames()
    this.treeNode.remove() 
    this.clearTreeStyle()  
    // @ts-ignore
    document.querySelector(`.${toggleClassName}`)?.style.setProperty('display', 'block');

  }

  events= () => {
    const { toggleClassName } = this.getClassNames()
    window.addEventListener('scroll', this.activeHandler);
    document.querySelector(`.${toggleClassName}`)?.addEventListener('mouseenter', () => {
      this.handleOpen()
    });
  }

  getClassNames = () => {
    const {prefix} = this.options!
    const wrapClassName = `_${prefix}-tree-wrap`;
    const activeItemClassName = `${prefix}-item-active`;
    const outlineItemClass = `${prefix}-outline-item`;

    return {
      wrapClassName,
      activeItemClassName,
      outlineItemClass,
      closeClassName:`${prefix}-close`,
      toggleClassName: `${prefix}-toggle`,
    }
  }

  activeHandler = () => {
    const {outlineItemClass, activeItemClassName} = this.getClassNames()
    if(!this.tree) {
      return
    }
    const tags = this.tree?.getAllTags();
    document.querySelectorAll(`.${outlineItemClass}`).forEach((node) => {
      node.classList.remove(activeItemClassName);
    });

    let lastDisNode;
    let viewFirstEleDis;
    const viewFirstEleIndex = tags.findIndex((tag) => {
      const ele = getHeadingEleByDataId(tag.tagNodeIndex);
      const dis = ele!.getBoundingClientRect().top;
      viewFirstEleDis = dis;
      return dis > 0;
    });
    if (viewFirstEleIndex == -1) {
      lastDisNode?.[tags.length - 1];
    }
    if (viewFirstEleIndex == 0) {
      lastDisNode = tags[0];
    }
    if (viewFirstEleIndex > 0) {
      if (viewFirstEleDis && viewFirstEleDis < 50) {
        lastDisNode = tags[viewFirstEleIndex];
      } else {
        lastDisNode = tags[viewFirstEleIndex - 1];
      }
    }
    if(lastDisNode) {
      getOutlineItemByDataTag(lastDisNode.tagNodeIndex!)?.classList.add(activeItemClassName);
    }
  }

  generatorDom = () => {
    const body = document.querySelector('body');
    const outlineEle = h('div', '', {id: this.domId})

    // toggleEle
    const { node: toggleEle, style: toggleStyle } = this.generatorToggle();
  
    setStyle(toggleStyle);
    outlineEle.child(toggleEle);
    body?.appendChild(outlineEle!.el as Node);
  }

  generatorToggle = () => {
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

  insertStyle = (_styleHtml: string, id?: string) => {
    if(id) {
      const styleEl = h('style', '', {id})
      styleEl.innerHTML(_styleHtml)
      const head = document.querySelector('head')
      if(head) {
        const headEl = h(head)
        headEl.child(styleEl);
      }
    }
  }

  onLoad = () => {
    window.addEventListener('load', () => {
      const allTags = this.tree?.getAllTags();
      let times = 0;
      let interval: number;
      if (!allTags?.length) {
        interval = setInterval(() => {
          times = times + 1;
          if (times >= 3) {
            clearInterval(interval);
          }
          this.init();
        }, 500);
        return;
      }
    });
  }

  clearTreeStyle = () => {
    const treeStyle = document.querySelector(`#${this.treeStyleId}`);
    treeStyle?.remove();
  }

  clear = () => {
    const styleDom = document.querySelector(`#${this.styleDomId}`);
    const bodyDom = document.querySelector(`#${this.domId}`);
    styleDom?.remove();
    bodyDom?.remove();
    this.clearTreeStyle()
  }
}





function getOutlineItemByDataTag(tag: string) {
  return document.querySelector(`[data-tag=${tag}]`);
}

function getHeadingEleByDataId(id: string) {
  return document.querySelector(`[data-id=${id}]`);
}

const outline = (el?: HTMLElement, options: Options = {}) => new Outline(el, options);

if (window) {
  // @ts-ignore
  window.js_outline = outline;
}

outline()

export default Outline
export { outline }