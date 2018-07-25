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
		"com/models/ServiceProxyFactory",
		"com/views/PageView",
		"com/utils/Utils",
		"com/utils/DataUtils",
		"com/utils/TemplateUtils",
		"com/utils/AdapterUtils",
		"com/utils/PaymentUtils",

	], function( $, Backbone, Constants, ServiceProxyFactory, PageView, Utils, DataUtils, TemplateUtils, AdapterUtils,PaymentUtils ) {

	// Extends PagView class
	var BillsFinalPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			var self = this;
			PageView.prototype.initialize.call(this, options);

			self.$el.on("pagebeforeshow", function(){
				self.render();
			});

			//press back key to go home page
			$(document).on("backbutton", function(){
				self.goHome();
			});
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function(model) {
			PageView.prototype.render.call(this);

			var self = this;

			// set current date
			self.$el.find("#paymentTime").text(Utils.getCurrentDate());

			// retrieve transfer amount
			var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT);
			self.$el.find("#transferAmount .selectedInfo").html(Utils.convertNumberToCurrency(amount));

			// retrieve bill account data
			var fromAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_ACCOUNT);
    		if (!Utils.isNullOrEmpty(fromAccount)) {
    			var onTemplate = function(html) {
        			self.$el.find("#billsAccount .selectedInfo").html(html);
        		};
        		var account = JSON.parse(fromAccount);
				var amountNum = account.amount;
				amountNum = Utils.convertCurrencyToNumber(amountNum) - Utils.convertCurrencyToNumber(amount);
				var context = {name: account.name, accountNum: account.accountNum,
						 amount: Utils.convertNumberToCurrency(amountNum)};
				var params = {account: context};
        		TemplateUtils.getTemplate("select_account_info", params, onTemplate);
        	}

			// retrieve bill payee data
			var payeeId = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_PAYEE_ID);
			var onResponse = function(payee) {
				var onTemplate = function(html) {
					self.$el.find("#billsPayee .selectedInfo").html(html);
				};
				var context = {payeeName: payee.get("payeeName"), payeeNum: payee.get("payeeNum"),
						amount: Utils.convertNumberToCurrency(parseFloat(amount))};
				var params = {payee: context};
				TemplateUtils.getTemplate("select_payee_info", params, onTemplate);
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};
		    PaymentUtils.getPayeeByPayeeId(payeeId, onResponse,onError);

			//setup the transfer more button handler
			self.$el.on("click", "#transferMoreBtn", function() {
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_ACCOUNT, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_PAYEE_ID, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT, "");
				$.mobile.changePage("bills.html", {transition: "none"});
			});

			//setup the return home button handler
			self.$el.on("click", "#returnHomeBtn", function() {
				self.goHome();
			});

			return this; //Maintains chainability
		},

		/**
		 * clean storage data and return home page
		 * @param none
		 */
		goHome: function() {
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_PAYEE_ID, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT, "");
			$.mobile.changePage("home.html", {transition: "none"});
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
	return BillsFinalPageView;

});