function main(){
	return {
		DOM: Rx.Observable.timer(0, 100)
			.map(i => 'Second elapsed ${i}'),
		Log: Rx.Observable.timer(0, 2000)
				.map(i=> 2*i)
		};
}

function DOMDriver(text$){
	text$.subscribe(text => {
		const container = document.querySelector('#app');
		container.textContent = text;
	});
}

function consoleLogDriver(msg$){
	msg$.subscribe(msg=> console.log(msg));
}

function run(mainFn, effects){
	const sink = mainFn();
	Object.keys(effects).forEach(key=> {
		effects[key](sink[key]);
	});
	//DOMEffect(sink.DOM);
	//consoleLogEffect(sink.Log);
}

const drivers = {
	DOM: DOMDriver,
	Log: consoleLogDriver
}

run(main, drivers);

