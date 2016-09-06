# zQuery

###
jQuery在几乎未触及任何原生JavaScript对象原型的基础上实现了对节点实例的选择和操作，实在是屌。我才疏学浅，尝试通过在Node实例和JS基本类型的原型以及全局变量上添加若干方法和变量，实现jQuery的若干常用接口。实现顺序基于[jQuery Learning Center](http://learn.jquery.com)中api出现的顺序。

# API

###
*选择器*
- `window.query(selector)` -> `{array.<node>}`
  * 根据组合选择器字符串（"#header"，".item"，"ul"，"[type]"，"[type=radio]"，"\*"）查询，返回文档内所有符合的元素
- `Node.is(selector)` -> `{boolean}`
  * 判断此元素是否符合选择器字符串
- `Node.query(selector)` -> `{array.<node>}`
  * 根据组合选择器字符串（"#header"，".item"，"ul"，"[type]"，"[type=radio]"，"\*"）查询，返回此元素下所有符合的元素

###
*属性与样式*
- `Node.hasClass(className)` -> `{boolean}`
  * 判断此元素是否包含指定类名
- `Node.addClass(className)` -> `{node}`
  * 添加类
- `Node.removeClass(className)` -> `{node}`
  * 移除类
- `Node.toggleClass(className)` -> `{node}`
  * 已有则移除，否则添加之
- `Node.attr(tarAttr, tarValue?)` -> `{node}`
  * 获取或设置此元素的目标属性
- `Node.css(tarStyle, tarValue?)` -> `{node|string|null}`
  * 获取或设置此元素的样式，传入一个对象时设置多条。目标值为整数时添加px单位
- `Node.position()` -> {object}
  * 返回元素相对于父定位元素之坐标
- `Node.offset()` -> {object}
  * 返回元素相对于浏览器窗口之坐标
- `Node.width(tarValue?)` -> `{node}`
- `Node.height(tarValue?)` -> `{node}`
  * todo
- `Node.transform(styleObj, callback)` -> `{node}`
  * 渐变目标的一个或多个样式，可提供回调函数
- `Node.show(option?)` -> `{node}`
- `Node.hide(option?)` -> `{node}`
  * 显示/隐藏元素。参数为'transform'时从左上角开始动画，否则即时
- `Node.fadeIn()` -> `{node}`
- `Node.fadeOut()` -> `{node}`
  * 渐变透明度以显示/隐藏元素
- `Node.slideDown()` -> `{node}`
- `Node.slideUp()` -> `{node}`
  * 渐变高度以显示/隐藏元素

###
*事件*
- `window.domReady(fn)` -> `{undefined}`
  * 在文档渲染结束、即将加载内嵌资源时，执行指定函数
- `Node.on(obj)` -> `{node}`
- `Node.on(events, function)` -> `{node}`
- `Node.on(events, delegationSelector, function)` -> `{node}`
  * 添加事件监听
    － 1 键：单一或多个事件名；值：该事件的监听函数
    － 2 events：单一或多个事件名；function：对应的监听函数
    － 3 events：单一或多个事件名；delegationSelector：被代理元素的选择字符串；function：监听函数
- `Node.off(obj)` -> `{node}`
- `Node.off(events, function)` -> `{node}`
  * 移除事件监听
    － 1 键：单一或多个事件名；值：该事件的监听函数
    － 2 events：单一或多个事件名；function：对应的监听函数

###
*遍历*
- `Node.parent()` -> `{node|null}`
  * 返回此元素的直接父元素
- `Node.matchedParents(selector)` -> `{array.<node>}`
  * 返回此元素所有符合参数条件的父元素
- `Node.parentsUntil(selector)` -> `{array.<node>}`
  * 返回此元素之上、符合参数条件的元素（如有）之下的所有父元素
- `Node.closest(selector)` -> `{node|null}`
  * 返回目标元素的符合参数条件的最近的父元素，遍历包含元素自身
- `Node.matchedChildren(selector)` -> `{array.<node>}`
  * 返回此元素所有符合参数条件的直接子元素
- `Node.prev(selector)` -> `{node|null}`
  * 返回此元素之前的符合参数条件的最近的兄弟元素
- `Node.next(selector)` -> `{node|null}`
  * 返回此元素之后的符合参数条件的最近的兄弟元素
- `Node.prevAll(selector)` -> `{array.<node>}`
  * 返回此元素之前的所有符合参数条件的兄弟元素
- `Node.nextAll(selector)` -> `{array.<node>}`
  * 返回此元素之后的所有符合参数条件的兄弟元素
- `Node.siblings(selector)` -> `{array.<node>}`
  * 返回此元素的所有符合参数条件的兄弟元素
- `Node.prevUntil(selector)` -> `{array.<node>}`
  * 返回此元素之前、符合参数条件的元素（如有）之后的所有兄弟元素
- `Node.nextUntil(selector)` -> `{array.<node>}`
  * 返回此元素之后、符合参数条件的元素（如有）之前的所有兄弟元素

###
*字符串处理*
- `String.trim()` -> `{string}`
  * 去除字符串首尾的空格
- `String.isEmail()` -> `{string}`
  * 判断字符串是否符合常见邮箱格式
- `String.isEmail()` -> `{string}`
  * 判断字符串是否符合中国手机号码
- `String.isValidDate()` -> `{string}`
  * 判断字符串是否为有效日期，无法判断闰年

###
*杂项*
- `Window.clone(source)` -> `{string|number|boolean|object}`
  * 复制原始类型值或一般对象
- `Window.uniq(arr)` -> `{array}`
  * 返回去重的新数组（限定为基本类型值组成），原数组未改动
- `Window.cookie()` -> `{}`
  * todo
- `Window.ajax()` -> `{}`
  * todo
