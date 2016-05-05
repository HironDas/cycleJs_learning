function h1(children){
	return {
		tagName: 'H1',
		children: children
	}
}

function span(children){
	return {
		tagName: 'SPAN',
		children: children
	}
}

function main(source){
	const mouseover$ = source.DOM.selectEvents('span', 'mouseover');

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

function DOMDriver(obj$){
	
	function createElement(obj){
		const element = document.createElement(obj.tagName);
		//element.innerHTML = obj.children[0];
		obj.children
			.filter(c=> typeof c === 'object')
			.map(createElement)
			.forEach(c => element.appendChild(c));

		obj.children
			.filter(c=> typeof c === 'string')
			.forEach(c=> element.innerHTML += c);
		return element;
	}
	obj$.subscribe(obj => {
		const container = document.querySelector('#app');
		container.innerHTML="";
		const element = createElement(obj);
		container.appendChild(element);
	});
	
	const DOMSource = {
		selectEvents: function(tagName, eventType){
			return Rx.Observable.fromEvent(document, eventType)
				.filter((ev)=>{
					console.log(ev.target.tagName);
					return ev.target.tagName == tagName.toUpperCase()
				} );
		}
	}
	return DOMSource;
}

function consoleLogDriver(msg$){
	msg$.subscribe(msg=> console.log(msg));
}

/*function run(mainFn, drivers){
	const proxySources = {};
	// const DOMSource = drivers.DOM(sink.DOM);
	// DOMSource.subscribe(click => {
	// 	proxyDOMSource.onNext(click); 
	// })
	Object.keys(drivers).forEach(key=> {
		proxySources[key] = new Rx.Subject();
	});

	const sinks = mainFn(proxySources);

	Object.keys(drivers).forEach(key=> {
		const source = drivers[key](sinks[key]);
		console.log(source);
		source.subscribe(x => proxySources[key].onNext(x));
	});
}*/

const drivers = {
	DOM: DOMDriver,
	Log: consoleLogDriver
}

Cycle.run(main, drivers);

