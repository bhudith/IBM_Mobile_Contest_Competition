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
        "com/utils/PaymentUtils",
	], function( $, Backbone, Constants, ServiceProxyFactory, PageView, Utils, DataUtils, TemplateUtils, PaymentUtils ) {

	// Extends PagView class
	var BillsConfirmPageView = PageView.extend({

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
		},

		/**
		 * Renders UI for page
		 * @param page data model
		 */
		render: function() {
			PageView.prototype.render.call(this);

			var self = this;

			// retrieve bill account data
			var fromAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_ACCOUNT);
			var onTemplate = function(html) {
				self.$el.find("#billsAccount .selectedInfo").html(html);
			};
			fromAccount = JSON.parse(fromAccount);
			var params = {account: fromAccount};
			TemplateUtils.getTemplate("select_account_info", params, onTemplate);

			// retrieve bill payee data
			var payeeId = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_PAYEE_ID);
			var onResponse = function(payee)
			{
				var onTemplate = function(html) {
					self.$el.find("#billsPayee .selectedInfo").html(html);
				};

				var context = {payeeName: payee.get("payeeName"), payeeNum: payee.get("payeeNum")};
				var params = {payee: context};
				TemplateUtils.getTemplate("select_payee_info", params, onTemplate);
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};
			//get payee by ID
			PaymentUtils.getPayeeByPayeeId(payeeId, onResponse,onError);

			// retrieve transfer amount
			var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT);
			self.$el.find("#transferAmount .selectedInfo").html(Utils.convertNumberToCurrency(amount));

			var amountInputId = "#transferAmount .selectedInfo";
        	this.$el.on("click", amountInputId, function(){
        		self.$el.find("#transferAmount .selectedInfo").hide();
        		var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT);
        		self.$el.find("#transferAmount #confirmAmount").val(amount);
        		self.$el.find("#transferAmount #edit").show();    
        		self.$el.find("#transferAmount #confirmAmount").select();
        	});
        	
        	this.$el.on("blur", "#transferAmount #confirmAmount", function(){
        		var value = $(this).val();
        		DataUtils.setLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT, value);
        		self.validateTransfer();
        		return true;
        	});
        	
			//setup the confirm button handler
			self.$el.on("click", "#confirmBtn", function() {
				var onResponse = function(){
					$.mobile.changePage("bills_final.html", {transition: "none"});
				};
				var onError = function(errorCode, statusMessage){
					Utils.showAlert(statusMessage);
				};
				var onOk = function(){					
					var onYes = function(){
					  ServiceProxyFactory.getServiceProxy().payBill({accountId:fromAccount.accountId, relatedAccountId:payeeId, type:Constants.BILLS_TRANS_TYPE, amount:amount}, onResponse,onError);		
					};
					Utils.showAlert(Utils.getTranslation("%bills.overdraft.confirm%"), onYes);
				};
				var onNo = function(){
					ServiceProxyFactory.getServiceProxy().payBill({accountId:fromAccount.accountId, relatedAccountId:payeeId, type:Constants.BILLS_TRANS_TYPE, amount:amount}, onResponse,onError);					
				};
				Utils.showConfirmationAlert(Utils.getTranslation("%bills.overdraft.question%"), onOk, onNo, null, "No,Yes");
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
		 * cancel the payment
		 * @param none
		 */
		_cancel: function()	{
			var question = Utils.getTranslation("%bills.cancel.question%");
			var onYes = function() {
				$.mobile.changePage("bills.html", {transition: "none"});
			};
			Utils.showConfirmationAlert(question, onYes);
		},
		
        /**
         * Validate the input. Enable the button if valid.
         * @param none
         */
        validateTransfer : function() {
        	var self = this;
        	
        	var isValid = false;
        	var transferButton = self.$el.find("#confirmBtn");
        	if(!Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_ACCOUNT)) 
        			&& !Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_PAYEE_ID)) 
        			&& (DataUtils.getLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT) > 0)) {
        		$(transferButton).button("enable");
        		isValid = true;
        	} else {
        		$(transferButton).button("disable");
        	}
        	return isValid;
        },
	});

	// Returns the View class
	return BillsConfirmPageView;
});