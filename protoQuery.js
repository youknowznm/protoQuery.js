/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = handleArray;
function handleArray(arrayPrototype) {

    // 在数组原型上添加一个方法：当实例的第一个元素为节点对象时，在该节点上调用对应的节点原型方法
    var extendNodeFuncToArray = function extendNodeFuncToArray(funcName) {
        arrayPrototype[funcName] = function () {
            var firstItem = this[0];
            if (firstItem instanceof Node) {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return window.Node.prototype[funcName].apply(firstItem, args);
            } else {
                throw Error('Expected NODE as first item in array.');
            }
        };
    };

    ['css', 'transform', 'position', 'offset', 'attr', 'html', 'text', 'protoQuery', 'is', 'prepend', 'insertAfter', 'parent', 'parents', 'parentsUntil', 'closest', 'children', 'prev', 'next', 'prevAll', 'nextAll', 'siblings', 'prevUntil', 'nextUntil', 'on', 'off', 'width', 'height', 'innerWidth', 'initHeight', 'outerWidth', 'outerHeight', 'show', 'hide', 'fadeIn', 'fadeOut', 'slideDown', 'slideUp'].forEach(function (i) {
        extendNodeFuncToArray(i);
    });

    arrayPrototype.each = function (fn) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                fn.call(item);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        ;
    };
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = handleBasic;
function handleBasic(wd) {

    //////////// 类相关 ////////////

    var nodePrototype = wd.Node.prototype;

    // 检查目标元素是否包含所有的类名
    nodePrototype.hasClass = function (tarClassesStr) {
        if (typeof tarClassesStr !== 'string' || /^\s*$/.test(tarClassesStr)) {
            throw new Error('Expected non-empty STRING as target class name(s).');
        }
        var tarClassesArr = tarClassesStr.split(/\s+/);
        var eleClassesArr = this.className.split(/\s+/);
        var allMatch = true;
        for (var i = 0; i < tarClassesArr.length; i++) {
            if (eleClassesArr.indexOf(tarClassesArr[i]) === -1) {
                allMatch = false;
                break;
            }
        }
        return allMatch;
    };

    // 为目标元素添加若干个类名
    nodePrototype.addClass = function (tarClassesStr) {
        if (typeof tarClassesStr !== 'string' || /^\s*$/.test(tarClassesStr)) {
            throw new Error('Expected non-empty STRING as target class name(s).');
        }
        var tarClassesArr = tarClassesStr.split(/\s+/);
        var eleClassesArr = this.className.split(/\s+/);
        for (var i = 0; i < tarClassesArr.length; i++) {
            if (eleClassesArr.indexOf(tarClassesArr[i]) === -1) {
                eleClassesArr.push(tarClassesArr[i]);
            }
        }
        this.className = eleClassesArr.join(' ').trim();
        return this;
    };

    // 为目标元素移除若干个类名
    nodePrototype.removeClass = function (tarClassesStr) {
        if (typeof tarClassesStr !== 'string' || /^\s*$/.test(tarClassesStr)) {
            throw new Error('Expected non-empty STRING as target class name(s).');
        }
        var tarClassesArr = tarClassesStr.split(/\s+/);
        var eleClassesArr = this.className.split(/\s+/);
        for (var i = 0; i < tarClassesArr.length; i++) {
            var pos = eleClassesArr.indexOf(tarClassesArr[i]);
            if (pos !== -1) {
                eleClassesArr[pos] = '';
            }
        }
        this.className = eleClassesArr.join(' ').trim();
        return this;
    };

    //////////// 基本选择方法 ////////////

    /*
    判断单个节点是否符合单个选择器
    @param {node} tarNode 目标节点
    @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
    @return {boolean}
    */
    wd.nodeMatchesSelector = function (tarNode, selector) {
        if (!tarNode instanceof Node) {
            throw new Error('Expected NODE as target node.');
        }
        if (typeof selector !== 'string' || selector === '') {
            throw new Error('Expected non-empty STRING as selector.');
        }
        switch (true) {
            // id选择器
            case /^#([\w-]+)$/.test(selector):
                return tarNode.id === RegExp.$1;
            // 类选择器，支持多个类
            case /^\.([\w-\.]+)$/.test(selector):
                var tarClassesStr = RegExp.$1.split('.');
                var thisNodeMatches = false;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = tarClassesStr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var tarClass = _step.value;

                        thisNodeMatches = true;
                        if (!tarNode.hasClass(tarClass)) {
                            thisNodeMatches = false;
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
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

    /*
    处理根元素参数
    @param {node|array|undefined} root 要处理的节点。不传入则以body为起点，传入第一项为节点的数组则以该项为起点
    @return {node}
    */
    var handleRootNodeParam = function handleRootNodeParam(root) {
        var r = void 0;
        switch (true) {
            case root === undefined:
                r = document.body;
                break;
            case root[0] instanceof Node:
                r = root[0];
                break;
            default:
                r = root;
        }
        return r;
    };

    /*
    根据［单个］选择器字符串查询，返回目标元素下所有符合的元素
    @param {string} selector 单个查询字符串
    @param {node|array|undefined} root 要处理的节点。不传入则以body为起点，传入第一项为节点的数组则以该项为起点
    @return {array.<node>} 返回成员类型为node的数组或空数组
    */
    var singleQuery = function singleQuery(selector, root) {
        if (typeof selector !== 'string' || selector === '') {
            throw new Error('Expected non-empty STRING as selector.');
        }
        var _root = handleRootNodeParam(root);
        var result = [];
        var walker = document.createTreeWalker(_root, NodeFilter.SHOW_ELEMENT, null, false);
        var currentNode = walker.nextNode();
        while (currentNode !== null) {
            if (nodeMatchesSelector(currentNode, selector)) {
                result.push(currentNode);
            }
            currentNode = walker.nextNode();
        }
        return result;
    };

    /*
    根据［组合］选择器字符串查询，返回目标元素下所有符合的元素
    @param {string|node} selectorGroup 多个以空格连接的查询字符串
    @param {node|array|undefined} root 要处理的节点。不传入则以body为起点，传入第一项为节点的数组则以该项为起点
    @return {array.<node>} 返回成员类型为node的数组或空数组
    */
    var multiQuery = wd.$ = function (selectorGroup, root) {
        // 传入元素节点则直接放入数组中返回
        if (selectorGroup.nodeType === 1) {
            return [selectorGroup];
        }
        // 传入window对象或'body'时返回body元素
        if (selectorGroup === window || selectorGroup === 'body') {
            return [document.body];
        }
        // 选择器开头如有'body'去掉之
        selectorGroup = selectorGroup.trim().replace(/^body\s+/, '');
        var selectorArr = selectorGroup.split(/\s+/);
        var _root = handleRootNodeParam(root);
        if (_root.querySelectorAll !== undefined) {

            // querySelectorAll返回类数组对象，需转换为数组
            var fakeArr = _root.querySelectorAll(selectorGroup);
            return [].slice.call(fakeArr);
        } else {

            return selectorArr.reduce(function (i1, i2) {
                // 为普通空数组时返回之
                if (Array.isArray(i1) && i1[0] === undefined) {
                    return [];
                }
                return singleQuery(i2, i1);
            }, _root);
        }
    };

    // 根据组合选择器字符串查询，返回元素下所有符合的元素
    // @param {string} selectorGroup "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式以空格连接的查询字符串
    // @return {array.<node>} 返回成员类型为node的数组或空数组
    nodePrototype.protoQuery = function (selectorGroup) {
        return multiQuery(selectorGroup, this);
    };

    // 目标元素本身符合字符串时返回真
    nodePrototype.is = function (selector) {
        return nodeMatchesSelector(this, selector);
    };
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = handleFx;
function handleFx(nodePrototype) {

    // 动效和捷径
    var FLOAT_TYPE_STYLE = ['opacity'];

    var protoQueryUtil = {
        onGoingAnimations: {}
    };

    // 基本动画（基于样式）
    // @param {node} ele 目标元素
    // @param {string} tarStyle 目标样式名
    // @param {string} tarValue 目标样式值
    // @return {number} cycleId 动画标识id
    var transformSingleRule = function transformSingleRule(ele, tarStyle, tarValue) {
        var fullStyleValue = getComputedStyle(ele)[tarStyle]; // 完整样式值
        var currentValue = parseFloat(fullStyleValue); // 样式数字部分。非数字则抛出异常
        if (!isFinite(currentValue)) {
            throw new Error('Expected a number-type style value.');
        }
        var styleSuffix = fullStyleValue.match(/^[-\d]+(.*)$/)[1] || ''; // 非数字的后缀
        if (FLOAT_TYPE_STYLE.indexOf(tarStyle) > -1) {
            currentValue *= 10000;
            tarValue *= 10000;
        }
        // #02 开始忽略了负值的情况
        var cycleId = setInterval(function () {
            // let diff =
            switch (true) {
                case currentValue < tarValue:
                    currentValue += Math.ceil((tarValue - currentValue) / 10);
                    break;
                case currentValue > tarValue:
                    currentValue -= Math.ceil((currentValue - tarValue) / 10);
                    break;
                default:
                    protoQueryUtil.onGoingAnimations[cycleId] = true;
                    clearInterval(cycleId);
            }
            if (FLOAT_TYPE_STYLE.indexOf(tarStyle) > -1) {
                ele.css(tarStyle, currentValue / 10000);
            } else {
                ele.css(tarStyle, currentValue + styleSuffix);
            }
        }, 20);
        protoQueryUtil.onGoingAnimations[cycleId] = false;
        return cycleId;
    };

    // 渐变目标的一个或多个样式
    //  @param {object} arg1 键：样式名；值：样式值
    //  @param {function?} arg2 完成后的回调函数
    nodePrototype.transform = function (styleObj, callback) {
        if ((typeof styleObj === 'undefined' ? 'undefined' : _typeof(styleObj)) !== 'object') {
            throw new Error('Expected PLAIN OBJECT containing style key-value pairs.');
        }
        var animationIdGroup = [];
        for (var i in styleObj) {
            console.log(i);
            console.log(styleObj[i]);
            var id = transformSingleRule(this, i, styleObj[i]);
            animationIdGroup.push(id);
        }
        if (typeof callback === 'function') {
            var callbackId = setInterval(function () {
                for (var j in animationIdGroup) {
                    if (zQueryUtil.onGoingAnimations[animationIdGroup[j]] === false) {
                        return;
                    }
                }
                clearInterval(callbackId);
                callback();
            }, 5);
        }
        return this;
    };

    // 显示/隐藏元素。参数为'transform'时从左上角开始动画，否则即时
    nodePrototype.show = function (option) {
        if (this.css('display') === 'none') {
            switch (option) {
                case 'transform':
                    var initWidth = parseInt(this.width());
                    var initHeight = parseInt(this.height());
                    this.css({
                        display: 'block',
                        width: 0,
                        height: 0
                    });
                    this.transform({
                        width: initWidth,
                        height: initHeight
                    });
                    break;
                default:
                    this.css('display', 'block');
            }
        }
        return this;
    };
    nodePrototype.hide = function (option) {
        if (this.css('display') !== 'none') {
            switch (option) {
                case 'transform':
                    this.transform({
                        width: 0,
                        height: 0
                    });
                    break;
                default:
                    this.css('display', 'none');
            }
        }
        return this;
    };
    // 渐变透明度以显示/隐藏元素
    nodePrototype.fadeIn = function () {
        if (this.css('display') === 'none') {
            this.css({
                opacity: 0,
                display: 'block'
            });
            this.transform({
                opacity: 1
            });
        }
        return this;
    };
    nodePrototype.fadeOut = function () {
        if (this.css('display') !== 'none') {
            this.transform({
                'opacity': 0
            }, function () {
                this.hide();
            });
        }
        return this;
    };
    // 渐变高度以显示/隐藏元素
    nodePrototype.slideDown = function () {
        if (this.css('display') === 'none') {
            var initHeight = this.height();
            this.css({
                height: 0,
                display: 'block'
            });
            this.transform({
                height: initHeight
            });
        }
        return this;
    };
    nodePrototype.slideUp = function () {
        if (this.css('display') !== 'none') {
            var that = this;
            this.transform({
                'height': 0
            }, function () {
                that.hide();
            });
        }
        return this;
    };
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = handleNodeAttr;
function handleNodeAttr(nodePrototype) {

    ///////////////  样式和属性  ///////////////

    var NUMBER_TYPE_STYLE = ['opacity'];

    // 修改元素的单一样式
    var changeSingleRule = function changeSingleRule(ele, name, value) {
        if (/^.*\d$/.test(value) && NUMBER_TYPE_STYLE.indexOf(name) === -1) {
            value += 'px';
        }
        ele.style[name] = value;
    };

    // 设置或读取目标元素的样式
    // @param {string|object} arg1 只提供此参数：为数值时返回该样式值；为对象时设置元素的多条规则
    // @param {string|number?} arg2 提供时设置指定样式的值
    // @return {node|string|null} 读取时返回字符串或null；设置时返回自身
    nodePrototype.css = function (arg1, arg2) {
        switch (arguments.length) {
            case 1:
                switch (typeof arg1 === 'undefined' ? 'undefined' : _typeof(arg1)) {
                    case 'string':
                        return getComputedStyle(this, null)[arg1] || null;
                    case 'object':
                        for (var i in arg1) {
                            changeSingleRule(this, i, arg1[i]);
                        }
                        return this;
                    default:
                        throw new Error('Expected STRING as target style name or OBJECT as style group.');
                }
            case 2:
                switch (typeof arg2 === 'undefined' ? 'undefined' : _typeof(arg2)) {
                    case 'string':
                    case 'number':
                        changeSingleRule(this, arg1, arg2 + '');
                        return this;
                    default:
                        throw new Error('Expected STRING or NUMBER as target style value.');
                }
            default:
                throw new Error('Expected 1~2 arguments.');
        }
    };

    // 返回元素相对于父定位元素之坐标
    nodePrototype.position = function () {
        var top = this.offsetTop,
            left = this.offsetLeft;
        return { top: top, left: left };
    };

    // 返回元素相对于浏览器窗口之坐标
    nodePrototype.offset = function () {
        var top = this.offsetTop;
        var left = this.offsetLeft;
        var posParent = this.offsetParent;
        while (posParent !== null) {
            top += posParent.offsetTop;
            left += posParent.offsetLeft;
            posParent = posParent.offsetParent;
        }
        return { top: top, left: left };
    };

    // 获取或设置目标属性
    // @param {string} tarAttr 目标属性名
    // @param {string} tarValue 目标属性值
    // @return {string|null|object.node} 获取时返回字符串或null；设置时返回自身
    nodePrototype.attr = function (tarAttr, tarValue) {
        if (typeof tarAttr !== 'string') {
            throw new Error('Expected STRING as target attribute name.');
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

    // 获取或设置目标的innerHTML
    nodePrototype.html = function (tarHTML) {
        if (tarHTML === undefined) {
            return this.innerHTML;
        }
        this.innerHTML = tarHTML;
        return this;
    };

    // 获取或设置目标的文字内容
    nodePrototype.text = function (tarText) {
        if (tarHTML === undefined) {
            return this.textContent;
        }
        this.textContent = tarText;
        return this;
    };

    // 读写元素自身的宽/高
    nodePrototype.width = function (value) {
        return value === undefined ? parseInt(this.css('width')) : this.css('width', value);
    };
    nodePrototype.height = function (value) {
        return value === undefined ? parseInt(this.css('height')) : this.css('height', value);
    };
    // 获取元素的自身宽/高 + 内边距
    nodePrototype.innerWidth = function () {
        return this.width() + parseInt(this.css('paddingLeft')) + parseInt(this.css('paddingRight'));
    };
    nodePrototype.innerHeight = function () {
        return this.height() + parseInt(this.css('paddingTop')) + parseInt(this.css('paddingBottom'));
    };
    // 获取元素的自身宽/高 + 内边距 + 边框，参数为真时包括外边距
    nodePrototype.outerWidth = function (includeMargin) {
        var r = this.innerWidth() + parseInt(this.css('borderLeftWidth')) + parseInt(this.css('borderRightWidth'));
        if (includeMargin === true) {
            r += parseInt(this.css('marginLeft')) + parseInt(this.css('marginRight'));
        }
        return r;
    };
    nodePrototype.outerHeight = function (includeMargin) {
        var r = this.innerHeight() + parseInt(this.css('borderTopWidth')) + parseInt(this.css('borderBottomWidth'));
        if (includeMargin === true) {
            r += parseInt(this.css('marginTop')) + parseInt(this.css('marginBottom'));
        }
        return r;
    };

    // 读写元素的滚动高度
    nodePrototype.scrollTop = function (tarValue) {
        if (isFinite(parseInt(tarValue))) {
            this.scrollTop = tarValue;
            return this;
        }
        return this.scrollTop;
    };
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = handleNodeEvents;
function handleNodeEvents(nodePrototype) {

    ///////////////  事件  ///////////////

    /*
    返回添加/删除监听的方法，兼容远古浏览器
    @param {string|undefined} delegationSelector 要代理的元素选择器
    */
    var getOnFunc = function getOnFunc(ele, fn, delegationSelector) {
        var _fn = void 0;
        // 提供代理元素选择器则处理之
        if (typeof delegationSelector === 'string') {
            _fn = function _fn(evtObj) {
                if (evtObj.target.is(delegationSelector)) {
                    fn.call(this, evtObj);
                }
            };
        } else {
            _fn = fn;
        }
        if (ele.addEventListener) {
            return function (evtName) {
                ele.addEventListener(evtName, _fn, false);
            };
        } else {
            return function (evtName) {
                ele.attachEvent('on' + evtName, _fn);
            };
        }
    };

    var getOffFunc = function getOffFunc(ele, evtName, fn) {
        if (ele.removeEventListener) {
            return function (evtName) {
                ele.removeEventListener(evtName, fn, false);
            };
        } else {
            return function (evtName) {
                ele.detachEvent('on' + evtName, fn);
            };
        }
    };

    /*
    在单一元素上添加/删除单一监听函数
    @param {node} ele 目标元素节点
    @param {string} evts 单一或多个目标事件
    @param {function} fn 监听函数
    @param {object} options 'method'为'add'或'remove'；提供'delegationSelector'时代理监听
    */
    var handleSingleListener = function handleSingleListener(ele, evts, fn, options) {
        if (ele.nodeType !== 1) {
            throw new Error('Expected ELEMENT NODE as target.');
        }
        if (typeof evts !== 'string') {
            throw new Error('Expected STRING as target event(s).');
        }
        if (typeof fn !== 'function') {
            throw new Error('Expected FUNCTION as event listener.');
        }
        var handleEachEvent = null;
        switch (options.method) {
            case 'add':
                handleEachEvent = getOnFunc(ele, fn, options.delegationSelector);
                break;
            case 'remove':
                handleEachEvent = getOffFunc(ele, fn);
                break;
        }
        // 提供多个事件名时，分别添加该监听
        var targetEvents = evts.split(/\s/);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = targetEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var evt = _step.value;

                handleEachEvent(evt);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    };

    // 添加事件监听
    //  1 arg
    //  @param {object} arg1 键：一个或多个事件名；值：该事件的监听函数
    //  2 arg
    //  @param {string} arg1 一个或多个事件名
    //  @param {function} arg2 监听函数
    //  3 arg
    //  @param {string} arg1 一个或多个事件名
    //  @param {string} arg2 被代理者的选择字符串
    //  @param {function} arg3 监听函数
    nodePrototype.on = function (arg1, arg2, arg3) {
        switch (arguments.length) {
            case 1:
                if ((typeof arg1 === 'undefined' ? 'undefined' : _typeof(arg1)) !== 'object') {
                    throw new Error('Expected PLAIN OBJECT if only 1 argument is provided.');
                }
                for (var i in arg1) {
                    handleSingleListener(this, i, arg1[i], {
                        method: 'add'
                    });
                }
                return this;
            case 2:
                if (typeof arg1 !== 'string') {
                    throw new Error('Expected STRING as target event(s)\' name.');
                }
                if (typeof arg2 !== 'function') {
                    throw new Error('Expected FUNCTION as target event listener.');
                }
                handleSingleListener(this, arg1, arg2, {
                    method: 'add'
                });
                return this;
            case 3:
                if (typeof arg1 !== 'string') {
                    throw new Error('Expected STRING as target event(s)\' name.');
                }
                if (typeof arg2 !== 'string') {
                    throw new Error('Expected STRING as selector for delegated elements.');
                }
                if (typeof arg3 !== 'function') {
                    throw new Error('Expected FUNCTION as target event listener.');
                }
                handleSingleListener(this, arg1, arg3, {
                    method: 'add',
                    delegationSelector: arg2
                });
                return this;
            default:
                throw new Error('Expected 1~3 arguments.');
        }
    };

    // 移除事件监听。未提供代理移除的方法
    //  1 arg
    //  @param {object} arg1 键：一个或多个事件名；值：该事件的监听函数
    //  2 arg
    //  @param {string} arg1 一个或多个事件名
    //  @param {function} arg2 监听函数
    nodePrototype.off = function (arg1, arg2) {
        switch (arguments.length) {
            case 1:
                if ((typeof arg1 === 'undefined' ? 'undefined' : _typeof(arg1)) !== 'object') {
                    throw new Error('Expected PLAIN OBJECT if only 1 argument is provided.');
                }
                for (var i in arg1) {
                    handleSingleListener(this, i, arg1[i], {
                        method: 'remove'
                    });
                }
                return this;
            case 2:
                if (typeof arg1 !== 'string') {
                    throw new Error('Expected STRING as target event(s)\' name.');
                }
                if (typeof arg2 !== 'function') {
                    throw new Error('Expected FUNCTION as target event listener.');
                }
                handleSingleListener(this, arg1, arg2, {
                    method: 'remove'
                });
                return this;
            default:
                throw new Error('Expected 1~2 arguments.');
        }
    };
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = handleNodeTrav;
function handleNodeTrav(nodePrototype) {

    ///////////////  选择和遍历  ///////////////

    // 在当前元素的第一个子元素前插入目标元素
    // @return {node} 插入的新元素节点
    nodePrototype.prepend = function (tarNode) {
        if (tarNode.nodeType !== 1) {
            throw new Error('Expected ELEMENT NODE as target node.');
        }
        this.insertBefore(tarNode, this.firstElementChild);
        return tarNode;
    };

    // @param {node} newNode 新元素节点
    // @param {node} referenceNode 比照元素节点
    // @return {node} 插入的新元素节点
    nodePrototype.insertAfter = function (newNode, referenceNode) {
        if (newNode.nodeType !== 1) {
            throw new Error('Expected ELEMENT NODE as target node.');
        }
        if (referenceNode.nodeType !== 1) {
            throw new Error('Expected ELEMENT NODE as reference node.');
        }
        if (this.lastElementChild === referenceNode) {
            this.appendChild(newNode);
        } else {
            this.insertBefore(newNode, referenceNode.nextElementSibling);
        }
        return newNode;
    };

    // 返回目标元素的直接父元素
    // @return {node} 元素节点或null
    nodePrototype.parent = function () {
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
    nodePrototype.parents = function (selector) {
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
    nodePrototype.parentsUntil = function (selector) {
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
    nodePrototype.closest = function (selector) {
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
    nodePrototype.children = function (selector) {
        var result = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var child = _step.value;

                if (child.nodeType === 1 && nodeMatchesSelector(child, selector)) {
                    result.push(child);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return result;
    };

    // 返回目标元素之前的符合参数条件的最近的兄弟元素
    // @return {node} 元素节点或null
    nodePrototype.prev = function (selector) {
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
    nodePrototype.next = function (selector) {
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
    nodePrototype.prevAll = function (selector) {
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
    nodePrototype.nextAll = function (selector) {
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
    nodePrototype.siblings = function (selector) {
        return this.prevAll(selector).concat(this.nextAll(selector));
    };

    // 返回目标元素之前、符合参数条件的元素（如有）之后的所有兄弟元素
    // @return {array.<node>} 元素节点对象构成之数组
    nodePrototype.prevUntil = function (selector) {
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
    nodePrototype.nextUntil = function (selector) {
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
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = handleString;
function handleString(stringPrototype) {

    // 去除字符串首尾的空格
    if (stringPrototype.trim === undefined) {
        stringPrototype.trim = function () {
            return this.replace(/^\s+|\s+/g, '');
        };
    }

    // 判断字符串是否符合常见邮箱格式
    stringPrototype.isEmail = function () {
        return (/^([a-zA-Z\d]+)\w@(\w+)(\.[a-zA-Z]{2,}) {1,2}$/.test(this)
        );
    };

    // 判断字符串是否为有效日期，无法判断闰年
    stringPrototype.isValidDate = function () {
        if (/^([012]\d\d\d)-(([01]\d)-([0123]\d))$/.test(this)) {
            var y = +RegExp.$1;
            var m = +RegExp.$3;
            var d = +RegExp.$4;
            var md = RegExp.$2;
            if (y !== 0 && m !== 0 && d !== 0) {
                if (y < 2100 && m < 13 && d < 32) {
                    if (['02-30', '02-31', '04-31', '06-31', '09-31', '11-31'].indexOf(md) === -1) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = addUtil;
function addUtil(wd) {

    /////////////////////////////////////////////
    //////////////  处理window对象  //////////////
    /////////////////////////////////////////////

    // 浏览器为移动端时设置全局变量isMobile为真，否则为假；并返回该值
    wd.detectMobile = function () {
        var ua = wd.navigator.userAgent;
        var result = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Mobile|UCWeb/i.test(ua) ? true : false;
        wd.isMobile = result;
        return result;
    };

    // 判断目标对象是否为空对象（不是null）
    // @param {object} target 目标对象
    // @param {boolean?} shoudlIncludeInherited 为真时，考虑继承来的属性
    wd.isEmpty = function (target, shoudlIncludeInherited) {
        switch (shoudlIncludeInherited) {
            case true:
                for (var anyKey in target) {
                    return false;
                }
                return true;
            default:
                for (var _anyKey in target) {
                    if (target.hasOwnProperty(_anyKey)) {
                        return false;
                    }
                }
                return true;
        }
    };

    // 复制原始类型值或一般对象
    wd.clone = function (source) {
        var result = void 0;
        switch (typeof target === 'undefined' ? 'undefined' : _typeof(target)) {
            case 'boolean':
            case 'number':
            case 'string':
                result = source;
                break;
            case 'object':
                switch (true) {
                    case source instanceof Date:
                        result = new Date(source.getTime());
                        break;
                    case Array.isArray(source):
                        result = [];
                        for (var key in source) {
                            result[key] = clone(source[key]);
                        }
                        break;
                    default:
                        result = {};
                        for (var prop in source) {
                            result[prop] = clone(source[prop]);
                        }
                }
            default:
                throw new Error('Interesting input: ' + ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) + ''));
        }
    };

    // 返回去重的新数组（限定为基本类型值组成），原数组未改动
    wd.uniq = function (arr) {
        // es5的笨方法
        // if (!Array.isArray(arr)) {
        //   throw new Error('Expected ARRAY to process.');
        // }
        // let result = [];
        // for (let item of arr) {
        //   if (result.indexOf(item) === -1) {
        //     result.push(currentItem);
        //   }
        // }
        // return result;
        return Array.from(new Set(arr));
    };

    // 读写cookie
    //  1 arg
    //  @param {string} arg1 目标cookie名
    //  @return {string} cookie值或空字符串
    //  2 arg
    //  @param {string} arg1 目标cookie名
    //  @param {string} arg2 目标cookie值
    //  3 arg
    //  @param {string} arg1 目标cookie名
    //  @param {string} arg2 目标cookie值
    //  @param {number} arg3 有效天数
    wd.cookie = function (arg1, arg2, ar3) {
        switch (arguments.length) {
            case 1:
                if (typeof arg1 !== 'string') {
                    throw new Error('Expected STRING as target cookie name.');
                }
                var cookieStr = document.cookie;
                var start = cookieStr.indexOf(encodeURIComponent(arg1) + '=');
                if (start > -1) {
                    var semicolonPos = cookieStr.indexOf(';', start);
                    var end = semicolonPos === -1 ? cookieStr.length : semicolonPos;
                    var rawCookieValue = cookieStr.slice(start, end).match(/=(.*)/)[1];
                    return decodeURIComponent(rawCookieValue);
                }
                return '';
            default:
                if (typeof arg1 !== 'string') {
                    throw new Error('Expected STRING as target cookie name.');
                }
                if (typeof arg2 !== 'string') {
                    throw new Error('Expected STRING as target cookie value.');
                }
                var cookieText = encodeURIComponent(arg1) + '=' + encodeURIComponent(arg2);
                if (ar3 !== undefined) {
                    if (typeof ar3 !== 'number') {
                        throw new Error('Expected NUMBER as expire day (if provided).');
                    }
                    var expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + ar3);
                    cookieText = cookieText + '; expires=' + expireDate.toUTCString();
                }
                document.cookie = cookieText;
        }
    };

    // 简易ajax方法
    // @param {string} url 目标url
    // @param {object} options 选项对象，应包含发送类型、数据（对象或查询字符串）、成功函数和失败函数
    wd.ajax = function (url, _ref) {
        var _ref$type = _ref.type,
            type = _ref$type === undefined ? 'GET' : _ref$type;

        var data = void 0;
        switch (_typeof(options.data)) {
            case 'string':
                data = encodeURIComponent(options.data);
                break;
            case 'object':
                var dataArr = [];
                for (var key in options.data) {
                    dataArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(options.data[key]));
                }
                data = dataArr.join('&');
                break;
            default:
                throw new Error('Expected STRING or OBJECT as data to send.');
        }
        var onDone = typeof options.onDone === 'function' ? options.onDone : function (res) {
            console.log('XHR done. res:' + res);
        };
        var onFail = typeof options.onFail === 'function' ? options.onFail : function (res) {
            console.log('XHR fail. res:' + res);
        };
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    onDone(xhr.responseText);
                } else {
                    onFail(this.status);
                }
            }
        };
        switch (type.toUpperCase()) {
            case 'GET':
                xhr.open('GET', url + '?' + data, true);
                xhr.send();
                break;
            case 'POST':
                xhr.open('POST', url, true);
                xhr.send(data);
                break;
        }
    };
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _basic = __webpack_require__(1);

var _basic2 = _interopRequireDefault(_basic);

var _string = __webpack_require__(6);

var _string2 = _interopRequireDefault(_string);

var _nodeAttr = __webpack_require__(3);

var _nodeAttr2 = _interopRequireDefault(_nodeAttr);

var _nodeTrav = __webpack_require__(5);

var _nodeTrav2 = _interopRequireDefault(_nodeTrav);

var _nodeEvents = __webpack_require__(4);

var _nodeEvents2 = _interopRequireDefault(_nodeEvents);

var _array = __webpack_require__(0);

var _array2 = _interopRequireDefault(_array);

var _fx = __webpack_require__(2);

var _fx2 = _interopRequireDefault(_fx);

var _util = __webpack_require__(7);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 在文档结束渲染、开始加载内嵌资源时初始化
/*
 * protoQuery lib
 * https://github.com/youknowznm/zQuery
 *
 * @youknowznm
 * 2017-05-18
 */

document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {
        initProtoQuery(window);
    }
};

var initProtoQuery = function initProtoQuery(wd) {

    (0, _basic2.default)(wd);
    (0, _nodeAttr2.default)(wd.Node.prototype);
    (0, _nodeTrav2.default)(wd.Node.prototype);
    (0, _nodeEvents2.default)(wd.Node.prototype);
    (0, _fx2.default)(wd.Node.prototype);
    (0, _array2.default)(wd.Array.prototype);
    (0, _string2.default)(wd.String.prototype);
    (0, _util2.default)(wd);
};

/***/ })
/******/ ]);