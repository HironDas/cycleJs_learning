console.clear();

var source = Rx.Observable.create(function(observer){
	var id = setTimeout(function(){
		console.log("timeout hit");
		try {
			throw "my bad error";
			observer.onNext(42);
			observer.onCompleted();
		}catch (error){
			observer.onError(error);
		}
		
	}, 1000);
	console.log('started');
	return function(){
		console.log('disposed called');
		clearTimeout(id);
	}
});

// Rx.Observable.never();

var sub = source.subscribe(function(x){
	console.log('next '+ x)
}, function(err){
	console.error(err);
},function(){
	console.info('done');
});

/*setTimeout(function(){
	sub.dispose();
}, 500);*/

var source = Rx.Observable.interval(500).take(19);

source.filter(x=> x%2 === 1)
	// .map(x => x+ '!')
	.forEach(x => console.log(x+"!"));