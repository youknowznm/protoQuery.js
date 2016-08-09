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

(function(globalEnv){

  // 根据［单个］选择器字符串查询，返回目标元素下［所有］符合的元素
  // @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
  // @param {object=} root 提供时以其为遍历起点，否则以document为起点
  // @return {array.<node>} 返回成员类型为node的数组或空数组
  var singleSelectorAllMatches = function(selector, root) {
    var _root;
    switch (root) {
      case undefined:
        _root = document.documentElement;
        break;
      case null:
        return [];
      default:
        _root = root;
    }
    var walker = document.createTreeWalker(_root, NodeFilter.SHOW_ELEMENT, null, false);
    var currentNode = walker.nextNode();
    var result = [];
    switch (true) {

      case /^#([\w-]+)$/.test(selector):
        var tarId = RegExp.$1;
        while (currentNode !== null) {
          if (currentNode.id === tarId) {
            result.push(currentNode);
            break;
          }
          currentNode = walker.nextNode();
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
        throw new Error('Function "queryAll" accepts only 1 selector.')

    }
    return result;
  };

  // 根据［单个］选择器字符串查询，返回目标元素下［第一个］符合的元素
  // @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
  // @param {object=} root 提供时以其为遍历起点，否则以document为起点
  // @return {object|null} 返回node对象或null
  var singleSelectorOneMatch = function(selector, root) {
    return singleSelectorAllMatches(selector, root)[0] || null;
  };

  // 根据［组合］选择器字符串查询，返回目标元素下［第一个］符合的元素
  // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的[以空格连接的］查询字符串
  // @param {object=} root 提供时以其为遍历起点，否则以document为起点
  // @return {object|null} 返回node对象或null
  var multipleSelectorOneMatch = function(selectorGroup, root) {
    if (typeof selectorGroup !== 'string' || selectorGroup === '') {
      throw new Error('Expected STRING as selector.');
    }
    var selectorArr = selectorGroup.split(' ');
    switch (selectorArr.length) {
      case 1:
        return singleSelectorOneMatch(selectorArr[0], root);
      case 2:
        var r1 = singleSelectorOneMatch(selectorArr[0]);
        return singleSelectorOneMatch(selectorArr[1], r1);
      case 3:
        var r1 = singleSelectorOneMatch(selectorArr[0]);
        var r2 = singleSelectorOneMatch(selectorArr[1], r1);
        return singleSelectorOneMatch(selectorArr[2], r2);
      case 4:
        var r1 = singleSelectorOneMatch(selectorArr[0]);
        var r2 = singleSelectorOneMatch(selectorArr[1], r1);
        var r3 = singleSelectorOneMatch(selectorArr[2], r2);
        return singleSelectorOneMatch(selectorArr[3], r3);
      default:
        throw new Error('Expected at most 4 selector snippets.')
    }
  };

  globalEnv.queryOne = function(selectorGroup) {
    return multipleSelectorOneMatch(selectorGroup, document.documentElement);
  };

  globalEnv.queryAll = function(selector) {
    return singleSelectorAllMatches(selector, document.documentElement);
  };

  // 为Node原型添加方法
  (function(nodePrototype) {

    nodePrototype.hasClass = function(className) {
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

    nodePrototype.queryOne = function(selectorGroup){
      return multipleSelectorOneMatch(selectorGroup, this);
    };

    nodePrototype.queryAll = function(selector){
      return singleSelectorAllMatches(selector, this);
    };


  })(globalEnv.Node.prototype);



})(window);


// console.log(body.getElementById('test').hasClass('fuck'))
console.log(document.body.queryAll('#dick .fuck'))
console.log(queryAll('.fuck.shit'))
