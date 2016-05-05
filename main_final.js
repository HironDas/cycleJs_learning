const {h, h1, span, makeDOMDriver } = CycleDOM;

function main(sources){
	const mouseover$ = sources.DOM.select('span')
							.events('mouseover');

	const sinks = {
		DOM: mouseover$.startWith(null)
			.flatMapLatest(()=>{
				return Rx.Observable.timer(0, 1000)
					.map(i =>
						h1([
							span([`Second elapsed ${i}`])
						])
					 )
			}),
		Log: Rx.Observable.timer(0, 2000).map(i=> 2*i)
		};
	return sinks;
}

//source : input (read) effects
//sink : output (write) effects
function consoleLogDriver(msg$){
	msg$.subscribe(msg=> console.log(msg));
}


const drivers = {
	DOM: makeDOMDriver('#app'),
	Log: consoleLogDriver
}

Cycle.run(main, drivers);

