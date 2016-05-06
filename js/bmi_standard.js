const {div, input, label, h2, makeDOMDriver} = CycleDOM;

function intent(DomSource){
	return DomSource.select('.slider').events('input')
			.map(ev => ev.target.value);
}

function model(newValue$, props$){
	const initialValue$ = props$.map(props=> props.init).first();
	const value$ = initialValue$.concat(newValue$);

	return Rx.Observable.combineLatest(value$, props$, (value, props) => {
		return {
			label: props.label,
			max: props.max,
			min: props.min,
			value: value,
			unit: props.unit
		}
	});
}

function view(state$){

	return state$.map(state =>
		div('.labeled-slider', [
			label('.label', 'Weight: '+state.value+state.unit),
			input('.slider', {type: 'range', min: state.min, max: state.max, value: state.value})
		])
	)

}


function labeledSlider(sources) {
	const changes$ = intent(sources.DOM);
	const state$ = model(changes$, sources.props);
	return{
		DOM: view(state$)
	}
	
}

function main(sources){
	const props$ = Rx.Observable.of({
		label: 'weight',
		unit: 'kg',
		min: 40,
		max: 150,
		init: 70
	})
	return labeledSlider({ DOM: sources.DOM, props: props$});
}


const drivers = {
	DOM: makeDOMDriver('#app'),
}

Cycle.run(main, drivers);