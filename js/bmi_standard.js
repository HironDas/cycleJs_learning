const Rx = require('rx');
const Cycle = require('@cycle/core');
const isolate = require('@cycle/isolate');
const CycleDOM = require('@cycle/dom');
const model = require('./model.js');

const {div, input, label, h2, makeDOMDriver} = CycleDOM;
// const isolate = CycleIsolate;

function intent(DomSource){
	return DomSource.select('.slider').events('input')
			.map(ev => ev.target.value);
}



function view(state$){

	return state$.map(state =>
		div('.labeled-slider', [
			label('.label', 'Weight: '+state.value+state.unit),
			input('.slider', {type: 'range', min: state.min, max: state.max, value: state.value})
		])
	)

}


function LabeledSlider(sources) {
	const changes$ = intent(sources.DOM);
	const state$ = model(changes$, sources.props);
	return{
		DOM: view(state$),
		value: state$.map(state => state.value)
	}
	
}

function IsolatedLabeledSlidser(sources){
	return isolate(LabeledSlider)(sources);
};

function main(sources){
	const weightProps$ = Rx.Observable.of({
		label: 'Weight',
		unit: 'kg',
		min: 40,
		max: 150,
		init: 70
	});
	const heightProps$ = Rx.Observable.of({
		label: 'Height',
		unit: 'cm',
		min: 140,
		max: 220,
		init: 170
	});

	// const weightSlider = isolate(LabeledSlider);
	var weightSinks = IsolatedLabeledSlidser({ DOM: sources.DOM, props: weightProps$});
	const  weightVTree$ = weightSinks.DOM;
	const weightValue$ = weightSinks.value;


	// const heightSlider = isolate(LabeledSlider);
	var heightSinks = IsolatedLabeledSlidser({ DOM: sources.DOM, props: heightProps$});
	const heightVTree$ = heightSinks.DOM;
	const heightValue$ = heightSinks.value;

	const bmi$ = Rx.Observable.combineLatest(weightValue$, heightValue$, (width, height) => {
		const heightMeters = height * 0.01;
		const bmi = Math.round(width / (heightMeters * heightMeters));
		return bmi;
	})

	const vtree$ = Rx.Observable.combineLatest(
		bmi$, weightVTree$, heightVTree$, (bmi, weightVTree, heightVtee) =>
			div([
				weightVTree,
				heightVtee,
				h2('BMI is '+bmi)
			])
		);
	return { DOM: vtree$};
}


const drivers = {
	DOM: makeDOMDriver('#app'),
}

Cycle.run(main, drivers);