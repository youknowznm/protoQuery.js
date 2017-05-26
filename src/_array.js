export default function handleArray(arrayPrototype) {

    /**
    在数组原型上添加一个方法：当实例的第一个元素为节点对象时，在该节点上调用对应的节点原型方法
    @param {string} funcName 已在Node原型上添加的方法名
    */
    let extendNodeFuncToArray = function(funcName) {
        arrayPrototype[funcName] = function(...args) {
            let firstItem = this[0];
            if (firstItem instanceof Node) {
                return window.Node.prototype[funcName].apply(firstItem, args);
            } else {
                throw Error('Expected NODE as first item in array.')
            }
        };
    };

    [
        'css', 'transform', 'position', 'offset',
        'attr', 'html', 'text',
        'protoQuery', 'is',
        'prepend', 'insertAfter', 'parent', 'parents',
        'parentsUntil', 'closest', 'children',
        'prev', 'next', 'prevAll', 'nextAll', 'siblings', 'prevUntil', 'nextUntil',
        'on', 'off',
        'width', 'height', 'innerWidth', 'initHeight', 'outerWidth', 'outerHeight',
        'show', 'hide', 'fadeIn', 'fadeOut', 'slideDown', 'slideUp'
    ].forEach(function(i) {
        extendNodeFuncToArray(i);
    });

    /**
    为数组每一项执行一个方法，传入改项为this
    @param {function} fn 要执行的方法
    */
    arrayPrototype.each = function(fn) {
        for (let item of this) {
            fn.call(item);
        };
    };

};