//Lets require/import the HTTP module
var http = require('http');
var fs = require ('fs');

//Lets define a port we want to listen to
const PORT=8080; 

//We need a function which handles requests and send response
function handleRequest(request, response){
	fs.readFile('yolk_learning.html', function(err, data){
		if err throw err;
		response.writeHead(200, {'Content-Type': 'text/html', 'Content-length': data.length});
		response.write(data);

    	response.end('It Works!! Path Hit: ' + request.url);
	});
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});