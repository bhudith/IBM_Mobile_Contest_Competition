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

	], function( $, Backbone, Constants, ServiceProxyFactory, PageView, Utils, DataUtils, TemplateUtils, AdapterUtils ) {

	// Extends PagView class
	var MoneyFinalPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param none
		 */
		initialize: function() {
			var self = this;
			PageView.prototype.initialize.call(this);

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
		render: function() {
			PageView.prototype.render.call(this);

			var self = this;

			// set current date
			self.$el.find("#paymentTime").text(Utils.getCurrentDate());

			// retrieve transfer amount
			var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT);
			self.$el.find("#transferAmount .selectedInfo").html(Utils.convertNumberToCurrency(amount));

			// retrieve money account data
			var fromAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_MONEY_ACCOUNT);
    		if (!Utils.isNullOrEmpty(fromAccount)) {
    			var onTemplate = function(html) {
        			self.$el.find("#moneyAccount .selectedInfo").html(html);
        		};
        		var account = JSON.parse(fromAccount);
				var amountNum = account.amount;
				amountNum = Utils.convertCurrencyToNumber(amountNum) - Utils.convertCurrencyToNumber(amount);
				var context = {name: account.name, accountNum: account.accountNum,
						 amount: Utils.convertNumberToCurrency(amountNum)};
				var params = {account: context};
        		TemplateUtils.getTemplate("select_account_info", params, onTemplate);
        	}

			// retrieve money person data
			self.$el.find("#moneyPayee .selectedInfo").html(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME));

			//setup the transfer more button handler
			self.$el.on("click", "#transferMoreBtn", function() {
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_MONEY_ACCOUNT, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT, "");
				$.mobile.changePage("money.html", {transition: "none"});
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
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_MONEY_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT, "");
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
	return MoneyFinalPageView;

});