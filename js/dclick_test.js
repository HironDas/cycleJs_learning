$(document).ready(function(){

	var button = document.querySelector('.button');
	var label = document.querySelector('h4');

	var clickStream = Rx.Observable.fromEvent(button, 'click');

	var doubleClickStream = clickStream.buffer(clickStream.throttle(250))
						.map(arr=>arr.length)
						.filter(len => len==2);

						//doubleClickStream.forEach((len)=> {console.log(len)});

	doubleClickStream.subscribe(event => {
		label.innerHTML = "Double Click";
		// console.log('Double Click'+event);
	});


	doubleClickStream.throttle(1000)
		.subscribe(suggestion => {
			label.textContent = "-";
		}); 
})