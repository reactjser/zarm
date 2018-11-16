(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{395:function(n,e,i){"use strict";i.r(e);var d=i(3),r=i.n(d),t=i(4),a=i.n(t),o=i(2),v=i.n(o),u=i(5),l=i.n(u),c=function(n){function e(){var n,d,t,o;a()(this,e);for(var u=arguments.length,l=Array(u),c=0;c<u;c++)l[c]=arguments[c];return d=t=v()(this,(n=e.__proto__||r()(e)).call.apply(n,[this].concat(l))),t.document=function(){return{document:i(444),className:"marquee-page"}},o=d,v()(t,o)}return l()(e,n),e}(i(420).a);e.default=c},444:function(n,e){n.exports="## 滚动 Marquee\n\n\n\n### 基本用法\n```jsx\nimport { Marquee, Cell } from 'zarm';\n\nclass Demo extends React.Component {\n  render() {\n    return (\n      <div>\n        <Cell>\n          <Marquee width=\"100%\" animationDelay={5000} animationDuration={20000}>\n            <div>我延迟执行5秒，从右向左滚动，字有点多，我走慢点，领导先走~</div>\n          </Marquee>\n        </Cell>\n        <Cell>\n          <Marquee direction=\"right\" width=\"100%\">\n            <div>我从左向右滚动</div>\n          </Marquee>\n        </Cell>\n        <Cell>\n          <Marquee direction=\"up\" height={60}>\n            <div>我</div>\n            <div>从</div>\n            <div>下</div>\n            <div>往</div>\n            <div>上</div>\n            <div>滚</div>\n            <div>动</div>\n          </Marquee>\n        </Cell>\n         <Cell>\n          <Marquee direction=\"down\" height={60}>\n            <div>我</div>\n            <div>从</div>\n            <div>上</div>\n            <div>往</div>\n            <div>下</div>\n            <div>滚</div>\n            <div>动</div>\n          </Marquee>\n        </Cell>\n     </div>   \n    )\n  }\n}\n\nReactDOM.render(<Demo />, mountNode);\n```\n\n\n### API\n\n| 属性 | 类型 | 默认值 | 说明 |\n| :--- | :--- | :--- | :--- |\n| direction | 'left' \\| 'right' \\| 'up' \\| 'down' |'left' | 方向 |\n| width | number \\| string | - |  容器宽度 |\n| height | number \\| string | - | 容器高度 |\n| loop | boolean | true |是否循环 |\n| animationDuration | number | 6000 | 动画执行时间（单位：毫秒） |\n| animationDelay | number | 0 | 动画延迟执行时间（单位：毫秒） |\n\n"}}]);