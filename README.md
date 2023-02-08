# outline
给 github、mdn、微信文章、知乎、infoQ等内容型网页生成目录。现在支持 chrome 插件和组件模式，chrome 插件方便使用，组件模式方便开发人员给自己的网页加目录功能，比如自己的博客加上目录等。虽然世面上有类似的，但是用下来发现交互不喜欢，可能国内外的区别，有些工具没有适配一些常用网站，还会出现加载时间不对的问题，这些再 chrome 插件中都做了修复

看网页文章时要对文章内容有个整体认识，或者很长的技术文档只想看某个章节，就需要有文章目录并且点击某个目录能跳到对应地方。但是网页上的文章有的没有目录功能（如微信公众号、知乎）、有的目录不全，只有一二级目录（如 mdn）、有的目录需要登录后查看（如 infoQ）、还有的网页空间小要优先展示广告（ 掘金）等等。这时候就该我等出手了。

使用方式：
chrome 下载插件后页面右边会出现个贴边且上下居中的按钮小巧不突兀，默认不展示，有需要时点击后在右边展示目录。
打包后的文件有 umd、iife、es 类型，可以按需引用

```
// html 使用
<script  src="/dist/outline.iife.js"></script>
<script>
    js_outline()
</script>

// npm 包, 还没发到 npm, 发好后可以如下使用
// 运行下面命令装包
npm install outline
// 代码内部
import Outline from 'outline'
new Outline(el, options)

// 或
import {outline} from 'outline'
outline(el, options)
```

