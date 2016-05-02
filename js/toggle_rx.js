$(document).ready(()=>{
	var source = Rx.Observable.interval(100)
			.map(()=> '*');

	var display = document.querySelector('#display');
	var toggle = document.querySelector('#toggle');

	var checked = Rx.Observable.fromEvent(toggle, 'change')
		.map(e => e.target.checked);

	checked.filter( x=> x === true)
		.flatMapLatest(() => source.takeUntil(checked))
		.subscribe((x)=>{
		display.innerHTML += x;
	})
})