$(document).ready(function(){
	var btn = document.querySelector("#clickMe");
	// console.log(btn);

	var clicks = Rx.Observable.fromEvent(btn, 'click'); 

	clicks.scan((s) => s+1, 0)
		.forEach(x => sendValues(x) );

});

function sendValues(arr){
		var pre = document.createElement('pre');
		pre.innerHTML = JSON.stringify(arr);

		document.querySelector("#results")
			.appendChild(pre);
	}