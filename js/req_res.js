console.clear();
$(document).ready(()=>{
	var refreshButton = document.querySelector('.refresh');
	var	close1Button = document.querySelector('.close1');
	var	close2Button = document.querySelector('.close2');
	var	close3Button = document.querySelector('.close3');

	var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
	var close1Click = Rx.Observable.fromEvent(close1Button, 'click');
	var close2Click = Rx.Observable.fromEvent(close2Button, 'click');
	var close3Click = Rx.Observable.fromEvent(close3Button, 'click');
	console.log(close3Click);


	var startupRequestStream = Rx.Observable.just("http://api.github.com/users");

	var requestOnRefreshStream = refreshClickStream.map(event => {
		var randomOffSets = Math.floor(Math.random()*500);
		return "http://api.github.com/users?since="+randomOffSets;
	})

	var responseStream = Rx.Observable.merge(startupRequestStream, requestOnRefreshStream)
		.flatMap(requestUrl => {
			console.log("request is send")
			return Rx.Observable.fromPromise($.getJSON(requestUrl))
		}
	).shareReplay(1);


	function getRandomUser(userUrl){
		return userUrl[Math.floor(Math.random()*userUrl.length)];
	}

	function createSuggestionStream(stream, closeClickStream) {
		return stream.map(listUser => 
				listUser[Math.floor(Math.random()*listUser.length)]
			).startWith(null)
			.merge(refreshClickStream.map(event => null))
			.merge(closeClickStream.withLatestFrom(stream, 
				function(event, listUsers){
					console.log(listUsers);
					return getRandomUser(listUsers);
				} 
				)
			);
	}

	var suggestion1Stream = createSuggestionStream(responseStream, close1Click);
	var suggestion2Stream = createSuggestionStream(responseStream, close2Click);
	var suggestion3Stream = createSuggestionStream(responseStream, close3Click);

	suggestion1Stream.subscribe(user => {
		renderSuggestion(user, '.suggestion1');
	});
	suggestion2Stream.subscribe(user => {
		renderSuggestion(user, '.suggestion2');
	});
	suggestion3Stream.subscribe(user => {
		renderSuggestion(user, '.suggestion3');
	});
});

function renderSuggestion(userData, selector){
	// console.log(userData);
	var element = document.querySelector(selector);
	if(userData === null){
		element.style.visibility = 'hidden';
	}else{
		element.style.visibility = 'visible';

		var usernameElement = element.querySelector('.username');
		var imageElement = element.querySelector('img');

		usernameElement.href = userData.html_url;
		usernameElement.textContent = userData.login;
		imageElement.src = userData.avatar_url; 
	}
}