/*
 * protoQuery lib
 * https://github.com/youknowznm/zQuery
 *
 * @youknowznm
 * 2017-05-18
 */

 import handleBasic from './_basic';
 import handleNodeAttr from './_nodeAttr';
 import handleNodeTrav from './_nodeTrav';
 import handleNodeEvents from './_nodeEvents';
 import handleArray from './_array';
 import handleString from './_string';
 import handleFx from './_fx';
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
    handleArray(wd.Array.prototype);
    handleString(wd.String.prototype);
    addUtil(wd);

};
