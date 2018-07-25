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
		"com/utils/DataUtils",
		"com/utils/AdapterUtils",
		"com/utils/Utils",
		"com/utils/AuthenticateUtils",

	], function( $, Backbone, Constants, ServiceProxyFactory, PageView, DataUtils, AdapterUtils, Utils, AuthenticateUtils ) {

	// Extends PagView class
	var LoginPageView = PageView.extend({

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

			//kill the app on back button
			$(document).on("backbutton", function(){
				MobileRouter.killApp();
			});
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function() {
			var self = this;
			PageView.prototype.render.call(this);

			//display previously used username, if user session is still valid, automatically redirect user to home page
			if(DataUtils.getLocalStorageData(Constants.LS_KEY_USERNAME)){
			   self.$el.find("#username").val(DataUtils.getLocalStorageData(Constants.LS_KEY_USERNAME));
			}
			if(DataUtils.getLocalStorageData(Constants.LS_KEY_PASSWORD)){
			   self.$el.find("#password").val(DataUtils.getLocalStorageData(Constants.LS_KEY_PASSWORD));
			}
			//login button handler
			self.$el.on("click", "#signinBtn", function() {
				var username = self.$el.find("#username").val();
				var password = self.$el.find("#password").val();

				var isKeepLoggedIn = self.$el.find("#keepLoggedIn").is(":checked");

				//connect to service to login
				var onResponse = function(response) {
					$.mobile.loading("hide");
					
					if(isKeepLoggedIn){
						DataUtils.setLocalStorageData(Constants.LS_KEY_USERNAME, username);
						DataUtils.setLocalStorageData(Constants.LS_KEY_PASSWORD, password);
					}
					else{
						DataUtils.setLocalStorageData(Constants.LS_KEY_USERNAME, "");
						DataUtils.setLocalStorageData(Constants.LS_KEY_PASSWORD, "");
					}
					
					if(response && response.errorCode != Constants.REST_SERVICE_RESPONSE_CODE_OK){
						self.$el.find("#errorMessage").css("visibility", "visible");
					}else{	
						//save user id logged in
						if(response && response.data && response.data.id){
							DataUtils.setLocalStorageData(Constants.LS_KEY_USERID, response.data.id);
						}
						
						//clear message state
						DataUtils.setLocalStorageData(Constants.LS_KEY_MESSAGES_STATE, "");
						
						$.mobile.changePage("home.html", {transition: "none"});
					}
				};
				
				var onError = function(errorCode, statusMessage){
					$.mobile.loading("hide");
					Utils.showAlert(statusMessage);
				};
				
				// use the remote or local service to login
				$.mobile.loading("show");
				AuthenticateUtils.login({username: username, password: password},
					onResponse,onError);
			});
			
		   	//unsupport forget password and register
			this.$el.on("tap", "#forgotPasswordBtn, #registerBtn", function(){
				self._showUnsupportedMessage();
				return false;
			});
			
			return this; //Maintains chainability
		},

		 /**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
			console.log("login dispose!");
		},
		
		/**
		 * alert unsupported message when the function not provided.
		 * @param none
		 */
		_showUnsupportedMessage: function() {
			var message = Utils.getTranslation("%common.feature.unavailable%");
			Utils.showAlert(message, null);
		},
	});

	// Returns the View class
	return LoginPageView;
});