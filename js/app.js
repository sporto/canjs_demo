(function () {

	'use strict';

	var Library = can.Model({
		findAll: 	"GET /libraries",
		create: 	'POST /libraries',
		update: 	'PUT /libraries/{id}',
		destroy: 	'DELETE /libraries/{id}'
	}, {});

	var Control = can.Control({

		init: function (ele, options) {
			var self = this;

			// create an empty list to be populated later
			this.libraries = new Library.List([]);

			// compile the template
			var template = can.view("#template", {libraries: this.libraries});
			
			// append the view to the DOM
			can.$(ele).append(template);

			// store a ref to the input field
			this.$input = $('.input_name', ele);

			// load the libraries from the server
			var pro = Library.findAll({}, function(libraries) {
				self.libraries.replace(libraries)
			});

		},

		/*********************
		* UI Bindings
		*********************/

		'.btn_save click': function (ele, ev) {
			var self = this;
			
			var model = new Library({name: this.$input.val()});

			// save it
			model.save(function (library) {
				self.libraries.push(library);
				self.$input.val('');
			});

			return false;
		},


		'.btn_remove click': function (ele, ev) {
			// get the model from the clicked element and destroy it
			var library = can.data(ele, 'library');
			library.destroy();
		}

	});

	var control = new Control('#main');


}());