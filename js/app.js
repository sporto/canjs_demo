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

			// listen for when the selected model is changed
			// reset the inputs
			this.state.bind('selected', function (oldVal, newVal) {
				self.$input.val(newVal.attr('name'));
			});

		},


		resetSelected: function () {
			can.route.attr({id: '', action: ''})
		},


		'route': function() {
			// matches empty hash, #, or #!
			this.state.attr('selected', new Library());
		},


		':type/:id/:action route': function(data) {
			// matches routes like #!libraries/5/edit
			var id = data.id;
			this.edit(id);
		},

		// ui events

		'.btn_edit click': function (ele, ev) {
			// get the clicked model from the DOM
			var library = ele.data('library');

			// set the route
			can.route.attr({type: 'libraries', id: library.attr('id'), action: 'edit'});

			return false;
		},


		edit: function (id) {
			var library = null;

			for (var a=0; a < this.libraries.length; a++) {
				if (this.libraries[a].id === id) {
					library = this.libraries[a];
					break;
				}
			}

			if (library) {
				// flag the model as dirty
				library.backup();

				// set this as the currently selected model
				this.state.attr('selected', library);
			}
		},


		'.btn_save click': function (ele, ev) {
			var self = this;
			var val = this.$input.val();
			// get the currently selected model
			var model = this.state.attr('selected');
			// store if it is new
			var isNew = model.isNew();
			// update the attributes
			model.attr('name', val);
			// save it
			model.save(function (library) {
				if (isNew) {
					// if new then append it to the list
					self.libraries.push(library);
				}

				self.resetSelected();
			});
			return false;
		},


		'.btn_remove click': function (ele, ev) {
			// get the model from the clicked element and destroy it
			var library = can.data(ele, 'library');
			library.destroy();
			this.resetSelected();
			return false;
		},


		'.btn_cancel_edit click': function (ele, ev) {
			this.state.attr('selected').restore();
			this.resetSelected();
			return false;
		},


		'.input_name keyup': function (ele, ev) {
			var val = ele.val();
			this.state.attr('selected.name', val);
		}

	});

	// setup the router pattern
	can.route(':type/:id/:action', {type: 'libraries'});

	var control = new Control('#main');


}());