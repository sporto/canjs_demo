(function () {

	'use strict';

	var Library = can.Model({
		findAll: "GET /libraries",
		create: 'POST /libraries',
		destroy: 'DELETE /libraries/{id}'
	}, {});

	var Control = can.Control({

		init: function (ele, options) {
			var self = this;

			// state observable
			this.state = new can.Observe({
				selected: new Library(),
				isEditing: function () {
					return this.attr('selected.id') != null;
				}
			});

			// create an empty list to be populated later
			this.libraries = new Library.List([]);

			// compile the template
			var template = can.view("#template", {libraries: this.libraries, state: this.state});
			
			// append the view to the DOM
			can.$(ele).append(template);

			// store a ref to the input field
			this.$input = $('.input_name', ele);

			// load the libraries from the server
			var pro = Library.findAll({}, function(libraries) {
				self.libraries.push.apply(self.libraries, libraries);
			});

			this.state.bind('selected', function (oldVal, newVal) {
				self.$input.val(newVal.attr('name'));
			});
		},

		resetSelected: function () {
			this.state.attr('selected', new Library());
		},

		'.btn_edit click': function (ele, ev) {
			var library = can.data(ele, 'library');
			this.state.attr('selected', library);			
		},

		'.btn_save click': function (ele, ev) {
			var self = this;
			var val = this.$input.val();
			var model = this.state.attr('selected');
			model.attr('name', val);
			model.save(function (library) {
				self.libraries.push(library);
				self.$input.val('');
				self.resetSelected();
			});
		},

		'.btn_remove click': function (ele, ev) {
			// get the model from the clicked element and destroy it
			var library = can.data(ele, 'library');
			library.destroy();
			this.resetSelected();
			return false;
		},

		'.btn_cancel_edit click': function (ele, ev) {
			this.resetSelected();
		}

	});


	var control = new Control('#main');


}());