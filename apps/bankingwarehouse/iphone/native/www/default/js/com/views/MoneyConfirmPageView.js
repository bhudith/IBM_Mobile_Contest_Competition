
/* JavaScript content from js/com/views/MoneyConfirmPageView.js in folder common */
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

	], function( $, Backbone, Constants, ServiceProxyFactory, PageView, Utils, DataUtils, TemplateUtils ) {

	// Extends PagView class
	var MoneyConfirmPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(){
			var self = this;
			PageView.prototype.initialize.call(this);

			self.$el.on("pagebeforeshow", function(){
				self.render();
			});
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function(model) {
			PageView.prototype.render.call(this);

			var self = this;
			
        	// retrieve money account data
        	var fromAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_MONEY_ACCOUNT);
    		if (!Utils.isNullOrEmpty(fromAccount)) {
        		var onTemplate = function(html) {
        			self.$el.find("#moneyAccount .selectedInfo").html(html);
        		};
        		fromAccount = JSON.parse(fromAccount);
        		var params = {account: fromAccount};
        		TemplateUtils.getTemplate("select_account_info", params, onTemplate);
        	}

            if(!Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME))){
        	   self.$el.find("#moneyPayee .selectedInfo").html(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME));
            }
        	
        	// retrieve  amount
        	if(DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT)){
        		var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT);
    			self.$el.find("#transferAmount .selectedInfo").html(Utils.convertNumberToCurrency(amount));
        		self.validateTransfer();
        	}
        	
        	var amountInputId = "#transferAmount .selectedInfo";
        	
        	this.$el.on("click", amountInputId, function(){
        		self.$el.find("#transferAmount .selectedInfo").hide();
        		var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT);
        		self.$el.find("#transferAmount #confirmAmount").val(amount);
        		self.$el.find("#transferAmount #edit").show();     
        		self.$el.find("#transferAmount #confirmAmount").select();
        	});
        	
        	this.$el.on("blur", "#transferAmount #confirmAmount", function(){
        		var value = $(this).val();
        		DataUtils.setLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT, value);
        		self.validateTransfer();
        		return true;
        	});
        	
			//setup the transfer button handler
			self.$el.on("click", "#confirmBtn", function() {
				// validate transfer accounts and amount
				var isValid = self.validateTransfer();
				
				if (isValid) {
					//validate 	fromAccount.amount > money amount			
					if(fromAccount.category!=0){
						if(DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT) > Utils.convertCurrencyToNumber(fromAccount.amount)){
						  Utils.showAlert("Insufficient account balance", null, null, null);
						}else{
							var onResponse = function(){
							$.mobile.changePage("money_final.html", {transition: "none"});
							};
							var onError = function(errorCode, statusMessage){
								Utils.showAlert(statusMessage);
							};
							ServiceProxyFactory.getServiceProxy().sendMoney({accountId:fromAccount.accountId, relatedAccountId:DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME), type:Constants.MONEY_TRANS_TYPE, amount:DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT)}, onResponse,onError);
						}
					}else{
						var onResponse = function(){
							$.mobile.changePage("money_final.html", {transition: "none"});
						};
						var onError = function(errorCode, statusMessage){
							Utils.showAlert(statusMessage);
						};
						ServiceProxyFactory.getServiceProxy().sendMoney({accountId:fromAccount.accountId, relatedAccountId:DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME),type:Constants.MONEY_TRANS_TYPE, amount:DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT)}, onResponse,onError);
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
         * Validate the input. Enable the button if valid.
         * @param none
         */
        validateTransfer : function() {
        	var self = this;
        	
        	var isValid = false;
        	var confirmButton = self.$el.find("#confirmBtn");

        	if(!Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_MONEY_ACCOUNT)) 
        			&& !Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME))
        			&& DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT) > 0) 
        	{
        		$(confirmButton).button("enable");
        		isValid = true;
        	} else {
        		$(confirmButton).button("disable");
        	}
        	return isValid;
        },
        
		 /**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},

		/**
		 * cancel the transaction
		 *
		 * @param none
		 */
		_cancel: function() {
			var question = Utils.getTranslation("%money.cancel.question%");
			var onYes = function() {
				$.mobile.changePage("money.html", {transition: "none"});
			};
			Utils.showConfirmationAlert(question, onYes);
		},

	});

	// Returns the View class
	return MoneyConfirmPageView;

});