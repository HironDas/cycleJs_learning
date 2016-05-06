const {div, input, label, h2, makeDOMDriver} = CycleDOM;


function main(sources) {
	const changeWeight$ = sources.DOM.select('.weight').events('input')
		.map(ev=> ev.target.value);

	const changeHeight$ = sources.DOM.select('.height').events('input')
		.map(ev=> ev.target.value);
	return {
		DOM: Rx.Observable.of(
			div([
				div([
					label('Weright: 00kg'),
					input('.weight', {type: 'range', min: 40, max:150, value:70})
				]),
				div([
					label('Height: 00kg'),
					input('.height', {type: 'range', min:140, max:220, value: 170})
				]),
				h2('BMI is 000')
			])
		)
	};
}


const drivers = {
	DOM: makeDOMDriver('#app')
}

Cycle.run(main, drivers);