const {div, input, label, h2, makeDOMDriver} = CycleDOM;
const isolate = CycleIsolate;

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
	const weightProps$ = Rx.Observable.of({
		label: 'Weight',
		unit: 'kg',
		min: 40,
		max: 150,
		init: 70
	})

	const heightProps$ = Rx.Observable.of({
		label: 'Height',
		unit: 'cm',
		min: 140,
		max: 220,
		init: 170
	})
	var weightSinks = labeledSlider({ DOM: sources.DOM.select('.weight'), props: weightProps$});

	const  weightVTree = weightSinks.DOM.map(vtree => {
			vtree.properties.className = 'weight';
			return vtree;
		}
	)

	var heightSinks = labeledSlider({ DOM: sources.DOM.select('.height'), props: heightProps$});

	const  heightVTree = heightSinks.DOM.map(vtree => {
			vtree.properties.className = 'height';
			return vtree;
		}
	)

	const vtree$ = Rx.Observable.combineLatest(
		weightVTree, heightVTree, (weightVTree, heightVtee) =>
			div([
				weightVTree,
				heightVtee
			])
		);
	return { DOM: vtree$};
}


const drivers = {
	DOM: makeDOMDriver('#app'),
}

Cycle.run(main, drivers);