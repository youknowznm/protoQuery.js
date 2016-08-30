
function showColor(){
  alert(this.css('background-color'));
}
function showTar(e){
  console.log(e.target);
}

// var t = query('#black')[0].on('click mouseover', '#black', showTar);
var t = query('#black')[0]
// tg(t, 'opacity', 0.1)

t.css('opacity', 0.1)
