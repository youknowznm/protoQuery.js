export default function handleBasic(wd) {

    //////////// 类相关 ////////////

    let nodePrototype = wd.Node.prototype;

    // 检查目标元素是否包含所有的类名
    nodePrototype.hasClass = function(tarClassesStr) {
        if (typeof tarClassesStr !== 'string' || /^\s*$/.test(tarClassesStr)) {
            throw new Error('Expected non-empty STRING as target class name(s).');
        }
        let tarClassesArr = tarClassesStr.split(/\s+/);
        let eleClassesArr = this.className.split(/\s+/);
        let allMatch = true;
        for (let i = 0; i < tarClassesArr.length; i++) {
            if (eleClassesArr.indexOf(tarClassesArr[i]) === -1) {
                allMatch = false;
                break;
            }
        }
        return allMatch;
    };

    // 为目标元素添加若干个类名
    nodePrototype.addClass = function(tarClassesStr) {
        if (typeof tarClassesStr !== 'string' || /^\s*$/.test(tarClassesStr)) {
            throw new Error('Expected non-empty STRING as target class name(s).');
        }
        let tarClassesArr = tarClassesStr.split(/\s+/);
        let eleClassesArr = this.className.split(/\s+/);
        for (let i = 0; i < tarClassesArr.length; i++) {
            if (eleClassesArr.indexOf(tarClassesArr[i]) === -1) {
                eleClassesArr.push(tarClassesArr[i]);
            }
        }
        this.className = eleClassesArr.join(' ').trim();
        return this;
    };

    // 为目标元素移除若干个类名
    nodePrototype.removeClass = function(tarClassesStr) {
        if (typeof tarClassesStr !== 'string' || /^\s*$/.test(tarClassesStr)) {
            throw new Error('Expected non-empty STRING as target class name(s).');
        }
        let tarClassesArr = tarClassesStr.split(/\s+/);
        let eleClassesStr = this.className;
        let eleClassesArr = this.className.split(/\s+/);
        for (let i = 0; i < tarClassesArr.length; i++) {
            let pos = eleClassesArr.indexOf(tarClassesArr[i]);
            if (pos !== -1) {
                eleClassesArr[pos] = '';
            }
        }
        this.className = eleClassesArr.join(' ').trim();
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

    //////////// 基本选择方法 ////////////

    /*
    判断单个节点是否符合单个选择器
    @param {node} tarNode 目标节点
    @param {string} selector "#header"，".item"，"ul"，"[type]"，"[type=radio]"形式的［单个］查询字符串
    @return {boolean}
    */
    wd.nodeMatchesSelector = function(tarNode, selector) {
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
                let tarClassesStr = RegExp.$1.split('.');
                let thisNodeMatches = false;
                for (let tarClass of tarClassesStr) {
                    thisNodeMatches = true;
                    if (!tarNode.hasClass(tarClass)) {
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

    /*
    处理根元素参数
    @param {node|array|undefined} root 要处理的节点。不传入则以body为起点，传入第一项为节点的数组则以该项为起点
    @return {node}
    */
    let handleRootNodeParam = function(root) {
        let r;
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
    let singleQuery = function(selector, root) {
        if (typeof selector !== 'string' || selector === '') {
            throw new Error('Expected non-empty STRING as selector.');
        }
        let _root = handleRootNodeParam(root);
        let result = [];
        let walker = document.createTreeWalker(_root, NodeFilter.SHOW_ELEMENT, null, false);
        let currentNode = walker.nextNode();
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
    let multiQuery = wd.$ = function(selectorGroup, root) {
        // 传入window或元素节点则直接放入数组中返回
        if (selectorGroup.nodeType === 1) {
            return [selectorGroup];
        }
        if (selectorGroup === window) {
            return [document.body];
        }
        // 选择器开头如有'body'去掉之
        selectorGroup = selectorGroup.trim().replace(/^body\s+/, '');
        let selectorArr = selectorGroup.split(/\s+/);
        let _root = handleRootNodeParam(root);
        if (_root.querySelectorAll !== undefined) {

            // querySelectorAll返回类数组对象，需转换为数组
            let fakeArr = _root.querySelectorAll(selectorGroup);
            return [].slice.call(fakeArr);

        } else {

            return selectorArr.reduce(function(i1, i2) {
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
    nodePrototype.protoQuery = function(selectorGroup) {
        return multiQuery(selectorGroup, this);
    };

    // 目标元素本身符合字符串时返回真
    nodePrototype.is = function(selector) {
        return nodeMatchesSelector(this, selector);
    };

};