let body = document.body;
let black = document.body.query('.block')[0];
let main = document.body.query('.container')[0];
black.addClass('fuck')
black.css({'width': 200, 'opacity': '0.5'})
console.log(body.parent())
console.log(main.matchedChildren('.block'))
