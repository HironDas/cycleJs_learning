$(document).ready(function(){
	var btn = document.querySelector("#clickMe");
	// console.log(btn);

	var clicks = Rx.Observable.fromEvent(btn, 'click'); 
	// var open = Rx.Observable.interval(1000);
	clicks.scan((s) => s+1, 0)
		.buffer(clicks.throttle(1000))
		.forEach(x => sendValues(x) );

});

function sendValues(arr){
		var pre = document.createElement('pre');
		pre.innerHTML = JSON.stringify(arr);

		document.querySelector("#results")
			.appendChild(pre);
	}