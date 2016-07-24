// A humble copycat of jQuery.

var $ = (function() {

  function selectElem(selector, root) {
    if (typeof selector !== 'string') {
      throw new TypeError('Expected a selector string as param1.');
    }
    if (root !== undefined && (typeof root !== 'object' || root.nodeValue !== 1)) {
      throw new TypeError('Expected an optional element node as param2.');
    }
    var _root = is root undefined ? document.body : root;
    var walker = document.createTreeWalker(_root, NodeFilter.SHOW_ELEMENT, null, false);
    switch (true) {
      case selector.match(/^#(.+)$/):
        var _id = RegExp.$1;
        return _root.getElementByID(_id);
      case selector.match(/^$/)
      default:

    }
  }

})();
