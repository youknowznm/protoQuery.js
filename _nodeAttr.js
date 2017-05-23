export default function handleNodeAttr(nodePrototype) {

    ///////////////  样式和属性  ///////////////

    const NUMBER_TYPE_STYLE = ['opacity'];
    const FLOAT_TYPE_STYLE = ['opacity'];

    // 修改元素的单一样式
    let changeSingleRule = function(ele, name, value) {
        if (/^.*\d$/.test(value) && NUMBER_TYPE_STYLE.indexOf(name) === -1) {
            value += 'px';
        }
        ele.style[name] = value;
    };

    // 设置或读取目标元素的样式
    // @param {string|object} arg1 只提供此参数：为数值时返回该样式值；为对象时设置元素的多条规则
    // @param {string|number?} arg2 提供时设置指定样式的值
    // @return {node|string|null} 读取时返回字符串或null；设置时返回自身
    nodePrototype.css = function(arg1, arg2) {
        switch (arguments.length) {
            case 1:
                switch (typeof arg1) {
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
                switch (typeof arg2) {
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
    nodePrototype.position = function() {
        let top = this.offsetTop,
            left = this.offsetLeft;
        return {top, left};
    };

    // 返回元素相对于浏览器窗口之坐标
    nodePrototype.offset = function() {
        let top = this.offsetTop;
        let left = this.offsetLeft;
        let posParent = this.offsetParent;
        while (posParent !== null) {
            top += posParent.offsetTop;
            left += posParent.offsetLeft;
            posParent = posParent.offsetParent;
        }
        return {top, left};
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
                throw new Error(
                    'Expected STRING as target attribute value (if provided).');
            } else {
                this.setAttribute(tarAttr, tarValue);
                return this;
            }
        }
    };

    // 获取或设置目标的innerHTML
    nodePrototype.html = function(tarHTML) {
        if (tarHTML === undefined) {
            return this.innerHTML;
        }
        this.innerHTML = tarHTML;
        return this;
    };

    // 获取或设置目标的文字内容
    nodePrototype.text = function(tarText) {
        if (tarHTML === undefined) {
            return this.textContent;
        }
        this.textContent = tarText;
        return this;
    };

    // 读写元素自身的宽/高
    nodePrototype.width = function(value) {
        return value === undefined ? parseInt(this.css('width')) : this.css('width', value);
    };
    nodePrototype.height = function(value) {
        return value === undefined ? parseInt(this.css('height')) : this.css('height', value);
    };
    // 获取元素的自身宽/高 + 内边距
    nodePrototype.innerWidth = function() {
        return this.width()
            + parseInt(this.css('paddingLeft'))
            + parseInt(this.css('paddingRight'));
    };
    nodePrototype.innerHeight = function() {
        return this.height()
            + parseInt(this.css('paddingTop'))
            + parseInt(this.css('paddingBottom'));
    };
    // 获取元素的自身宽/高 + 内边距 + 边框，参数为真时包括外边距
    nodePrototype.outerWidth = function(includeMargin) {
        let r = this.innerWidth()
            + parseInt(this.css('borderLeftWidth'))
            + parseInt(this.css('borderRightWidth'));
        if (includeMargin === true) {
            r += parseInt(this.css('marginLeft')) + parseInt(this.css('marginRight'));
        }
        return r;
    };
    nodePrototype.outerHeight = function(includeMargin) {
        let r = this.innerHeight()
            + parseInt(this.css('borderTopWidth'))
            + parseInt(this.css('borderBottomWidth'));
        if (includeMargin === true) {
            r += parseInt(this.css('marginTop')) + parseInt(this.css('marginBottom'));
        }
        return r;
    };

};