const {button, div, label, p, makeDOMDriver} = CycleDOM;

function main(sources){
	var increment$ = sources.DOM.select('.increment').events('click');
	var decriment$ = sources.DOM.select('.decriment').events('click');

	const decrimentAction$ = decriment$.map(ev=> -1);
	const incrementAction$ = increment$.map(ev=> +1);

	const number$ = Rx.Observable.of(0)
	.merge(decrimentAction$).merge(incrementAction$)
	.scan((previous, current) => previous+current);
	
	return {
		DOM: number$.map(number =>
			div([
				button('.decriment', 'Decrement'),
				button('.increment', 'increment'),
				p([
					label(String(number))
				])
			])
		)
	};
}

const drivers = {
	DOM: makeDOMDriver("#app")
}

Cycle.run(main, drivers);