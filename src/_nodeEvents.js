export default function handleNodeEvents(nodePrototype) {

    ///////////////  事件  ///////////////

    /**
    * 返回添加/删除监听的方法，兼容远古浏览器
    * @param {string|undefined} delegationSelector 要代理的元素选择器
    */
    let getOnFunc = function(ele, fn, delegationSelector) {
        let _fn;
        // 提供代理元素选择器则处理之
        if (typeof delegationSelector === 'string') {
            _fn = function(evtObj) {
                if (evtObj.target.is(delegationSelector)) {
                    fn.call(this, evtObj);
                }
            };
        } else {
            _fn = fn;
        }
        if (ele.addEventListener) {
            return function(evtName) {
                ele.addEventListener(evtName, _fn, false);
            };
        } else {
            return function(evtName) {
                ele.attachEvent('on' + evtName, _fn);
            };
        }
    };

    let getOffFunc = function(ele, evtName, fn) {
        if (ele.removeEventListener) {
            return function(evtName) {
                ele.removeEventListener(evtName, fn, false);
            };
        } else {
            return function(evtName) {
                ele.detachEvent('on' + evtName, fn);
            };
        }
    };

    /**
    * 在单一元素上添加/删除单一监听函数
    * @param {node} ele 目标元素节点
    * @param {string} evts 单一或多个目标事件
    * @param {function} fn 监听函数
    * @param {object} options 'method'为'add'或'remove'；提供'delegationSelector'时代理监听
    */
    let handleSingleListener = function(ele, evts, fn, options) {
        if (ele.nodeType !== 1) {
            throw new Error('Expected ELEMENT NODE as target.')
        }
        if (typeof evts !== 'string') {
            throw new Error('Expected STRING as target event(s).')
        }
        if (typeof fn !== 'function') {
            throw new Error('Expected FUNCTION as event listener.')
        }
        let handleEachEvent = null;
        switch (options.method) {
            case 'add':
                handleEachEvent = getOnFunc(ele, fn, options.delegationSelector);
                break;
            case 'remove':
                handleEachEvent = getOffFunc(ele, fn);
                break;
        }
        // 提供多个事件名时，分别添加该监听
        let targetEvents = evts.split(/\s/);
        for (let evt of targetEvents) {
            handleEachEvent(evt);
        }
    };

    /**  添加事件监听
    *  1 arg
    *  @param {object} arg1 键：一个或多个事件名；值：该事件的监听函数
    *  2 arg
    *  @param {string} arg1 一个或多个事件名
    *  @param {function} arg2 监听函数
    *  3 arg
    *  @param {string} arg1 一个或多个事件名
    *  @param {string} arg2 被代理者的选择字符串
    *  @param {function} arg3 监听函数
    */
    nodePrototype.on = function(arg1, arg2, arg3) {
        switch (arguments.length) {
            case 1:
                if (typeof arg1 !== 'object') {
                    throw new Error(
                        'Expected PLAIN OBJECT if only 1 argument is provided.'
                    );
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
                    throw new Error(
                        'Expected STRING as selector for delegated elements.');
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

    /**  移除事件监听。未提供代理移除的方法
    * 1 arg
    * @param {object} arg1 键：一个或多个事件名；值：该事件的监听函数
    * 2 arg
    * @param {string} arg1 一个或多个事件名
    * @param {function} arg2 监听函数
    */
    nodePrototype.off = function(arg1, arg2) {
        switch (arguments.length) {
            case 1:
                if (typeof arg1 !== 'object') {
                    throw new Error(
                        'Expected PLAIN OBJECT if only 1 argument is provided.'
                    );
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