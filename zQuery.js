(function(globalEnv){

  /////////////////////////////////////////////
  /////////////////  基本方法  /////////////////
  /////////////////////////////////////////////

  // 判断单个节点是否符合单个选择器
  var nodeMatchesSelector = function(tarNode, selector) {
    if (!tarNode instanceof Node) {
      throw new Error('Expected NODE as target node.');
    }
    if (typeof selector !== 'string' || selector === '') {
      throw new Error('Expected STRING as selector.');
    }
    switch (true) {
      // id选择器
      case /^#([\w-]+)$/.test(selector):
        return tarNode.id === RegExp.$1;
      // 类选择器，支持多个类
      case /^\.[\w-\.]+$/.test(selector):
        var tarClasses = selector.split('.');
        var thisNodeMatches;
        for (var i in tarClasses) {
          thisNodeMatches = true;
          if (!tarNode.hasClass(tarClasses[i]) && tarClasses[i] !== '') {
            thisNodeMatches = false;
            break;
          }
        }
        return thisNodeMatches;
      // 标签类型选择器
      case /^[\w]+$/.test(selector):
        return tarNode.nodeName === selector.toUpperCase();
      // 属性选择器，存在时
      case /^\[([\w-]+)\]$/.test(selector):
        return tarNode.hasAttribute(RegExp.$1);
      // 属性选择器，为指定值时（值之间不能有空格）
      case /^\[([\w-]+)=([\w-]+)\]$/.test(selector):
        return tarNode.getAttribute(RegExp.$1) === RegExp.$2;
      // 参数不符合任何选择器时抛出错误
      default:
        throw new Error('Invalid selector string.');
    }
  }
  globalEnv.nm = nodeMatchesSelector
  // 根据［单个］选择器字符串查询，返回目标元素下［所有］符合的元素
  // @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
  // @param {object.node=} root 提供时以其为遍历起点，否则以document为起点
  // @return {array.<node>} 返回成员类型为node的数组或空数组
  var singleSelectorAllResults = function(selector, root) {
    if (root === undefined) {
      return [];
    }
    var result = [];
    // #01 TreeWalker实例在遍历时并不会计算根节点，因此在这里添加对根节点的判定
    if (nodeMatchesSelector(root, selector)) {
      result.push(root);
    }
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
    var currentNode = walker.nextNode();
    while (currentNode !== null) {
      if (nodeMatchesSelector(currentNode, selector)) {
        result.push(currentNode);
      }
      currentNode = walker.nextNode();
    }
    return result;
  };

  // // 根据［单个］选择器字符串查询，返回目标元素下［第一个］符合的元素
  // // @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
  // // @return {object.node|null} 返回node对象或null
  // var singleSelectorOneMatch = function(selector, root) {
  //   return singleSelectorAllResults(selector, root)[0] || null;
  // };

  // 根据［组合］选择器字符串查询，返回目标元素下［所有］符合的元素
  // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
  // @return {array.<node>} 返回成员类型为node的数组或空数组
  var groupSelectorAllResults = function(selectorGroup, root) {
    var selectorArr = selectorGroup.split(' ');
    switch (selectorArr.length) {
      case 1:
        return singleSelectorAllResults(selectorArr[0], root);
      case 2:
        var r1 = singleSelectorAllResults(selectorArr[0], root)[0];
        console.log(r1)
        return singleSelectorAllResults(selectorArr[1], r1);
      case 3:
        var r1 = singleSelectorAllResults(selectorArr[0], root)[0];
        var r2 = singleSelectorAllResults(selectorArr[1], r1)[0];
        return singleSelectorAllResults(selectorArr[2], r2);
      case 4:
        var r1 = singleSelectorAllResults(selectorArr[0], root)[0];
        var r2 = singleSelectorAllResults(selectorArr[1], r1)[0];
        var r3 = singleSelectorAllResults(selectorArr[2], r2)[0];
        return singleSelectorAllResults(selectorArr[3], r3);
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
    return groupSelectorAllResults(selectorGroup, document.documentElement);
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
      var currentClasses = this.className;
      if (currentClasses !== '') {
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
      return groupSelectorAllResults(selectorGroup, this);
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
    };

  })(globalEnv.Node.prototype);

  /////////////////////////////////////////////
  ///////////////  处理array原型  //////////////
  /////////////////////////////////////////////

  (function(arrayPrototype) {

    // arrayPrototype.aaa = function(unwantedSelector) {
    //   for (var i in this) {
    //     console.log(this[i])
    //     if (!nodeMatchesSelector(this[i], unwantedSelector)) {
    //       this.splice(i, 1);
    //     }
    //   }
    // };

  })(globalEnv.Array.prototype);

})(window);

// console.log(nm(document.getElementsByTagName('p')[0], '.fuck'));
console.log(query('.shit.fuck'))
