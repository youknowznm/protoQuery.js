# zQuery

###
`jQuery`在未修改任何原生`JavaScript`对象原型的基础上实现了对节点实例的选择和操作，实在是屌。我才疏学浅，尝试通过在节点构造器的原型和全局变量`window`上添加若干方法和变量的途径，尽可能实现`jQuery`中已有的接口。实现顺序基于[jQuery Learning Center](http://learn.jquery.com)中api出现的顺序。

## API

###
*选择器*
- `window.**query**(selector)` -> {array.<node>}
  根据组合选择器字符串（"#header"，".item"，"ul"，"[type]"，"[type=radio]"，"\*"）查询，返回文档内所有符合的元素
- `Node.**query**(selector)` -> {array.<node>}
  根据组合选择器字符串（"#header"，".item"，"ul"，"[type]"，"[type=radio]"，"\*"）查询，返回此元素下所有符合的元素


###
*属性与样式*
- `Node.**hasClass**(className)` -> {boolean}
  判断此元素是否包含指定类名
- `Node.**attr**(tarAttr, tarValue?)` -> {node}
  获取或设置此元素的目标属性
- 

###
*事件*
- `window.**domReady**(fn)` -> {undefined}
  在文档渲染结束、即将加载内嵌资源时，执行指定函数

###
*遍历*
####
*树遍历*
- `Node.**parent**()` -> {node|null}
  返回此元素的直接父元素
- `Node.**matchedParents**(selector)` -> {array.<node>}
  返回此元素所有符合参数条件的父元素
- `Node.**parentsUntil**(selector)` -> {array.<node>}
  返回此元素之上、符合参数条件的元素（如有）之下的所有父元素
- `Node.**closest**(selector)` -> {node|null}
  返回目标元素的符合参数条件的最近的父元素，遍历包含元素自身
- `Node.**matchedChildren**(selector)` -> {array.<node>}
  返回此元素所有符合参数条件的直接子元素
- `Node.**prev**(selector)` -> {node|null}
  返回此元素之前的符合参数条件的最近的兄弟元素
- `Node.**next**(selector)` -> {node|null}
  返回此元素之后的符合参数条件的最近的兄弟元素
- `Node.**prevAll**(selector)` -> {array.<node>}
  返回此元素之前的所有符合参数条件的兄弟元素
- `Node.**nextAll**(selector)` -> {array.<node>}
  返回此元素之后的所有符合参数条件的兄弟元素
- `Node.**siblings**(selector)` -> {array.<node>}
  返回此元素的所有符合参数条件的兄弟元素
- `Node.**prevUntil**(selector)` -> {array.<node>}
  返回此元素之前、符合参数条件的元素（如有）之后的所有兄弟元素
- `Node.**nextUntil**(selector)` -> {array.<node>}
  返回此元素之后、符合参数条件的元素（如有）之前的所有兄弟元素
