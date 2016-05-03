var requestStream = Rx.Observable.just("http://api.github.com/users");

requestStream.subscribe(requestUrl=>{
	var responseStream = Rx.Observable.fromPromise($.getJSON(requestUrl));

	responseStream.subscribe(response => {
		console.log(response);
	});
});