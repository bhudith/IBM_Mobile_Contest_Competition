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
	var TransfersFinalPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param none
		 */
		initialize: function() {
			var self = this;
			PageView.prototype.initialize.call(this);

			//initialize components so it would be ready for the page
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
			self.$el.find("#transferTime").text(Utils.getCurrentDate());

			var offset = DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT);
			// retrieve transfer from account data
				
		   		var fromAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_FROM_ACCOUNT);
	    		if (!Utils.isNullOrEmpty(fromAccount)) {
	    			var onTemplate = function(html) {
	        			self.$el.find("#transferFrom .selectedInfo").html(html);
	        		};
	        		var account = JSON.parse(fromAccount);
					var amountNum = account.amount;
					amountNum = Utils.convertCurrencyToNumber(amountNum) - Utils.convertCurrencyToNumber(offset);
					var context = {name: account.name, accountNum: account.accountNum,
							 amount: Utils.convertNumberToCurrency(amountNum)};
					var params = {account: context};
	        		TemplateUtils.getTemplate("select_account_info", params, onTemplate);
	        	}
	        	
	        	// retrieve transfer to account data
	    		var toAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_TO_ACCOUNT);
	    		if (!Utils.isNullOrEmpty(toAccount)) {
	    			var onTemplate = function(html) {
	        			self.$el.find("#transferTo .selectedInfo").html(html);
	        		};
	        		var account = JSON.parse(toAccount);
					var amountNum = account.amount;
					amountNum = Utils.convertCurrencyToNumber(amountNum) + Utils.convertCurrencyToNumber(offset);
					var context = {name: account.name, accountNum: account.accountNum,
							 amount: Utils.convertNumberToCurrency(amountNum)};
					var params = {account: context};
	        		TemplateUtils.getTemplate("select_account_info", params, onTemplate);
	        	}

			// retrieve transfer amount
			var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT);
			self.$el.find("#transferAmount .selectedInfo").html(Utils.convertNumberToCurrency(amount));


			//setup the transfer more button handler
			self.$el.on("click", "#transferMoreBtn", function() {
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_FROM_ACCOUNT, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_TO_ACCOUNT, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT, "");
				$.mobile.changePage("transfers.html", {transition: "none"});
			});
			
			//setup the transfer recurrence button handler
			self.$el.on("click", "#transferRecurBtn", function() {
				self._showUnsupportedMessage();
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
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_FROM_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_TO_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT, "");
			$.mobile.changePage("home.html", {transition: "none"});
		},

		/**
		 * alert unsupported message when the function is not provided.
		 * @param none
		 */
		_showUnsupportedMessage: function() {
			var message = Utils.getTranslation("%common.feature.unavailable%");
			Utils.showAlert(message, null);
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
	return TransfersFinalPageView;

});