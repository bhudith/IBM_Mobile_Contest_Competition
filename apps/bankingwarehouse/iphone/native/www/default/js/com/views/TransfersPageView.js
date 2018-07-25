
/* JavaScript content from js/com/views/TransfersPageView.js in folder common */
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
		"com/views/SideMenuPanel",
		"com/utils/Utils",
		"com/utils/DataUtils",
		"com/utils/TemplateUtils",
		"com/utils/AdapterUtils",
	
	], function( $, Backbone, Constants, ServiceProxyFactory, PageView, SideMenuPanel, Utils, DataUtils, TemplateUtils, AdapterUtils ) {
		
    // Extends PagView class
    var TransfersPageView = PageView.extend({
    	
    	/**
         * The View Constructor
         * @param none
         */
        initialize: function() {
        	var self = this;
			PageView.prototype.initialize.call(this);
			
			//render ui on pagebfore show event
			self.$el.on("pageshow", function(){
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
        	// retrieve transfer from account data
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
    		
        	if(DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT)){
        		var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT);
        		self.$el.find("#transferAmount").val(amount);
        		self.validateTransfer();
        	}
        	
        	// retrieve transfer amount
        	this.$el.on("blur", "#transferAmount", function(){
        		var value = $(this).val();
        		DataUtils.setLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT, value);
        		self.validateTransfer();
        		return true;
        	});
			
			//setup the transfer button handler
			self.$el.on("click", "#transferBtn", function() {
				// validate transfer accounts and amount
				var isValid = self.validateTransfer();
				
				if (isValid) {
					//validate 	fromAccount.amount > transfer amount			
					if(fromAccount.category!=0){
						if(DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT) > Utils.convertCurrencyToNumber(fromAccount.amount)){
						  Utils.showAlert("Insufficient account balance", null, null, null);
						}else{
							$.mobile.changePage("transfers_confirm.html", {transition: "none"});
						}
					}else{
						$.mobile.changePage("transfers_confirm.html", {transition: "none"});
					}
				}
			});
			
			//setup the cancel button handler
			self.$el.on("click", "#cancelBtn", function() {
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_FROM_ACCOUNT, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_TO_ACCOUNT, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT, "");
				$.mobile.changePage("home.html", {transition: "none"});
			});
			
			//return home.html on back button
			$(document).on("backbutton", function(){
				$.mobile.changePage("home.html", {transition: "none"});
			});
			
			//render the left side menu
			new SideMenuPanel({el: this.$el.find("#menuPanel"), currentPageId: "#transfers"});
        	
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
    		if(!Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_FROM_ACCOUNT)) 
    				&& !Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_TO_ACCOUNT)) 
    				&& DataUtils.getLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT) > 0) {
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
    return TransfersPageView;

});