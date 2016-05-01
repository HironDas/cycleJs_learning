Rx.Observable.timer(0, 100)
	.map(i => 'Second elapsed ${i}'+i)
	.subscribe(text => {
		const container = document.querySelector('#app');
		container.textContent = text;
	});