
function showColor(){
  alert(this.css('background-color'));
}
function showTar(e){
  console.log(e.target);
}

// var t = query('#black')[0].on('click mouseover', '#black', showTar);
var t = query('#black')[0];

t.fadeOut()

console.log(window.clone)
