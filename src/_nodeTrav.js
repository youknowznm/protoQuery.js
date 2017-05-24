export default function handleNodeTrav(nodePrototype) {

    ///////////////  选择和遍历  ///////////////

    // 在当前元素的第一个子元素前插入目标元素
    // @return {node} 插入的新元素节点
    nodePrototype.prepend = function(tarNode) {
        if (tarNode.nodeType !== 1) {
            throw new Error('Expected ELEMENT NODE as target node.')
        }
        this.insertBefore(tarNode, this.firstElementChild);
        return tarNode;
    };

    // @param {node} newNode 新元素节点
    // @param {node} referenceNode 比照元素节点
    // @return {node} 插入的新元素节点
    nodePrototype.insertAfter = function(newNode, referenceNode) {
        if (newNode.nodeType !== 1) {
            throw new Error('Expected ELEMENT NODE as target node.')
        }
        if (referenceNode.nodeType !== 1) {
            throw new Error('Expected ELEMENT NODE as reference node.')
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
    nodePrototype.parent = function() {
        let tarElement = this.parentNode;
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
    nodePrototype.parents = function(selector) {
        let result = [];
        let currentNode = this.parent();
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
        let result = [];
        let currentNode = this.parent();
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
        let currentNode = this;
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
    nodePrototype.children = function(selector) {
        let result = [];
        for (var child of this.childNodes) {
            if (child.nodeType === 1 && nodeMatchesSelector(child, selector)) {
                result.push(child);
            }
        }
        return result;
    };

    // 返回目标元素之前的符合参数条件的最近的兄弟元素
    // @return {node} 元素节点或null
    nodePrototype.prev = function(selector) {
        let prevSib = this.previousElementSibling;
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
        let nextSib = this.nextElementSibling;
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
        let result = [];
        let prevSib = this.previousElementSibling;
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
        let result = [];
        let nextSib = this.nextElementSibling;
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
        let result = [];
        let prevSib = this.previousElementSibling;
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
        let result = [];
        let nextSib = this.nextElementSibling;
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