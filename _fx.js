export default function handleFx(nodePrototype) {

    // 动效和捷径

    let protoQueryUtil = {
        onGoingAnimations: {},
    };

    // 基本动画（基于样式）
    // @param {node} ele 目标元素
    // @param {string} tarStyle 目标样式名
    // @param {string} tarValue 目标样式值
    // @return {number} cycleId 动画标识id
    let transformSingleRule = function(ele, tarStyle, tarValue) {
        let fullStyleValue = ele.css(tarStyle);
        let currentValue = parseFloat(fullStyleValue);
        if (!isFinite(currentValue)) {
            throw new Error('Expected a number-type style value.');
        }
        if (FLOAT_TYPE_STYLE_NAMES.indexOf(tarStyle) > -1) {
            currentValue *= 10000;
            tarValue *= 10000;
        }
        // #02 开始忽略了负值的情况
        let styleSuffix = fullStyleValue.match(/^[-\d]+(.*)$/)[1] || '';
        let cycleId = setInterval(function() {
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
            if (FLOAT_TYPE_STYLE_NAMES.indexOf(tarStyle) > -1) {
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
    nodePrototype.transform = function(styleObj, callback) {
        if (typeof styleObj !== 'object') {
            throw new Error('Expected PLAIN OBJECT containing style key-value pairs.');
        }
        let animationIdGroup = [];
        for (var i in styleObj) {
            console.log(i);
            console.log(styleObj[i]);
            let id = transformSingleRule(this, i, styleObj[i]);
            animationIdGroup.push(id);
        }
        if (typeof callback === 'function') {
            let callbackId = setInterval(function() {
                for (var j in animationIdGroup) {
                    if (zQueryUtil.onGoingAnimations[animationIdGroup[j]] ===
                        false) {
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
    nodePrototype.show = function(option) {
        if (this.css('display') === 'none') {
            switch (option) {
                case 'transform':
                    let initWidth = parseInt(this.width());
                    let initHeight = parseInt(this.height());
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
    nodePrototype.hide = function(option) {
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
    nodePrototype.fadeIn = function() {
        if (this.css('display') === 'none') {
            this.css({
                opacity: 0,
                display: 'block',
            });
            this.transform({
                opacity: 1
            });
        }
        return this;
    };
    nodePrototype.fadeOut = function() {
        if (this.css('display') !== 'none') {
            this.transform({
                'opacity': 0
            }, function() {
                this.hide();
            });
        }
        return this;
    };
    // 渐变高度以显示/隐藏元素
    nodePrototype.slideDown = function() {
        if (this.css('display') === 'none') {
            let initHeight = this.height();
            this.css({
                height: 0,
                display: 'block',
            });
            this.transform({
                height: initHeight
            });
        }
        return this;
    };
    nodePrototype.slideUp = function() {
        if (this.css('display') !== 'none') {
            let that = this;
            this.transform({
                'height': 0
            }, function() {
                that.hide();
            });
        }
        return this;
    };

};