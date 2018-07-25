
/* JavaScript content from js/com/views/CheckConfirmPageView.js in folder common */
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
		"com/utils/Utils",
		"com/utils/DataUtils",
		"com/utils/TemplateUtils",
		"com/models/ServiceProxyFactory",

	], function( $, Backbone, Constants, PageView, Utils, DataUtils, TemplateUtils, ServiceProxyFactory ) {

	// Extends PagView class
	var CheckConfirmPageView = PageView.extend({
        imageBase64 : null,
        isEdited : false,
        
		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			var self = this;
			PageView.prototype.initialize.call(this, options);

			//initialize components so it would be ready for the page
			this.$el.on("pageshow", function() {
				self.render();
			});
		},

		/**
		 * Renders UI for page
		 */
		render: function() {
			PageView.prototype.render.call(this);

			var self = this;

			// retrieve check images
			var checkFrontImg = DataUtils.getLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_FRONT_IMG);
			self.$el.find("#checkFront .checkImage").attr("src", "data:image/jpeg;base64,"+checkFrontImg);
			var checkBackImg = DataUtils.getLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG);
			self.$el.find("#checkBack .checkImage").attr("src", "data:image/jpeg;base64,"+checkBackImg);
			
        	// setup check camera
        	self.$el.on("tap", "#checkFront, #checkBack", function() {
        		if(self.isEdited){
        			return;
        		}
        		var id = $(this).attr("id");
        		
    			var onCapturedCheck = function(image) {			
    				self.fillCheckImage(id, image);
    				self.activeConfirmButton();
    			};
    			Utils.takePhotoBase64(onCapturedCheck);
        	});

			// retrieve check to account data
			var fromAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CHECK_TO_ACCOUNT);
			var onTemplate = function(html) {
				self.$el.find("#checkToAccount .selectedInfo").html(html);
			};
			fromAccount = JSON.parse(fromAccount);
			var params = {account: fromAccount};
			TemplateUtils.getTemplate("select_account_info", params, onTemplate);

			// retrieve transfer amount
			var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT);
			self.$el.find("#checkAmount .selectedInfo").html(Utils.convertNumberToCurrency(amount));
			
			this.$el.on("click", "#checkAmount .selectedInfo", function(){
        		if(self.isEdited){
        			return;
        		}
        		self.$el.find("#checkAmount .selectedInfo").hide();
        		var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT);
        		self.$el.find("#checkAmount #confirmAmount").val(amount);
        		self.$el.find("#checkAmount #edit").show();    
        		self.$el.find("#checkAmount #confirmAmount").select();
        	});
			
        	this.$el.on("blur", "#checkAmount #confirmAmount", function(){
        		var value = $(this).val();
        		DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT, value);
        		self.activeConfirmButton();
        		return true;
        	});

			// fill check info
			var routingNumber = "123456789";
			var checkAccount = "12345454555";
			DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_ROUNTING_NUMBER, routingNumber);
			DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_CHECK_ACCOUNT, checkAccount);
			this.$el.find("#routingNumber .rightText").html(routingNumber);
			this.$el.find("#checkAccount .rightText").html(checkAccount);

			//setup the confirm button handler
			self.$el.on("click", "#confirmBtn", function() {
				$.mobile.loading("show");
				self.$el.find("#accountid").attr("href","#");
				self.$el.find("#homeid").attr("href","#");
				self.$el.find("#backid").removeAttr("data-rel");
				self.$el.find("#confirmBtn").button("disable");
				self.$el.find("#cancelBtn").button("disable");
				self.isEdited = true;
				var onlineFlag = DataUtils.getLocalStorageData(Constants.LS_KEY_IS_ONLINE);
                DataUtils.setLocalStorageData(Constants.LS_KEY_IS_ONLINE, "true");
				
				 var onCheckHandler = function(result){
					$.mobile.loading("hide");
					
					var result = JSON.parse(result);
					var errorCode = result.errorCode;
					var errorMessage = result.errorMessage;
					
					if(Utils.isNullOrEmpty(errorCode)){ //successfull
						$.mobile.changePage("check_final.html", {transition: "none"});
					}
					else if(errorCode == "3"){//data error
						var mode = {type:"data", photoFace:"", message:encodeURI(errorMessage)};
						$.mobile.changePage("check_error.html", {data:mode, transition: "none"});
					}
					else if(errorCode == "2"){//front photo error
						var mode = {type:"photo", photoFace:"front", message:encodeURI(errorMessage)};
						$.mobile.changePage("check_error.html", {data:mode, transition: "none"});
					}
					else if(errorCode == "1"){//back photo error
						var mode = {type:"photo", photoFace:"back", message:encodeURI(errorMessage)};
						$.mobile.changePage("check_error.html", {data:mode, transition: "none"});
					}
					else if(errorCode == "999"){//connect time out
						$.mobile.changePage("check_final.html", {transition: "none"});
					}
					else{
						//alert("BPM server maybe shutdown. Please check the server.");
						$.mobile.changePage("check_final.html", {transition: "none"});
					}
				 };
				 var onError = function(errorCode, statusMessage){
						self.$el.find("#confirmBtn").button("enable");
						self.$el.find("#cancelBtn").button("enable");
						self.$el.find("#accountid").attr("href","select_account.html?accountStorageKey=selectedCheckToAccount");
						self.$el.find("#homeid").attr("href","home.html");
						self.$el.find("#backid").attr("data-rel","back");
						self.isEdited = false;
						//if(errorCode!="noconnection"){
						   //Utils.showAlert(statusMessage);
						//}
						$.mobile.changePage("check_final.html", {transition: "none"});
					};
				 
				 var depositParamers = {"accountNumber":fromAccount.accountNum, "acccountName":fromAccount.name, "routingNumber":routingNumber, "amount":DataUtils.getLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT), "imageFront":checkFrontImg, "imageBack":checkBackImg};
				 ServiceProxyFactory.getServiceProxy().checkDepositInfo(depositParamers, onCheckHandler,onError);
				 DataUtils.setLocalStorageData(Constants.LS_KEY_IS_ONLINE, onlineFlag);
			});

			//setup the cancel button handler
			self.$el.on("click", "#cancelBtn", function() {
				self._cancel();
			});
			
			//return to previous page
			$(document).on("backbutton", function(){
        		if(self.isEdited){
        			return false;
        		}
        		self._cancel();
			});

			return this; //Maintains chainability
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
        	} else if (id == "checkBack") {
        		DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG, image);
        		
        		self.$el.find("#checkBack .checkImage").attr("src", "data:image/jpeg;base64,"+image);
        	}
        },
            
        
        /**
         * active the button if check image and account exist
         * @param none
         */
        activeConfirmButton: function(){
        	if(!Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_FRONT_IMG)) 
        			&& !Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG))
        			&& !Utils.isNullOrEmpty(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CHECK_TO_ACCOUNT))
        			&& (DataUtils.getLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT) > 0)){

        		this.$el.find("#confirmBtn").button("enable");
        		return true;
        	}
        	return false;
        },
        
		/**
		 * cancel the payment
		 *
		 * @param none
		 */
		_cancel: function() {
			var question = Utils.getTranslation("%check.cancel.question%");
			var onYes = function() {
				$.mobile.changePage("check.html", {transition: "none"});
			};
			Utils.showConfirmationAlert(question, onYes);
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
	return CheckConfirmPageView;
});