(function(window, undefined){

  var zQuery = (function(){
    // zQuery对象就是zQuery.fn.init对象
    // 使用new关键字的话，返回的还是zQuery.fn.init对象，所以直接zQuery()即可
    var zQuery = function(selector, context){
      return new zQuery.fn.init(selector, context, rootzQuery);
    };
    // 添加到zQuery.fn的方法，也被添加到zQuery.prototype，这样new zQuery()写法产生的实例也拥有这些方法
    zQuery.fn = zQuery.prototype = {
      constructor: zQuery,
      init: function(selector, context, rootzQuery){
        // selector可为： dom元素，body，html标签，html字符串，html元素id，选择器表达式，ready后的回调函数
        // 返回伪数组
      }
    };
    // 如上所述，使用zQuery(s, c)方法、不使用new zQuery()时，返回的是zQuery.fn.init对象；
    // 将它的构造函数原型也指向zQuery.fn，这样不管用哪种方法创建的zQuery对象都拥有添加到zQuery.fn的所有方法
    zQuery.fn.init.prototype = zQuery.fn;
    return zQuery;
  });

  window.zQuery = window.$ = zQuery;

})(window);
