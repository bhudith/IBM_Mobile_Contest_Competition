
/* JavaScript content from js/com/views/BillsPayeePageView.js in folder common */
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
		"com/models/ServiceProxyFactory",
		"com/utils/PaymentUtils",

	], function( $, Backbone, Constants, PageView, DataUtils, TemplateUtils, ServiceProxyFactory, PaymentUtils ) {

	// Extends PagView class
	var BillsPayeePageView = PageView.extend({

		_onSelectToPage: "", //url to redirect the user after a payee is selected, default is to go back

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			var self = this;
			this._onSelectToPage = options && options.data && options.data.onSelectToPage ? options.data.onSelectToPage : "";
			PageView.prototype.initialize.call(this, options);

			//initialize components so it would be ready for the page
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
			var onResponse = function(payees) {
				$.mobile.loading("hide");
				var onTemplate = function(html) {
					self.$el.find("#payeesList").html(html).listview("refresh");
				};

				var items = [];
				payees.each(function(payee) {
					console.log("payeeId="+payee.get("payeeId")+"   "+"payeeNum="+payee.get("payeeNum")+" "+"name="+payee.get("payeeName"));
					var context = {payeeId: payee.get("payeeId"), payeeNum: payee.get("payeeNum"),
							payeeName: payee.get("payeeName")};
					items.push(context);
				});

				var params = {payees: items};
				TemplateUtils.getTemplate("bills_payee_list_row", params, onTemplate);
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};

			$.mobile.loading("show");
			
			var userId = DataUtils.getLocalStorageData(Constants.LS_KEY_USERID);
			PaymentUtils.getPayeesByType({type: Constants.BILLS_PAYEE_TYPE, userId: userId}, onResponse,onError);

			//payee row tap handler
			this.$el.on("click", "#payeesList .payee", function(){
				var id = $(this).attr("data-id");
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_PAYEE_ID, id);

				if(self._onSelectToPage) {
					$.mobile.changePage(self._onSelectToPage);
				} else {
					history.back();
				}
				return false;
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
	return BillsPayeePageView;
});