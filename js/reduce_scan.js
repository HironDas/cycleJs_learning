console.clear();

var source = Rx.Observable.interval(100).take(10);

source.scan(function(r, x) {
	return r+x;
}, 0).subscribe((x) => console.log(x));

// console.log(result);
