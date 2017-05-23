/*
 * protoQuery lib
 * https://github.com/youknowznm/zQuery
 *
 * 2017-05-18
 */

 import handleBasic from './_basic';
 import handleNodeAttr from './_nodeAttr';
 import handleNodeTrav from './_nodeTrav';
 import handleNodeEvents from './_nodeEvents';
 import handleFx from './_fx';
 import handleStringProto from './_string';
 import addUtil from './_util';

// 在文档结束渲染、开始加载内嵌资源时初始化
document.onreadystatechange = function() {
    if (document.readyState === 'interactive') {
        initProtoQuery(window);
    }
};

let initProtoQuery = function(wd) {

    handleBasic(wd);
    handleNodeAttr(wd.Node.prototype);
    handleNodeTrav(wd.Node.prototype);
    handleNodeEvents(wd.Node.prototype);
    handleFx(wd.Node.prototype);
    handleStringProto(wd.String.prototype);
    addUtil(wd);

    let extendNodeFuncToArray = function(funcName) {
        Array.prototype[funcName] = function(...args) {
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

}

