// (function(window, undefined){
//
//   var zQuery = (function(){
//     // zQuery对象就是zQuery.fn.init对象
//     // 使用new关键字的话，返回的还是zQuery.fn.init对象，所以直接zQuery()即可
//     var zQuery = function(selector, context){
//       return new zQuery.fn.init(selector, context);
//     };
//     // 添加到zQuery.fn的方法，也被添加到zQuery.prototype，这样new zQuery()写法产生的实例也拥有这些方法
//     zQuery.fn = zQuery.prototype = {
//       constructor: zQuery,
//       init: function(selector, context){
//         // ...
//       }
//     };
//     // 如上所述，使用zQuery(s, c)方法、不使用new zQuery()时，返回的是zQuery.fn.init对象；
//     // 将它的构造函数原型也指向zQuery.fn，这样不管用哪种方法创建的zQuery对象都拥有添加到zQuery.fn的所有方法
//     zQuery.fn.init.prototype = zQuery.fn;
//     return zQuery;
//   });
//
//   window.zQuery = window.$ = zQuery;
//
// })(window);

(function(window, undefined){

  window.zQuery = window.$ = function(selector) {
    // selector可为： body，html标签，html字符串，html元素id，选择器表达式
    if (typeof selector !== 'string' || selector === '') {
      throw new Error('Expected STRING as selector.')
    }
  }

  Node.prototype.hasClass = function(className) {
    if (typeof className !== 'string') {
      throw new Error('Expected STRING as class name.')
    }
    if (className === '') {
      return true;
    }
    var currentClasses = this.getAttribute('class');
    if (currentClasses !== null) {
      if (currentClasses.indexOf(className) !== -1) {
        return true;
      }
    }
    return false;
  }


})(window);

// 根据单个选择器字符串查询
var singleSelectorQuery = function(selector, root) {
  var _root = root !== undefined ? root : document;
  var walker = document.createTreeWalker(_root, NodeFilter.SHOW_ELEMENT, null, false);
  var currentNode = walker.nextNode();
  var result = [];
  switch (true) {

    case /^#([\w-]+)$/.test(selector):
      var idMatch = _root.getElementById(RegExp.$1);
      if (idMatch) {
        result.push(idMatch);
      }
      break;

    case /^\.[\w-\.]+$/.test(selector):
      var tarClasses = selector.split('.');
      while (currentNode !== null) {
        var thisNodeMatches = true;
        for (var i in tarClasses) {
          if (!currentNode.hasClass(tarClasses[i])) {
            thisNodeMatches = false;
            break;
          }
        }
        if (thisNodeMatches) {
          result.push(currentNode);
        }
        currentNode = walker.nextNode();
      }
      break;

    case /^([\w-]+)$/.test(selector):
      var tarTag = RegExp.$1;
      while (currentNode !== null) {
        if (currentNode.nodeName === tarTag.toUpperCase()) {
          result.push(currentNode);
        }
        currentNode = walker.nextNode();
      }
      break;

    case /^\[([\w-]+)\]$/.test(selector):
      var tarAttr = RegExp.$1;
      while (currentNode !== null) {
        if (currentNode.hasAttribute(tarAttr)) {
          result.push(currentNode);
        }
        currentNode = walker.nextNode();
      }
      break;

    case /^\[([\w-]+)=([\w-]+)\]$/.test(selector):
      var tarAttr = RegExp.$1;
      var tarValue = RegExp.$2;
      while (currentNode !== null) {
        if (currentNode.getAttribute(tarAttr) === tarValue) {
          result.push(currentNode);
        }
        currentNode = walker.nextNode();
      }
      break;

    default:
      throw new Error('Invalid selector string.')

  }
  return result;
}

var query = function(selector) {
  if (typeof selector !== 'string' || selector === '') {
    throw new Error('Expected STRING as selector.')
  }
  var selectors = selector.split(' ');
  var length = selectors.length;
  console.log(selectors);
  for (var i in selectors) {

  }
  var r1 = singleSelectorQuery(selectors[0])[0];
  if (length === 1) {
    return r1;
  } else {
    if (r1 !== undefined) {
      var r2 = singleSelectorQuery(selectors[1], r1)
    }
  }


  selectors.reduce(function(s1, s2){
    return singleSelectorQuery(s1, s2)[0];
  }, document.body);

}

// console.log(document.getElementById('test').hasClass('fuck'))
console.log(query('body #test'))
