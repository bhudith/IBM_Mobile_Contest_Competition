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
    var CheckPageView = PageView.extend({
    	
    	/**
         * The View Constructor
         * @param none
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
        	
        	// retrieve account info
			var account = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CHECK_TO_ACCOUNT);
    		if (!Utils.isNullOrEmpty(account)) {
	        		var onTemplate = function(html) {
	        			self.$el.find("#checkToAccount .selectedInfo").html(html);
	        		};
					account = JSON.parse(account);
	        		var params = {account:  account};
	        		TemplateUtils.getTemplate("select_account_info", params, onTemplate);
	        }
        	      	
        	// setup check camera
        	self.$el.on("tap", "#checkFront, #checkBack", function() {
        		var id = $(this).attr("id");
    			var onCapturedCheck = function(image) {			
    				self.fillCheckImage(id, image);
    				//self.fillCheckInfo();
    				self.activeConfirmButton();
    			};
    			Utils.takePhotoBase64(onCapturedCheck);
        	});
        	
        	// retrieve check images
			var checkFrontImg = DataUtils.getLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_FRONT_IMG);
			if (!Utils.isNullOrEmpty(checkFrontImg)) {
				self.fillCheckImage("checkFront", checkFrontImg);
			}
			var checkBackImg = DataUtils.getLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG);
			if (!Utils.isNullOrEmpty(checkBackImg)) {
				self.fillCheckImage("checkBack", checkBackImg);
			}
        	
        	// retrieve check amount
        	if(DataUtils.getLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT)){
        		self.$el.find("#checkAmount").val(DataUtils.getLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT));
        		self.activeConfirmButton();
        	}
			
	       	//setup the check amount handlers
        	this.$el.on("blur", "#checkAmount", function(){
        		var value = $(this).val();
        		DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT, value);
        		self.activeConfirmButton();
        		return true;
        	});
    		
        	//setup the confirm button handler
			self.$el.on("click", "#confirmBtn", function() {
				var account = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CHECK_TO_ACCOUNT);
				account = JSON.parse(account);

				$.mobile.changePage("check_confirm.html", {transition: "none"});
			});
			
			//setup the cancel button handler
			self.$el.on("click", "#cancelBtn", function() {
				self.clearStorage();
				$.mobile.changePage("home.html", {transition: "none"});
			});
			
			//return home.html on back button
			$(document).on("backbutton", function(){
				self.clearStorage();
				$.mobile.changePage("home.html", {transition: "none"});
			});
			
			//render the left side menu
			new SideMenuPanel({el: this.$el.find("#menuPanel"), currentPageId: "#check"});

            return this; //Maintains chainability
        },
        
        /**
         * clear storage
         * @param none
         */
        clearStorage: function(){
        	DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_FRONT_IMG, "");
        	DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG, "");
        	DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CHECK_TO_ACCOUNT, "");
        	DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT, "");
        },
        
        /**
         * fill check image into page according to id
         * @param id, image id
         * @param image, image data
         */
        fillCheckImage: function(id, image){
        	var self = this;
        	
        	if (id == "checkFront") {
        		DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_FRONT_IMG, image);
        		
        		self.$el.find("#checkFront .checkImage").attr("src", "data:image/jpeg;base64,"+image);
        		self.$el.find("#checkFront .checkImage").css("display", "inline");
        	} else if (id == "checkBack") {
        		DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG, image);
        		
        		self.$el.find("#checkBack .checkImage").attr("src", "data:image/jpeg;base64,"+image);
        		self.$el.find("#checkBack .checkImage").css("display", "inline");
        	}
        },
            
        
        /**
         * activate the button if check image and account exist
         * @param none
         */
        activeConfirmButton: function(){
        	if(!Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_FRONT_IMG)) 
        			&& !Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG))
        			&& !Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CHECK_TO_ACCOUNT))
        			&& (DataUtils.getLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT) > 0)){

        		this.$el.find("#confirmBtn").button("enable");
        	}
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
    return CheckPageView;

});