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
  };

  // 根据［单个］选择器字符串查询，返回目标元素下［所有］符合的元素
  // @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
  // @param {node?} root 提供时以其为遍历起点，否则以document为起点
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

  // 在单一元素上添加/删除单一监听函数
  // @param {node} ele 目标元素节点
  // @param {string} evt 目标事件
  // @param {function} fn 监听函数
  // @param {boolean} option true添加, false删除
  var handleSingleListener = function(ele, evt, fn, option) {
    if (ele.nodeType !== 1) {
      throw new Error('Expected ELEMENT NODE as target.')
    }
    if (typeof evt !== 'string') {
      throw new Error('Expected STRING as target event.')
    }
    if (typeof fn !== 'function') {
      throw new Error('Expected FUNCTION as event listener.')
    }
    if (option === true) {
      switch (true) {
        case ele.addEventListener !== undefined:
          ele.addEventListener(evt, fn, false);
          break;
        case ele.attachEvent !== undefined:
          ele.attachEvent('on' + evt, fn);
          break;
        default:
          throw new Error('You might well update your bloody browser.')
      }
    } else {
      switch (true) {
        case ele.removeEventListener !== undefined:
          ele.removeEventListener(evt, fn, false);
          break;
        case ele.detachEvent !== undefined:
          ele.detachEvent('on' + evt, fn);
          break;
        default:
          throw new Error('You might well update your bloody browser.')
      }
    }
    return this;
  }

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

    ///////////////  样式和属性  ///////////////

    // 元素含指定类名时返回真
    nodePrototype.hasClass = function(tarClassName) {
      if (typeof tarClassName !== 'string') {
        throw new Error('Expected STRING as target class name.');
      }
      var classArr = this.className.split(/\s+/);
      if (classArr[0] !== '') {
        if (classArr.indexOf(tarClassName) !== -1) {
          return true;
        }
      }
      return false;
    };

    // 为目标元素添加指定类
    nodePrototype.addClass = function(tarClassName) {
      if (typeof tarClassName !== 'string') {
        throw new Error('Expected STRING as target class name.');
      }
      if (!this.hasClass(tarClassName)) {
        this.className = this.className.concat(' ' + tarClassName.trim());
      }
      return this;
    };

    // 为目标元素移除指定类
    nodePrototype.removeClass = function(tarClassName) {
      if (typeof tarClassName !== 'string') {
        throw new Error('Expected STRING as target class name.');
      }
      if (this.hasClass(tarClassName)) {
        var classArr = this.className.split(/\s+/);
        classArr.splice(classArr.indexOf(tarClassName), 1);
        this.className = classArr.join(' ');
      }
      return this;
    };

    // 目标元素含指定类时移除，否则添加
    nodePrototype.toggleClass = function(tarClassName) {
      if (typeof tarClassName !== 'string') {
        throw new Error('Expected STRING as target class name.');
      }
      if (this.hasClass(tarClassName)) {
        this.removeClass(tarClassName);
      } else {
        this.addClass(tarClassName);
      }
      return this;
    };

    // 设置或读取目标元素的样式
    // @param {string|object} arg1 只提供此参数：为数值时返回该样式值；为对象时设置元素的多条规则
    // @param {string|number?} arg2 提供时设置指定样式的值
    // @return {node|string|null} 读取时返回字符串或null；设置时返回自身
    nodePrototype.css = function(arg1, arg2) {
      var changeSingleRule = function(name, value) {
        if (/^.*\d$/.test(value)) {
          value = value.concat('px');
        }
        this.style[name] = value;
      };
      switch (arguments.length) {
        case 0:
          throw new Error('Expected at least 1 argument.');
        case 1:
          switch (typeof arg1) {
            case 'string':
              return document.defaultView.getComputedStyle(this, null)[arg1] || null;
            case 'object':
              for (var i in arg1) {
                changeSingleRule.call(this, i, arg1[i]);
              }
              return this;
            default:
              throw new Error('Expected STRING as target style name or OBJECT as style group.')
          }
        case 2:
          switch (typeof arg2) {
            case 'string':
            case 'number':
              changeSingleRule.call(this, arg1, arg2 + '');
              return this;
            default:
              throw new Error('Expected STRING or NUMBER as target style value.');
          }
        default:
          throw new Error('Expected 1~2 arguments.');
      }
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

    ///////////////  选择和遍历  ///////////////

    // 根据组合选择器字符串查询，返回元素下所有符合的元素
    // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
    // @return {array.<node>} 返回成员类型为node的数组或空数组
    nodePrototype.query = function(selectorGroup) {
      return groupSelectorAllResults(selectorGroup, this);
    };

    // 返回目标元素的直接父元素
    // @return {node} 元素节点或null
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
    // @return {node} 元素节点或null
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
    // @return {node} 元素节点或null
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
    // @return {node} 元素节点或null
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
    };

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
    };

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
    };

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
    };

    ///////////////  事件  ///////////////

    // 添加事件监听
    //  1 arg
    //  @param {object} arg1 键：事件名；值：该事件的监听函数
    //  2 arg
    //  @param {string} events 一个或多个事件名
    //  @param {function} fn 监听函数
    nodePrototype.on = function(arg1, arg2) {
      switch (arguments.length) {
        case 1:
          if (typeof arg1 !== 'object') {
            throw new Error('Expected PLAIN OBJECT if only 1 argument is provided.');
          }
          for (var i in arg1) {
            handleSingleListener(this, i, arg1[i], true);
          }
          break;
        case 2:
          if (typeof arg1 !== 'string') {
            throw new Error('Expected STRING as target event(s)\' name.');
          }
          if (typeof arg2 !== 'function') {
            throw new Error('Expected FUNCTION as target event listener.');
          }
          var events = arg1.split(/\s+/);
          for (var i in events) {
            handleSingleListener(this, events[i], arg2, true);
          }
          break;
        default:
          throw new Error('Expected 1~2 arguments.');
      }
      return this;
    };

    // 移除事件监听。参数同上
    nodePrototype.off = function(arg1, arg2) {
      switch (arguments.length) {
        case 1:
          if (typeof arg1 !== 'object') {
            throw new Error('Expected PLAIN OBJECT if only 1 argument is provided.');
          }
          for (var i in arg1) {
            handleSingleListener(this, i, arg1[i], false);
          }
          break;
        case 2:
          if (typeof arg1 !== 'string') {
            throw new Error('Expected STRING as target event(s)\' name.');
          }
          if (typeof arg2 !== 'function') {
            throw new Error('Expected FUNCTION as target event listener.');
          }
          var events = arg1.split(/\s+/);
          for (var i in events) {
            handleSingleListener(this, events[i], arg2, false);
          }
          break;
        default:
          throw new Error('Expected 1~2 arguments.');
      }
      return this;
    };

    //
    nodePrototype.one = function(arg1, arg2) {
      var that = this;
      switch (arguments.length) {
        case 1:
          if (typeof arg1 !== 'object') {
            throw new Error('Expected PLAIN OBJECT if only 1 argument is provided.');
          }
          for (var i in arg1) {
            handleSingleListener(this,
                                 i,
                                 function(){
                                   console.log(that.off)
                                   arg1[i]();
                                   that.off(i, arg1[i]);
                                 },
                                 true);
          }
          break;
        case 2:
          if (typeof arg1 !== 'string') {
            throw new Error('Expected STRING as target event(s)\' name.');
          }
          if (typeof arg2 !== 'function') {
            throw new Error('Expected FUNCTION as target event listener.');
          }
          var events = arg1.split(/\s+/);
          for (var i in events) {
            handleSingleListener(this, events[i], arg2, true);
          }
          break;
        default:
          throw new Error('Expected 1~2 arguments.');
      }
      return this;
    };



  })(globalEnv.Node.prototype);

  /////////////////////////////////////////////
  ///////////////  处理array原型  //////////////
  /////////////////////////////////////////////

  (function(arrayPrototype) {

    // arrayPrototype.not = function(unwantedSelector) {
    //
    // };

  })(globalEnv.Array.prototype);

  /////////////////////////////////////////////
  ///////////////  处理string原型  //////////////
  /////////////////////////////////////////////

  (function(stringPrototype) {

    // 去除字符串首尾的空格
    stringPrototype.trim = function() {
      return this.replace(/^\s+|\s+/g, '');
    };

  })(globalEnv.String.prototype);

})(window);

function showColor(){
  alert(this.css('background-color'));
}
function showTar(e){
  console.log(e.target)
}

query('#damn')[0].css({
  'height': '120',
  'background-color': 'yellow',
}).one({
  'click': showTar,
})
