(function () {
		// mock the server responses
	can.fixture("/libraries", "fixtures/libraries.json");
	// create 
	can.fixture('POST /libraries', function(original, respondWith, settings){
		respondWith(original);
	});
	// update
	can.fixture('PUT /libraries/{id}', function(original, respondWith, settings){
		respondWith(original);
	});
	// destroy
	can.fixture('DELETE /libraries/{id}', function(){
		return 200;
	});

}());