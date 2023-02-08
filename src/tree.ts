import {deepMerge, getHeaderNumber, nodeAddAnchorName} from './help'

interface TreeOptions {
    headerTags?: string[], // 取标题的 tag, 必需能用罗文数字表达层级，默认 html 标签的 h1, h2 等，主要支持类似 yuque 改造后的 ne-h1 这种形式
    contentId?: string[] // 获取哪个内容的标题，默认的优先级是['article', 'main', 'body']
    prefix?: string // 样式名的前缀 默认 ‘js’
}

const defaultOptions = {
  headerTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  contentId: ['article', 'main', 'body'],
  prefix: 'js'
}
class Tree {
  treeData: any = {}
  options: TreeOptions
  wrapClassName: string
  activeItemClassName: string
  constructor(options: TreeOptions) {
    console.log('xxx Tree contructor')
    this.options = deepMerge(defaultOptions, options)
    this.wrapClassName = `_${this.options.prefix}-tree-wrap`;
    this.activeItemClassName = `${this.options.prefix}-item-active`;
  }

  getClassNames() {
    const {prefix} = this.options
    const wrapClassName = `_${prefix}-tree-wrap`;
    const activeItemClassName = `${prefix}-item-active`;
    const outlineItemClass = `${prefix}-outline-item`;

    return {
      wrapClassName,
      activeItemClassName,
      outlineItemClass,
      closeClassName:`${prefix}-close`
    }
  }

  generatorClose() {
    const {closeClassName} = this.getClassNames()
    const str = `<span class='${closeClassName}'>
    <svg t="1661342858920" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7263" width="15" height="15"><path d="M563.8 512l262.5-312.9c4.4-5.2 0.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-0.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" p-id="7264"></path></svg>
    </span>`;
    const style = `
      .${closeClassName} {
        position: absolute;
        top: 12px;
        right: 12px
      }
    `;
  
    return { domStr: str, style };
  }

  generatorTree = () => {
    const prefix = this.options.prefix
    const wrapClassName = this.wrapClassName
    const outlineItemClass = `${prefix}-outline-item`;
    const activeItemClassName = this.activeItemClassName

    const wrap = document.createElement('div');
    wrap.className = wrapClassName;
    wrap.setAttribute('style', `display: none`);
    const padding = 10;
    const { domStr: closedomStr, style: closeStyle } = this.generatorClose();
    // todo: generatorClose 抽象出来
    let ele = `${closedomStr}<div class='${prefix}-header'>outlint</div><ul class = "${prefix}-tree">`;
  
    const traverse = (nodeList: any, level: any) => {
      nodeList.forEach((node: any) => {
        const textNodeHtml = `${node.innerText} <span style='font-weight: 600'>${node.children ? `(${node.children.length})` : ''}</span>`;
        const aElement = level == 0 ? `<a class="has-arrow" aria-expanded="true" >${textNodeHtml}</a>` : `<a aria-expanded="true" >${textNodeHtml}</a>`;
        ele = ele + `<li style="padding-left:${padding * level}px" class='${outlineItemClass}' data-tag='${node.tagNodeIndex}'>${aElement}</li>`;
        if (node.children) {
          traverse(node.children, level + 1);
        }
      });
    };
    traverse(this.treeData.children, 1);
    ele += '</ul>';
    wrap.innerHTML = ele;
  
    // const style = document.createElement('style');
    const treeStyle = `
      ${closeStyle}
      .${outlineItemClass} {
        list-style-type: none;
        cursor: pointer
      }
      .${outlineItemClass} a {
        color: #333;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer
      }
      .outlineTitle{
        font-weight: 500;
        padding: 1.333rem 0;
        margin: 0 1.667rem;
        font-size: 16px;
        line-height: 2rem;
        color: #1d2129;
        border-bottom: 1px solid #e4e6eb;
      }
      .${wrapClassName} {
        padding: 16px 8px;
        background-color: white;
        position: fixed;
        top: 0;
        right:0;
        height: calc(100vh);
        width: 300px;
        z-index: 9999;
        overflow: auto;
        border-left: 1px solid #d0d7de;
      }
      .${prefix}-tree {
        margin-top: 16px;
      }
      .${prefix}-header {
        font-weight: 600;
        font-size: 16px;
      }
      // @media (prefers-color-scheme: dark) {
      //   ._${prefix}-tree-wrap {
      //     background-color: black;
      //     color: white
      //   }
      //   .${prefix}-outline-item a {
      //     color: white;
      //   }
      // }
      .${activeItemClassName} a {
        color: var(--primary-color, red)
      }
      
      @media (prefers-color-scheme: light) {
        
      }
      .${prefix}-icon:after {
        color: var(--toggler-color-text);
        content: "";
        font-size: 15px;
        top: 0px;
        width: 16px;
        display: inline-block;
        font-weight: 400;
        position: relative;
        font-variant: normal;
      }
     
    `;
    console.log('xxx tree node', wrap)
    return { node: wrap, style: treeStyle };
  };

