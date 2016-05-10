var Rx = require('rx');

const model = function (newValue$, props$){
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

module.exports = model;