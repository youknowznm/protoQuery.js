export default function handleArray(arrayPrototype) {

    //
    let extendNodeFuncToArray = function(funcName) {
        arrayPrototype[funcName] = function(...args) {
            let firstItem = this[0];
            if (firstItem instanceof Node) {
                return wd.Node.prototype[funcName].apply(firstItem, args);
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

    arrayPrototype.each = function(fn) {
        for (let item of this) {
            fn.call(item);
        };
    };

};