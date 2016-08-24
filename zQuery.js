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
          if (!tarNode.hasClass(tarClasses[i]) && tarClasses[i] !== null) {
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
      // 选择器为*时直接返回真
      case selector === '*':
        return true;
      default:
        throw new Error('Invalid selector string.');
    }
  }

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
  globalEnv.query = function(selectorGroup) {
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
        throw new Error('Expected STRING as target class name.');
      }
      var currentClasses = this.className;
      if (currentClasses !== null) {
        if (currentClasses.indexOf(className) !== -1) {
          return true;
        }
      }
      return false;
    };

    //
    nodePrototype.addClass = function(className) {
      if (typeof className !== 'string') {
        throw new Error('Expected STRING as target class name.');
      }
      if (!this.hasClass(className) && className !== '') {
        this.
      }
    }

    // 设置或读取目标元素的样式
    // @param {string|object} tarStyle 只提供此参数：为数值时返回该样式值；为对象时设置元素的多条规则
    // @param {string?} tarValue 提供时设置指定样式的值
    // @return {object|string|null} 读取时返回字符串或null；设置时返回自身
    nodePrototype.css = function(tarStyle, tarValue) {
      var changeSingleRule = function(name, value) {
        this.style[name] = value;
      }
      switch (arguments.length) {
        case 0:
          throw new Error('Expected at least 1 parameter.');
        case 1:
          switch (typeof tarStyle) {
            case 'string':
              return document.defaultView.getComputedStyle(this, null)[tarStyle] || null;
            case 'object':
              for (var i in tarStyle) {
                changeSingleRule.call(this, i, tarStyle[i]);
              }
              return this;
            default:
              throw new Error('Expected STRING as target style name or OBJECT as style group.')
          }
        case 2:
          if (typeof tarValue !== 'string') {
            throw new Error('Expected STRING as target style value.');
          }
          changeSingleRule.call(this, tarStyle, tarValue);
          return this;
        default:
          throw new Error('Invalid parameter(s).');
      }
    }


    // 根据组合选择器字符串查询，返回元素下所有符合的元素
    // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
    // @return {array.<node>} 返回成员类型为node的数组或空数组
    nodePrototype.query = function(selectorGroup) {
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

    // 返回目标元素的直接父元素
    // @return {object} 元素节点或null
    nodePrototype.parent = function() {
      var tarElement = this.parentNode;
      while (true) {
        if (tarElement === null || tarElement.nodeType === 1) {
          return tarElement;
        } else {
          tarElement = tarElement.parentNode;
        }
      }
    };

    // 返回目标元素的所有符合参数条件的父元素
    // @return {array.<node>} 元素节点对象构成之数组
    nodePrototype.matchedParents = function(selector) {
      var result = [];
      var currentNode = this.parent();
      while (currentNode !== null) {
        if (nodeMatchesSelector(currentNode, selector)) {
          result.push(currentNode);
        }
        currentNode = currentNode.parent();
      }
      return result;
    };

    // 返回目标元素的不符合参数条件的所有父元素
    // @return {array.<node>} 元素节点对象构成之数组
    nodePrototype.parentsUntil = function(selector) {
      var result = [];
      var currentNode = this.parent();
      while (currentNode !== null) {
        if (!nodeMatchesSelector(currentNode, selector)) {
          result.push(currentNode);
        } else {
          break;
        }
        currentNode = currentNode.parent();
      }
      return result;
    };

    // 返回目标元素的符合参数条件的最近的父元素，遍历包含元素自身
    // @return {object} 元素节点或null
    nodePrototype.closest = function(selector) {
      var currentNode = this;
      while (currentNode !== null) {
        if (nodeMatchesSelector(currentNode, selector)) {
          return currentNode;
        } else {
          currentNode = currentNode.parent();
        }
      }
      return null;
    };

    // 返回目标元素的符合参数条件的直接子元素
    // @return {array.<node>} 元素节点对象构成之数组
    nodePrototype.matchedChildren = function(selector) {
      var result = [];
      var directChildNodes = this.childNodes;
      var currentNode;
      for (var i in directChildNodes) {
        currentNode = directChildNodes[i];
        if (currentNode.nodeType === 1 && nodeMatchesSelector(currentNode, selector)) {
          result.push(currentNode);
        }
      }
      return result;
    };

    // 返回目标元素之前的符合参数条件的最近的兄弟元素
    // @return {object} 元素节点或null
    nodePrototype.prev = function(selector) {
      var prevSib = this.previousElementSibling;
      while (prevSib !== null) {
        if (nodeMatchesSelector(prevSib, selector)) {
          return prevSib;
        }
        prevSib = prevSib.previousElementSibling;
      }
      return null;
    };

    // 返回目标元素之后的符合参数条件的最近的兄弟元素
    // @return {object} 元素节点或null
    nodePrototype.next = function(selector) {
      var nextSib = this.nextElementSibling;
      while (nextSib !== null) {
        if (nodeMatchesSelector(nextSib, selector)) {
          return nextSib;
        }
        nextSib = nextSib.nextElementSibling;
      }
      return null;
    };

    // 返回位于目标元素之前的所有符合参数条件的兄弟元素
    // @return {array.<node>} 元素节点对象构成之数组
    nodePrototype.prevAll = function(selector) {
      var result = [];
      var prevSib = this.previousElementSibling;
      while (prevSib !== null) {
        if (nodeMatchesSelector(prevSib, selector)) {
          result.unshift(prevSib);
        }
        prevSib = prevSib.previousElementSibling;
      }
      return result;
    }

    // 返回位于目标元素之后的所有符合参数条件的兄弟元素
    // @return {array.<node>} 元素节点对象构成之数组
    nodePrototype.nextAll = function(selector) {
      var result = [];
      var nextSib = this.nextElementSibling;
      while (nextSib !== null) {
        if (nodeMatchesSelector(nextSib, selector)) {
          result.push(nextSib);
        }
        nextSib = nextSib.nextElementSibling;
      }
      return result;
    }

    // 返回目标元素的所有符合参数条件的兄弟元素
    // @return {array.<node>} 元素节点对象构成之数组
    nodePrototype.siblings = function(selector) {
      return this.prevAll(selector).concat(this.nextAll(selector));
    };

    // 返回目标元素之前、符合参数条件的元素（如有）之后的所有兄弟元素
    // @return {array.<node>} 元素节点对象构成之数组
    nodePrototype.prevUntil = function(selector) {
      var result = [];
      var prevSib = this.previousElementSibling;
      while (prevSib !== null) {
        if (nodeMatchesSelector(prevSib, selector)) {
          break;
        }
        result.unshift(prevSib);
        prevSib = prevSib.previousElementSibling;
      }
      return result;
    }

    // 返回目标元素之后、符合参数条件的元素（如有）之前的所有兄弟元素
    // @return {array.<node>} 元素节点对象构成之数组
    nodePrototype.nextUntil = function(selector) {
      var result = [];
      var nextSib = this.nextElementSibling;
      while (nextSib !== null) {
        if (nodeMatchesSelector(nextSib, selector)) {
          break;
        }
        result.push(nextSib);
        nextSib = nextSib.nextElementSibling;
      }
      return result;
    }


  })(globalEnv.Node.prototype);

  /////////////////////////////////////////////
  ///////////////  处理array原型  //////////////
  /////////////////////////////////////////////

  (function(arrayPrototype) {

    // arrayPrototype.not = function(unwantedSelector) {
    //
    // };

  })(globalEnv.Array.prototype);

})(window);

// console.log(nm('.fuck.shit', document.documentElement));
// console.log(query('#black')[0].css({backgroundColor: 'red', height: '200px'}))
console.log(query('#black')[0].css('ts'))
