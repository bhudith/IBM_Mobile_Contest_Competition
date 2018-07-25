
/* JavaScript content from js/com/views/MoneyNewPayeePageView.js in folder common */
/***********************************************
 *Licensed Materials - Property of IBM
 *6949 - 59L
 *(C) Copyright IBM Corp. 2013, 2014 All Rights Reserved
 *US Government Users Restricted Rights - Use, duplication or  
 *disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 ***********************************************/

define([

		"jquery",
		"backbone",
		"com/models/Constants",
		"com/views/PageView",
		"com/utils/Utils",
		"com/utils/DataUtils",
		"com/utils/TemplateUtils",

	], function( $, Backbone, Constants, PageView, Utils, DataUtils, TemplateUtils) {

	// Extends PagView class
	var MoneyNewPayeePageView = PageView.extend({

		_onSelectToPage: "", //url to redirect the user after a payee is selected, default is to go back
		
		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			var self = this;

			this._onSelectToPage = options && options.data && options.data.onSelectToPage ? options.data.onSelectToPage : "";

			PageView.prototype.initialize.call(this, options);

			this.$el.on("pageshow", function(){
				self.render();
			});
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function() {
			PageView.prototype.render.call(this);

			var self = this;
			$.mobile.loading("show");

			var contactList = "";

			var options = new ContactFindOptions();
			options.filter = "";
			options.multiple = true;
			var fields = ["displayName", "name"];
			navigator.contacts.find(fields, 	
			    function onSuccess(contacts) {
					if(contacts.length == 0 ){
						 Utils.showAlert(Utils.getTranslation("%money.no.contacts%"), null, null, null);
						 $.mobile.changePage("money_payee.html", {transition: "none"});
				 	}else if(contacts.length < 30) {
				 		for (var i=0; i<contacts.length; i++) {
				 			contactList = contactList + '<li><a href="#" name='+contacts[i].name.formatted+'>'+contacts[i].name.formatted+'</a></li>';
				 		}
				 	}else if(contacts.length >= 30){
				 		for (var i=0; i<30; i++) {
		 					contactList = contactList +  '<li><a href="#" name='+contacts[i].name.formatted+'>'+contacts[i].name.formatted+'</a></li>';
						}
					}
					
					$.mobile.loading("hide");
					self.$el.find("#payeeList").html(contactList).listview("refresh");
				},
				// Failure
				function onError(contacterror) {
					  console.log("error");
				},
				options
			);

			//contactList row tap handler
			this.$el.on("click", "#payeeList li a", function(){
				var name = $(this).attr("name");
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME, name);

				if(self._onSelectToPage) {
					$.mobile.changePage(self._onSelectToPage,{transition: "slide"});
				} else {
					history.back();
				}

				return false;
			});

			//setup the cancel button handler
			self.$el.on("click", "#cancel", function(){
				if(self._onSelectToPage) {
					$.mobile.changePage(self._onSelectToPage,{transition: "none"});
				} else {
					history.back();
				}
			});

			return this; //Maintains chainability
		},

		 /**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},

	});

	// Returns the View class
	return MoneyNewPayeePageView;

});