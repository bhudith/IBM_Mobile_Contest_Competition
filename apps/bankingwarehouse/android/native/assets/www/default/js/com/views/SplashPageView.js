
/* JavaScript content from js/com/views/SplashPageView.js in folder common */
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
		"cftoaster",
		"com/views/PageView",
		"com/models/Constants",
		"com/utils/Utils",
		"com/utils/DataUtils",

	], function( $, Backbone, CFToaster, PageView, Constants, Utils, DataUtils ) {

	// Extends PagView class
	var SplashPageView = PageView.extend({

		/**
		 * The View Constructor
		 * @param none
		 */
		initialize: function() {
			PageView.prototype.initialize.call(this);

			//populate the version number before the page is shown
			this.$el.on("pagebeforeshow", function(){
				var versionElement = $(this).find("#version");
				var version = WL.Client.getAppProperty(WL.AppProperty.APP_VERSION);
				$(versionElement).text("v. " + version);
			});

			var self = this;
			this.$el.on("tap", "#continueBtn", function(){
				$.mobile.changePage("login.html", {transition: "none"});
				return false;
			});

			//kill the app on back button
			$(document).on("backbutton", function(){
				MobileRouter.killApp();
			});
			
			self._clear();
		},

		/**
		 * show the passcode dialog so the user can only continue with the app if they know the code
		 * @param none
		 */
		_showPasscodeDialog: function() {
			var question = Utils.getTranslation("%splash.password.question%");
			var passcode = prompt(question, "");
			if(passcode == Constants.PASSCODE) {
				$.mobile.changePage("login.html", {transition: "none"});
			}
			else if(passcode) {
				var msg = "Wrong!";
				$("body").cftoaster({content: msg});
			}
		},

		 /**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},

		/**
		 * clear loaded marker for google map
		 * @param none
		 */
		_clear: function() {
			DataUtils.setLocalStorageData(Constants.LS_KEY_LOADMAP_MARK,"");
		}
		
	});

	// Returns the View class
	return SplashPageView;

});