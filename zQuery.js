(function(globalEnv){

  /////////////////////////////////////////////
  /////////////////  基本方法  /////////////////
  /////////////////////////////////////////////

  // 根据［单个］选择器字符串查询，返回目标元素下［所有］符合的元素
  // @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
  // @param {object.node=} root 提供时以其为遍历起点，否则以document为起点
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
            if (!currentNode.hasClass(tarClasses[i]) && tarClasses[i] !== '') {
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
  };

  // 根据［单个］选择器字符串查询，返回目标元素下［第一个］符合的元素
  // @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
  // @return {object.node|null} 返回node对象或null
  var singleSelectorOneMatch = function(selector, root) {
    return singleSelectorAllMatches(selector, root)[0] || null;
  };

  // 根据［组合］选择器字符串查询，返回目标元素下［所有］符合的元素
  // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
  // @return {array.<node>} 返回成员类型为node的数组或空数组
  var groupSelectorAllMatches = function(selectorGroup, root) {
    if (typeof selectorGroup !== 'string' || selectorGroup === '') {
      throw new Error('Expected STRING as selector.');
    }
    var selectorArr = selectorGroup.split(' ');
    switch (selectorArr.length) {
      case 1:
        return singleSelectorAllMatches(selectorArr[0], root);
      case 2:
        var r1 = singleSelectorOneMatch(selectorArr[0]);
        return singleSelectorAllMatches(selectorArr[1], r1);
      case 3:
        var r1 = singleSelectorOneMatch(selectorArr[0]);
        var r2 = singleSelectorOneMatch(selectorArr[1], r1);
        return singleSelectorAllMatches(selectorArr[2], r2);
      case 4:
        var r1 = singleSelectorOneMatch(selectorArr[0]);
        var r2 = singleSelectorOneMatch(selectorArr[1], r1);
        var r3 = singleSelectorOneMatch(selectorArr[2], r2);
        return singleSelectorAllMatches(selectorArr[3], r3);
      default:
        throw new Error('Expected at most 4 selector snippets.')
    }
  };

  /////////////////////////////////////////////
  //////////////  处理window对象  //////////////
  /////////////////////////////////////////////

  // 根据组合选择器字符串查询，返回文档内所有符合的元素
  // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
  // @return {array.<node>} 返回成员类型为node的数组或空数组
  globalEnv.$ = globalEnv.query = function(selectorGroup) {
    return groupSelectorAllMatches(selectorGroup, document.documentElement);
  };

  // 在文档渲染结束、即将加载内嵌资源时，执行指定函数
  globalEnv.domReady = function(fn) {
    document.onreadystatechange = function(){
      if (document.readyState === 'interactive') {
        fn();
      }
    }
  };

  /////////////////////////////////////////////
  ///////////////  处理node原型  ///////////////
  /////////////////////////////////////////////

  (function(nodePrototype) {

    // 元素含指定类名时返回真
    nodePrototype.hasClass = function(className) {
      if (typeof className !== 'string') {
        throw new Error('Expected STRING as target class name.')
      }
      var currentClasses = this.getAttribute('class');
      if (currentClasses !== null) {
        if (currentClasses.indexOf(className) !== -1) {
          return true;
        }
      }
      return false;
    }

    // 根据组合选择器字符串查询，返回元素下所有符合的元素
    // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
    // @return {array.<node>} 返回成员类型为node的数组或空数组
    nodePrototype.$ = nodePrototype.query = function(selectorGroup){
      return groupSelectorAllMatches(selectorGroup, this);
    };

    // 获取或设置目标属性
    // @param {string} tarAttr 目标属性名
    // @param {string} tarValue 目标属性值
    // @return {string|null|object.node} 获取时返回字符串或null；设置时返回自身
    nodePrototype.attr = function(tarAttr, tarValue) {
      if (typeof tarAttr !== 'string') {
        throw new Error('Expected STRING as target attribute name.')
      }
      if (tarValue === undefined) {
        return this.getAttribute(tarAttr);
      } else {
        if (typeof tarValue !== 'string') {
          throw new Error('Expected STRING as target attribute value (if provided).');
        } else {
          this.setAttribute(tarAttr, tarValue);
          return this;
        }
      }
    }

  })(globalEnv.Node.prototype);

  /////////////////////////////////////////////
  ///////////////  处理array原型  //////////////
  /////////////////////////////////////////////

  (function(arrayPrototype) {

    // arrayPrototype.not = function(unwantedSelector) {
    //   var result = [];
    //   for (var i in this) {
    //     var currentNode = this[i];
    //     if
    //   }
    // }

  })(globalEnv.Array.prototype);
})(window);


console.log(document.body.query('body #dick .fuck.shit')[0].attr('f', 'f'))
