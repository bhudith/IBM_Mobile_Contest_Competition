
/* JavaScript content from js/com/views/TransfersConfirmPageView.js in folder common */
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
	var TransfersConfirmPageView = PageView.extend({

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
		},

		/**
		 * Renders UI for page
		 * @param
		 */
		render: function() {
			PageView.prototype.render.call(this);

			var self = this;

	   		var fromAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_FROM_ACCOUNT);
    		if (!Utils.isNullOrEmpty(fromAccount)) {
    			var onTemplate = function(html) {
        			self.$el.find("#transferFrom .selectedInfo").html(html);
        		};
        		fromAccount = JSON.parse(fromAccount);
        		var params = {account: fromAccount};
        		TemplateUtils.getTemplate("select_account_info", params, onTemplate);
        	}
        	
        	// retrieve transfer to account data
    		var toAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_TO_ACCOUNT);
    		if (!Utils.isNullOrEmpty(toAccount)) {
    			var onTemplate = function(html) {
        			self.$el.find("#transferTo .selectedInfo").html(html);
        		};
        		toAccount = JSON.parse(toAccount);
        		var params = {account: toAccount};
        		TemplateUtils.getTemplate("select_account_info", params, onTemplate);
        	}

        	// retrieve transfer amount
        	if(DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT)){
        		var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT);
        		self.$el.find("#transferAmount .selectedInfo").html(Utils.convertNumberToCurrency(amount));
        		self.validateTransfer();
        	}
        	
        	var amountInputId = "#transferAmount .selectedInfo";
        	this.$el.on("click", amountInputId, function(){
        		self.$el.find("#transferAmount .selectedInfo").hide();
        		var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT);
        		self.$el.find("#transferAmount #confirmAmount").val(amount);
        		self.$el.find("#transferAmount #edit").show();    
        		self.$el.find("#transferAmount #confirmAmount").select();
        	});
        	
        	this.$el.on("blur", "#transferAmount #confirmAmount", function(){
        		var value = $(this).val();
        		DataUtils.setLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT, value);
        		self.validateTransfer();
        		return true;
        	});
			
			//setup the confirm button handler
			self.$el.on("click", "#confirmBtn", function() {
				// validate transfer accounts and amount
				var isValid = self.validateTransfer();
				
				if (isValid) {
					//validate 	fromAccount.amount > transfer amount			
					if(fromAccount.category!=0){
						if(DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT) > Utils.convertCurrencyToNumber(fromAccount.amount)){
						  Utils.showAlert("Insufficient account balance", null, null, null);
						}else{
							var onResponse = function(){
								$.mobile.changePage("transfers_final.html", { transition: "none"});
							};
							var onError = function(errorCode, statusMessage){
								Utils.showAlert(statusMessage);
							};
							ServiceProxyFactory.getServiceProxy().transferFunds({accountId:fromAccount.accountId, relatedAccountId:toAccount.accountId, type:Constants.TRANSFER_TRANS_TYPE, amount:amount}, onResponse,onError);
						}
					}else{
						var onResponse = function(){
							$.mobile.changePage("transfers_final.html", { transition: "none"});
						};
						var onError = function(errorCode, statusMessage){
							Utils.showAlert(statusMessage);
						};
	
						ServiceProxyFactory.getServiceProxy().transferFunds({accountId:fromAccount.accountId, relatedAccountId:toAccount.accountId, type:Constants.TRANSFER_TRANS_TYPE, amount:amount}, onResponse,onError);
					}
				}
			});

			//setup the cancel button handler
			self.$el.on("click", "#cancelBtn", function() {
				self._cancel();
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

        /**
         * Validate the input. Enable the button if valid.
         * @param none
         */
        validateTransfer : function() {
        	var self = this;
        	
        	var isValid = false;
        	var confirmButton = self.$el.find("#confirmBtn");
    		if(!Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_FROM_ACCOUNT)) 
    				&& !Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_TO_ACCOUNT)) 
    				&& DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT) > 0) {
        		$(confirmButton).button("enable");
        		isValid = true;
        	} else {
        		$(confirmButton).button("disable");
        	}
        	return isValid;
        },
        
        
		/**
		 * cancel the transfer
		 *
		 * @param none
		 */
		_cancel: function() {
			var question = Utils.getTranslation("%transfers.cancel.question%");
			var onYes = function() {
				$.mobile.changePage("transfers.html", {transition: "none"});
			};
			Utils.showConfirmationAlert(question, onYes);
		},
	});

	// Returns the View class
	return TransfersConfirmPageView;

});