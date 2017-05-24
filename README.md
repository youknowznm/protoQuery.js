# protoQuery.js
## 修改原生对象的原型以实现 jQuery 的常用接口


---

``` JavaScript

/*
选择器
*/

$(selector) -> {array.<node>}
 // 根据组合选择器（"#header"，".item"，"ul"，"[type]"，"[type=radio]"，"\*"）查询，返回文档内所有符合的元素
$(selector).is(selector) -> {boolean}
 // 判断此元素是否符合选择器

/*
属性与样式
*/

$(selector).hasClass(className) -> {boolean}
 // 判断此元素是否包含指定类名
$(selector).addClass(className) -> {node}
 // 添加一个或多个类
$(selector).removeClass(className) -> {node}
 // 移除一个或多个类
$(selector).attr(tarAttr, tarValue?) -> {string|node}
 // 获取或设置此元素的目标属性
$(selector).html(tarHTML?) -> {string|node}
 // 获取或设置此元素的innerHTML
$(selector).text(text?) -> {string|node}
// 获取或设置此元素的textContent
$(selector).css(tarStyle, tarValue?) -> {node|string|null}
 // 获取或设置此元素的样式，传入一个对象时设置多条。目标值为整数时添加px单位
$(selector).position() -> {object}
 // 返回元素相对于父定位元素之坐标
$(selector).offset() -> {object}
 // 返回元素相对于浏览器窗口之坐标
$(selector).width(tarValue?) -> {string|node}
$(selector).height(tarValue?) -> {string|node}
 // 读写元素的宽高
$(selector).innerWidth() -> {string}
$(selector).innerHeight() -> {string}
$(selector).outerWidth(includeMargin) -> {string}
$(selector).outerHeight(includeMargin) -> {string}
 // 读元素的含内外边距或边框的宽高
$(selector).transform(styleObj, callback) -> {node}
 // 渐变目标的一个或多个样式，可提供回调函数
$(selector).show(option?) -> {node}
$(selector).hide(option?) -> {node}
 // 显示/隐藏元素。参数为'transform'时从左上角开始动画，否则即时
$(selector).fadeIn() -> {node}
$(selector).fadeOut() -> {node}
 // 渐变透明度以显示/隐藏元素
$(selector).slideDown() -> {node}
$(selector).slideUp() -> {node}
 // 渐变高度以显示/隐藏元素

/*
事件
*/

$(selector).on(obj) -> {node}
$(selector).on(events, function) -> {node}
$(selector).on(events, delegationSelector, function) -> {node}
 // 直接添加或代理事件监听
$(selector).off(obj) -> {node}
$(selector).off(events, function) -> {node}
 // 移除事件监听

/*
遍历
*/

$(selector).parent() -> {node|null}
 // 返回此元素的直接父元素
$(selector).matchedParents(selector) -> {array.<node>}
 // 返回此元素所有符合参数条件的父元素
$(selector).parentsUntil(selector) -> {array.<node>}
 // 返回此元素之上、符合参数条件的元素（如有）之下的所有父元素
$(selector).closest(selector) -> {node|null}
 // 返回目标元素的符合参数条件的最近的父元素，遍历包含元素自身
$(selector).matchedChildren(selector) -> {array.<node>}
 // 返回此元素所有符合参数条件的直接子元素
$(selector).prev(selector) -> {node|null}
 // 返回此元素之前的符合参数条件的最近的兄弟元素
$(selector).next(selector) -> {node|null}
 // 返回此元素之后的符合参数条件的最近的兄弟元素
$(selector).prevAll(selector) -> {array.<node>}
 // 返回此元素之前的所有符合参数条件的兄弟元素
$(selector).nextAll(selector) -> {array.<node>}
 // 返回此元素之后的所有符合参数条件的兄弟元素
$(selector).siblings(selector) -> {array.<node>}
 // 返回此元素的所有符合参数条件的兄弟元素
$(selector).prevUntil(selector) -> {array.<node>}
 // 返回此元素之前、符合参数条件的元素（如有）之后的所有兄弟元素
$(selector).nextUntil(selector) -> {array.<node>}
 // 返回此元素之后、符合参数条件的元素（如有）之前的所有兄弟元素
$(selector).prependChild(node) -> {node}
 // 在当前元素的第一个子元素前插入目标元素。与$(selector).appendChild()对应
$(selector).insertAfter(newNode, referenceNode) -> {node}
 // 在此元素的referenceNode子元素前添加目标元素。与$(selector).insertBefore()对应

/*
字符串处理
*/

String.trim() -> {string}
 // 去除字符串首尾的空格
String.isEmail() -> {boolean}
 // 判断字符串是否符合常见邮箱格式
String.isValidDate() -> {boolean}
 // 判断字符串是否为有效日期，无法判断闰年

/*
杂项
*/

Window.clone(source) -> {string|number|boolean|object}
 // 复制原始类型值或一般对象
Window.uniq(arr) -> {array}
 // 返回去重的新数组（限定为基本类型值组成），原数组未改动
Window.detectMobile() -> {boolean}
 // 若当前设备为移动端则设置全局变量isMobile为真，否则为假；并返回该值
Window.isEmpty(target, shoudlIncludeInherited) -> {boolean}
 // 判断目标是否为空对象，第二参数为真时，考虑从原型继承来的属性
Window.cookie(cookieName) -> {string}
Window.cookie(cookieName, cookieValue) -> {undefined}
Window.cookie(cookieName, cookieValue, expireDays) -> {undefined}
 // 读写cookie或修改有效期
Window.ajax(url, options) -> {undefined}
 // 简易的ajax方法，可发送键值对象或查询字符串作为数据

 ```
