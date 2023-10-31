import { getHeaderNumber, nodeAddAnchorName} from './help'

interface TreeOptions {
    headerTags?: string[], // 取标题的 tag, 必需能用罗文数字表达层级，默认 html 标签的 h1, h2 等，主要支持类似 yuque 改造后的 ne-h1 这种形式
    contentId?: string // 获取哪个内容的标题，最高优先级， 默认的优先级是['article', 'main', 'body']
    prefix?: string // 样式名的前缀 默认 ‘js’
}


interface TreeDataItem {
  children: TreeDataItem[],
  nodeName: string,
  headerNumber?: number,
  innerText?: string, // 文本名称
  tagNodeIndex?: number | string, // 在所有标题中的 index， 主要为了做节点间索引
  [key: string]: any,
}

export interface ClassNames {
  wrapClassName: string,
  activeItemClassName: string,
  outlineItemClass: string,
  closeClassName: string
}

class Tree {
  treeData: TreeDataItem = {children: [], nodeName: ''}
  options: TreeOptions
  wrapClassName: string
  activeItemClassName: string
  classNames: ClassNames
  constructor(options: TreeOptions, classNames: ClassNames) {
    this.classNames = classNames
    this.options = options
    this.wrapClassName = `_${this.options.prefix}-tree-wrap`;
    this.activeItemClassName = `${this.options.prefix}-item-active`;
  }

  generatorClose() {
    const {closeClassName} = this.classNames
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
    const outlineItemClass = this.classNames.outlineItemClass;
    const activeItemClassName = this.activeItemClassName

    const wrap = document.createElement('div');
    wrap.className = `${prefix}-tree-content`;
    // wrap.setAttribute('style', `display: none`);
    const padding = 16;
    const { domStr: closedomStr, style: closeStyle } = this.generatorClose();
    // todo: generatorClose 抽象出来
    let ele = `${closedomStr}<div class='${prefix}-header'>目录</div><ul class = "${prefix}-tree">`;
  
    const traverse = (nodeList: TreeDataItem[], level: number) => {
      nodeList.forEach((node: TreeDataItem) => {
        // const textNodeHtml = `${node.innerText} <span style='font-weight: 600'>${node.children ? `(${node.children.length})` : ''}</span>`;
        const textNodeHtml = `${node.innerText} ${node.children && node.children.length ? `<span style='font-weight: 600'>(${node.children.length})</span>`: ''}`;
        const aElement = level == 0 ? `<a class="has-arrow" aria-expanded="true" >${textNodeHtml}</a>` : `<a aria-expanded="true" >${textNodeHtml}</a>`;
        ele = ele + `<li style="padding-left:${padding * level}px" class='${outlineItemClass}' data-tag='${node.tagNodeIndex}'>${aElement}</li>`;
        if (node.children) {
          traverse(node.children, level + 1);
        }
      });
    };
    if(this.treeData.children) {
      traverse(this.treeData.children, 1);
    }
    ele += '</ul>';
    wrap.innerHTML = ele;
  
    // const style = document.createElement('style');
    const treeStyle = `
      ${closeStyle}
      .${outlineItemClass} {
        list-style-type: none;
        cursor: pointer;
        line-height: 30px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        position: relative;
      }
      .${outlineItemClass} a {
        color: #333;
        text-decoration: none;
        font-size: 14px;
        cursor: pointer
      }
      .${outlineItemClass} a:hover {
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
      }
      .${prefix}-tree {
        margin: 16px 0 0 0;
        height: calc(100vh - 75px);
        overflow-y: auto;
        padding: 0;
      }
      .${prefix}-header {
        font-weight: 600;
        font-size: 18px;
        padding: 0 ${padding}px;
        color: #333;
      }

      .${activeItemClassName} a, .${activeItemClassName} a:hover{
        background: linear-gradient(83.21deg,#3245ff 0%,#bc52ee 100%);
        -webkit-background-clip: text;
        color: transparent;
      }
      
      .${activeItemClassName}:before {
        content: "";
        position: absolute;
        top: 4px;
        left: 0px;
        margin-top: 4px;
        width: 4px;
        height: 16px;
        background: linear-gradient(83.21deg,#3245ff 0%,#bc52ee 100%);
        border-radius: 0 4px 4px 0;
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
      const { nodeName } = curr;
      const dataId = curr.dataset.id;
      let text = curr.innerText;
      const tagName = curr.tagName.toLowerCase();
      if (['input', 'textarea'].includes(tagName)) {
        text= (curr as any).value; // 对于 input 和 textarea 使用 value 属性
      }
      const headNumber = getHeaderNumber(curr);
      const item = {
        // ...curr,
        nodeName,
        headNumber,
        innerText: text,
        tagNodeIndex: dataId || this.getTagNodeIndex(index),
        children: []
      };
      if (!dataId) {
        nodeAddAnchorName(curr, item.tagNodeIndex);
      }
      return item;
    });
  };

  clear = () => {
    this.treeData = {children: [], nodeName: ''}
  }
  // 123 23 234 或者 134 234
  getTags () {
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
            const target = findParant(lastItem.tagNodeIndex!, this.treeData);
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
            const sameNumberItem = findTargetPathByPrevIndex(curr, lastItem.tagNodeIndex!, this.treeData);
            const parent = findParant(sameNumberItem.tagNodeIndex!, this.treeData);
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

const findParant = (prevNodeIndex: number | string, treeData: TreeDataItem) => {
  const stack: TreeDataItem[] = [];
  let target: TreeDataItem;
  const find = (list: TreeDataItem[]) => {
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
const findTargetPathByPrevIndex = (curr: TreeDataItem, prevNodeIndex: number | string, treeData: TreeDataItem) => {
  const number: number = getHeaderNumber(curr);
  // 上个元素的链路元素
  const stack: TreeDataItem[] = [];
  // 上个元素的链路 index, 方面找到对应的节点
  const pathStack: number[] = [];
  let prevData: TreeDataItem;
  const find = (list: TreeDataItem[]) => {
    list.forEach((item: TreeDataItem, index: number) => {
      stack.push(item);
      pathStack.push(index);
      if (item.tagNodeIndex === prevNodeIndex) {
        prevData = item;
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
  const temArr = new Array(prevData!.headNumber - number).fill('');
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
  return prevData!;
};

export { Tree }
export type {TreeOptions}