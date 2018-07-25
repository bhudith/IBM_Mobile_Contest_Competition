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
		"com/utils/AdapterUtils",
		"com/views/SideMenuPanel",
		"com/utils/AuthenticateUtils",
		"com/utils/MessagesUtils",

	], function( $, Backbone, Constants, ServiceProxyFactory, PageView, Utils, DataUtils, AdapterUtils, SideMenuPanel, AuthenticateUtils, MessagesUtils ) {

	// Extends PagView class
	var HomePageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param none
		 */
		initialize: function() {
			var self = this;
			PageView.prototype.initialize.call(this);

			//initialize components so it would be ready for the page
			this.$el.on("pageshow", function(){
				self.clear();

				self.render();
			});

			//kill the app on back button
			$(document).on("backbutton", function(){
				self._logout();
			});
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function() {
			PageView.prototype.render.call(this);
			var self = this;

			// display username
			var username = DataUtils.getLocalStorageData(Constants.LS_KEY_USERNAME);
			if (!Utils.isNullOrEmpty(username)) {
				self.$el.find("#username").text(username);
			}

			// update messages bubble and require user action img
			var updateMessagesState = function(stateObj){
				Utils.updateBubble(self.$el.find(".notificationBubbleSpan"), stateObj.newMessageAmount);
				if(stateObj.requireActionArray.some(function(isRequireAction){
					return isRequireAction;
				})){
					self.$el.find(".urgentBubbleSpan").addClass("urgentBubble").text("URGENT");		
					self.$("#messages").addClass("withUrgent");
				} else{
				  self.$("#messages").removeClass("withUrgent");
				}
			};

			// init the messages states and bubbles
			var onHandler = function(stateObj){
					DataUtils.setLocalStorageData(Constants.LS_KEY_MESSAGES_STATE,
										JSON.stringify(stateObj));
					updateMessagesState(stateObj);
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};
			MessagesUtils.initMessagesState({"userId": DataUtils.getLocalStorageData(Constants.LS_KEY_USERID)}, onHandler,onError);

			//logout handler
			this.$el.on("tap", "#logoutBtn", function(){
				self._logout();
				return false;
			});

			//find branches handler
			this.$el.on("tap", "#findBranchBtn", function(){
				$.mobile.changePage("locations.html", {transition: "none"});
				return false;
			});

			 // contact handler
			this.$el.on("tap", "#contactUsBtn", function() {
				 $.mobile.changePage("contact.html", {transition: "none"});
				 return false;
			});

			//render the left side menu
			new SideMenuPanel({el: this.$el.find("#menuPanel"), currentPageId: "#home"});
			
			return this; //Maintains chainability
		},

		/**
		 *  Clear data in local storage
		 *  @param none
		 */
		clear: function() {
			//reset data cache
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_FROM_ID, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_TO_ID, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_FROM_NUM, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_TO_NUM, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_FROM_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_TRANSFERS_TO_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_TRANSFERS_AMOUNT, "");
			
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_BILLS_PAYEE_ID, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_BILLS_AMOUNT, "");
			
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CHECK_TO_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_FRONT_IMG, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT, "");
			
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_MONEY_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CONTACT_NAME, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_MONEY_AMOUNT, "");
			
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CASH_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_CASH_AMOUNT, "");
			
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT, "");
		},

		/**
		 * log out the current user
		 * @param none
		 */
		_logout: function()	{
			var question = Utils.getTranslation("%home.logout.question%");
			var onYes = function() {
				var onSuccess = function() {
					$.mobile.changePage("login.html", {reverse: true});
				};
				var onError = function(errorCode, statusMessage){
					Utils.showAlert(statusMessage);
				};
				AuthenticateUtils.logout([DataUtils.getLocalStorageData(Constants.LS_KEY_USERID),
								 							 DataUtils.getLocalStorageData(Constants.LS_KEY_TOKEN)],
															 onSuccess,onError);
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
	return HomePageView;

});