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
		"com/views/SideMenuPanel",
		"com/utils/Utils",
		"com/utils/DataUtils",
		"com/utils/TemplateUtils",
		"com/models/ServiceProxyFactory",
		"com/utils/PaymentUtils",
	
	], function( $, Backbone, Constants, PageView, SideMenuPanel, Utils, DataUtils, TemplateUtils, ServiceProxyFactory,PaymentUtils ) {
		
    // Extends PagView class
    var BillsPageView = PageView.extend({

    	/**
         * The View Constructor
         * @param options, parameters passed from the previous page
         */
        initialize: function(options) {
        	var self = this;
			PageView.prototype.initialize.call(this);
			
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
        	
        	// retrieve bill account data
        	var fromAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_ACCOUNT);
    		if (!Utils.isNullOrEmpty(fromAccount)) {
        		var onTemplate = function(html) {
        			self.$el.find("#billsAccount .selectedInfo").html(html);
        		};
        		fromAccount = JSON.parse(fromAccount);
        		var params = {account: fromAccount};
        		TemplateUtils.getTemplate("select_account_info", params, onTemplate);
        	}
        	
        	// retrieve bill payee data
        	var payeeId = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_PAYEE_ID);
        	if (!Utils.isNullOrEmpty(payeeId)) {
        		var onResponse = function(payee) { 
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

            	PaymentUtils.getPayeeByPayeeId(payeeId, onResponse,onError);
        	}                                         
        	
        	// retrieve bills amount
        	if(DataUtils.getLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT)){
        		self.$el.find("#transferAmount").val(DataUtils.getLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT));
        		self.validateTransfer();
        	}
        	
        	//setup the payment amount handlers
        	this.$el.on("blur", "#transferAmount", function(){
        		var value = $(this).val();
        		DataUtils.setLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT, value);
        		self.validateTransfer();
        		return true;
        	});
        	
			//setup the transfer button handler
			self.$el.on("click", "#transferBtn", function() {
				// validate transfer accounts and amount
				var isValid = self.validateTransfer();
				
				if (isValid) {
					//validate 	fromAccount.amount > pay bill amount		
					if(fromAccount.category!=0){
						if(DataUtils.getLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT) > Utils.convertCurrencyToNumber(fromAccount.amount)){
						  Utils.showAlert("Insufficient account balance", null, null, null);
						}else{
							$.mobile.changePage("bills_confirm.html", {transition: "none"});
						}
					}else{
							$.mobile.changePage("bills_confirm.html", {transition: "none"});
					}
				}
			});
			
			//setup the cancel button handler
			self.$el.on("click", "#cancelBtn", function() {
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_ACCOUNT, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_PAYEE_ID, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT, "");
				$.mobile.changePage("home.html", {transition: "none"});
			});
			
			//return home.html on back button
			$(document).on("backbutton", function(){
				$.mobile.changePage("home.html", {transition: "none"});
			});
			
			//render the left side menu
			new SideMenuPanel({el: this.$el.find("#menuPanel"), currentPageId: "#payBills"});
        	
            return this; //Maintains chainability
        },
        
        /**
         * Validate the input. Enable the button if valid.
         * @param none
         */
        validateTransfer : function() {
        	var self = this;
        	
        	var isValid = false;
        	var transferButton = self.$el.find("#transferBtn");
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
        
         /**
         * do any cleanup, remove window binding here
         * @param none
         */
        dispose: function() {
        	PageView.prototype.dispose.call(this);
        },
    });

    // Returns the View class
    return BillsPageView;
});