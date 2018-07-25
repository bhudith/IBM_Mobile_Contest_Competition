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

	], function( $, Backbone, Constants, PageView, Utils, DataUtils, TemplateUtils ) {

	// Extends PagView class
	var CheckFinalPageView = PageView.extend({

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

			//press back key to go home page
			$(document).on("backbutton", function(){
				self.goHome();
			});
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function() {
			PageView.prototype.render.call(this);

			var self = this;

			// set current date
			self.$el.find("#paymentTime").text(Utils.getCurrentDate());

			// retrieve check images
			var checkFrontImg = DataUtils.getLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_FRONT_IMG);
			self.$el.find("#checkFront .checkImage").attr("src", "data:image/jpeg;base64,"+checkFrontImg);
			var checkBackImg = DataUtils.getLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG);
			self.$el.find("#checkBack .checkImage").attr("src", "data:image/jpeg;base64,"+checkBackImg);

			// retrieve check to account data
			var account = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CHECK_TO_ACCOUNT);
			account = JSON.parse(account);
			self.$el.find("#checkToAccount .rightText").html(account.accountNum);

			// retrieve transfer amount
			var amount = DataUtils.getLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT);
			self.$el.find("#checkAmount .rightText").html(Utils.convertNumberToCurrency(amount));

			// fill check info
			var routingNumber = DataUtils.getLocalStorageData(Constants.LS_KEY_CHECK_ROUNTING_NUMBER);

			var checkAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_CHECK_CHECK_ACCOUNT);

			this.$el.find("#routingNumber .rightText").html(routingNumber);
			this.$el.find("#checkAccount .rightText").html(checkAccount);

			self.$el.on("click", "#depositAnotherBtn", function() {
				// reset storage data
				DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_FRONT_IMG, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CHECK_TO_ACCOUNT, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_ROUNTING_NUMBER, "");
				DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_CHECK_ACCOUNT, "");
				$.mobile.changePage("check.html", {transition: "none"});
			});

			//setup the return home button handler
			self.$el.on("click", "#returnHomeBtn", function() {
				$.mobile.changePage("home.html", {transition: "none"});
			});

			return this; //Maintains chainability
		},

		/**
		 * clean storage data and return home page
		 * @param none
		 */
		goHome: function() {
			DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_FRONT_IMG, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_CAPTURED_CHECK_BACK_IMG, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CHECK_TO_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_AMOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_ROUNTING_NUMBER, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_CHECK_CHECK_ACCOUNT, "");
			$.mobile.changePage("home.html", {transition: "none"});
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
	return CheckFinalPageView;
});