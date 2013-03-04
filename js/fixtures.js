(function () {
		// mock the server responses
	can.fixture("/libraries", "fixtures/libraries.json");
	can.fixture('POST /libraries', function(original, respondWith, settings){
		respondWith(original);
	});
	can.fixture('DELETE /libraries/{id}', function(){
		return 200;
	});

}());