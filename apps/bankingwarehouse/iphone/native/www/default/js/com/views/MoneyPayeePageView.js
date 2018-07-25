
/* JavaScript content from js/com/views/MoneyPayeePageView.js in folder common */
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
		"com/utils/DataUtils",
		"com/utils/TemplateUtils",
		"com/utils/Utils",
		"com/models/ServiceProxyFactory",
		"com/utils/PaymentUtils",

	], function( $, Backbone, Constants, PageView, DataUtils, TemplateUtils, Utils, ServiceProxyFactory, PaymentUtils ) {

	// Extends PagView class
	var MoneyPayeePageView = PageView.extend({

		_onSelectToPage: "", //url to redirect the user after a payee is selected, default is to go back

		/**
		 * The View Constructor
		 * @param el, DOM element of the page
		 */
		initialize: function(options)
		{
			var self = this;
			
			this._onSelectToPage = options && options.data && options.data.onSelectToPage ? options.data.onSelectToPage : "";

			PageView.prototype.initialize.call(this, options);

			this.$el.on("pageshow", function(){
				self.render();
			});
			
			//press back key to go home page
			$(document).on("backbutton", function(){
				if(self._onSelectToPage) {
					$.mobile.changePage(self._onSelectToPage,{transition: "none"});
				} else {
					history.back();
				}
			});
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function()
		{
			PageView.prototype.render.call(this);

			var self = this;
			var onResponse = function(payees)
			{
				$.mobile.loading("hide");
				var onTemplate = function(html) {
					self.$el.find("#payeesList").html(html).listview("refresh");
				};

				var items = [];
				payees.each(function(payee) {
					var context = {payeeId: payee.get("payeeId"), payeeName: payee.get("payeeName"), lastpaid: payee.get("lastPaid")};
					items.push(context);
				});

				var params = {payees: items};
				TemplateUtils.getTemplate("money_payee_list_row", params, onTemplate);
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};

			$.mobile.loading("show");

			//DataUtils.getUserMoneyPayees(onData);
			var userId = DataUtils.getLocalStorageData(Constants.LS_KEY_USERID);
			PaymentUtils.getPayeesByType({type:Constants.MONEY_PAYEE_TYPE,userId:userId}, onResponse,onError);

			//payee row tap handler
			this.$el.on("click", "#payeesList .payee", function(){
				var name = $(this).attr("data-name");

				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME, name);

				if(self._onSelectToPage) {
					$.mobile.changePage(self._onSelectToPage,{transition: "slide"});
				} else {
					history.back();
				}
				
				return false;
			});


			//setup the addContact button handler
			self.$el.on("click", "#addContactBtn", function(){
				  $.mobile.changePage("money_new_payee.html", {data:{onSelectToPage:self._onSelectToPage},transition: "none",role:"dialog"});
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
	return MoneyPayeePageView;
});