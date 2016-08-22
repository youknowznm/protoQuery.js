# zQuery
***
###
`jQuery`在未修改任何原生`JavaScript`对象原型的基础上实现了对节点实例的选择和操作，实在是屌。我才疏学浅，尝试通过在节点构造器的原型和全局变量`window`上添加若干方法和变量的途径，尽可能实现`jQuery`中已有的接口。实现顺序基于[jQuery Learning Center](http://learn.jquery.com)中api出现的顺序。

## API
***
###

*选择器*
- `window.query(selector)`
  * 根据组合选择器字符串（"#header"，".item"，"ul"，"[type]"，"[type=radio]"，"*"）查询，返回文档内所有符合的元素

- `window.domReady(function)`
  * 在文档渲染结束、即将加载内嵌资源时，执行指定函数
