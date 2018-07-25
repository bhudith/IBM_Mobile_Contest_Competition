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
	
	], function( $, Backbone, Constants, PageView, SideMenuPanel, Utils, DataUtils, TemplateUtils ) {
		
    // Extends PagView class
    var MoneyPageView = PageView.extend({
    	
    	/**
         * The View Constructor
         * @param el, DOM element of the page
         */
        initialize: function() {
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
        		self.$el.find("#transferAmount").val(DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT));
        		self.validateTransfer();
        	}

        	//setup the transfer amount handlers
        	this.$el.on("blur", "#transferAmount", function(){
        		var value = $(this).val();
        		DataUtils.setLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT, value);
        		self.validateTransfer();
        		return true;
        	});
        	
			//setup the transfer button handler
			self.$el.on("click", "#transferBtn", function() {
				// validate transfer accounts and amount
				var isValid = self.validateTransfer();
				if (isValid) {
					//validate 	fromAccount.amount > money amount			
					if(fromAccount.category!=0){
						if(DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT) > Utils.convertCurrencyToNumber(fromAccount.amount)){
						  Utils.showAlert("Insufficient account balance", null, null, null);
						}else{
							$.mobile.changePage("money_confirm.html", {transition: "none"});
						}
					}else{
						$.mobile.changePage("money_confirm.html", {transition: "none"});
					}
				}
			});
			
			//setup the cancel button handler
			self.$el.on("click", "#cancelBtn", function() {
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_MONEY_ACCOUNT, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT, "");
				$.mobile.changePage("home.html", {transition: "none"});
			});
			
			//return home.html on back button
			$(document).on("backbutton", function(){
				$.mobile.changePage("home.html", {transition: "none"});
			});
			
			//render the left side menu
			new SideMenuPanel({el: this.$el.find("#menuPanel"), currentPageId: "#sendMoney"});
        	
            return this; //Maintains chainability
        },
        
        /**
         * Validate the input. Enable the transfer button if valid.
         * @param none
         */
        validateTransfer : function() {
        	var self = this;
        	
        	var isValid = false;
        	var transferButton = self.$el.find("#transferBtn");

        	if(!Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_MONEY_ACCOUNT)) 
        			&& !Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME))
        			&& DataUtils.getLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT) > 0) {
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
    return MoneyPageView;

});