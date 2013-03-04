(function () {
		// mock the server responses
	can.fixture("/libraries", "fixtures/libraries.json");
	// create 
	can.fixture('POST /libraries', function(original, respondWith, settings){
		if (original.id == null) original.id = 17227;
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