 getTagNodeIndex = (index: number) => {
    return `${this.options.prefix}-${index}`;
  };

  getAllTags = () => {
    const contentDomId = this.options.contentId;
    const headsTag = this.options.headerTags!
    const queryStr = headsTag.map((item) => `${contentDomId} ${item}`).join(',');
    const curTagNodes: NodeListOf<HTMLElement> = document.querySelectorAll(queryStr);
    return Array.from(curTagNodes).map((curr, index) => {
      const { nodeName, innerText } = curr;
      const dataId = curr.dataset.id;
      const headNumber = getHeaderNumber(curr);
      const item = {
        ...curr,
        nodeName,
        headNumber,
        innerText,
        tagNodeIndex: dataId || this.getTagNodeIndex(index)
      };
      if (!dataId) {
        nodeAddAnchorName(curr, item.tagNodeIndex);
      }
      return item;
    });
  };
  // 123 23 234 或者 134 234
  getTags() {
    const curTagNodes = this.getAllTags();
    let lastItem = this.treeData;
    if (curTagNodes.length) {
      curTagNodes.forEach((curr, index) => {
        const item = curr;
        let prevNode = index !== 0 ? curTagNodes[index - 1] : null;
        if (prevNode) {
          const prevNodeNumber = getHeaderNumber(prevNode);
          const currNodeNumber = getHeaderNumber(curr);
          // 1 > 2 | 1 > 3 | 1 > 4 前一个节点的 children 的第一个元素就当前元素, 对于 1 > 3 > 4 > 2 > 3 的情况 2 和 3 是平级的，所以找父元素不是当前元素减 1 则 找 当前元素 -2 的节点
          if (prevNodeNumber < currNodeNumber) {
            lastItem.children = [curr];
            // 1 > 2 > 2 上个元素的 children 加上这个元素
          } else if (prevNodeNumber == currNodeNumber) {
            const target = findParant(lastItem.tagNodeIndex, this.treeData);
            if (target) {
              target.children.push(item);
            } else {
              // 第一和二个节点都是 h1
              this.treeData.children.push(item);
            }
            //  123 23 中间 3 -> 2 的情况，找父元素不是当前元素减 1 则 找 当前元素 -2 的节点
          } else {
            // 如果当前 header 小于 前一个，需要找到前一个的父级中和当前 header 相同的元素，找到该元素的父级元素 push 当前 item
            // 找到和当前 number - 1 相等元素 push item
            const sameNumberItem = findTargetPathByPrevIndex(curr, lastItem.tagNodeIndex, this.treeData);
            const parent = findParant(sameNumberItem.tagNodeIndex, this.treeData);
            // 没找到父元素则放到上个元素的 children 中
            if (parent) {
              parent.children.push(item);
            } else {
              this.treeData.children.push(item);
            }
          }
        } else {
          lastItem.children = [item];
        }
        lastItem = item;
      });
    }
  }

  
}

const findParant = (prevNodeIndex: number, treeData: any) => {
  const stack: any[] = [];
  let target: any;
  const find = (list: any) => {
    for (var index = 0; index < list.length; index++) {
      const item = list[index];
      stack.push(item);
      if (item.tagNodeIndex === prevNodeIndex) {
        target = item;
        break;
      } else if (item.children) {
        find(item.children);
      }
      if (!target) {
        stack.pop();
      }
    }
  };
  find(treeData.children);
  // target 的上个一个元素是父元素
  return stack[stack.length - 2];
};

/**
 * 上个元素的链路中找到当前和当前 header number 一样的元素
 * @param {*} curr 当前 header 节点
 * @param {*} prevNodeIndex // 上一个元素的 index
 * @returns
 */
const findTargetPathByPrevIndex = (curr: any, prevNodeIndex: number, treeData: any) => {
  const number: number = getHeaderNumber(curr);
  // 上个元素的链路元素
  const stack: any[] = [];
  // 上个元素的链路 index, 方面找到对应的节点
  const pathStack:any[] = [];
  let prevData: any;
  const find = (list: any) => {
    list.forEach((item: any, index: number) => {
      stack.push(item);
      pathStack.push(index);
      if (item.tagNodeIndex === prevNodeIndex) {
        prevData = item;
        return item;
      } else if (item.children) {
        find(item.children);
      }
      if (!prevData) {
        stack.pop();
        pathStack.pop();
      }
    });
  };
  find(treeData.children);

  const tr = () => {
    return stack.find((item) => item.headNumber === number);
  };

  let sameNumberItem;
  // 找到当前 header number, 没有则当前 number 往上 + 1 再找
  const temArr = new Array(prevData.headNumber - number).fill('');
  temArr.forEach(() => {
    const result = tr();
    if (result) {
      sameNumberItem = result;
      return;
    }
  });

  if (sameNumberItem) {
    // sameNumber 的父元素
    return sameNumberItem;
  }
  // 没找到则返回上个元素
  return prevData;
};

export { Tree }
export type {TreeOptions}