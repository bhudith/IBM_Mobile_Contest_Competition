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

	], function( $, Backbone, Constants, PageView, SideMenuPanel, Utils, DataUtils, TemplateUtils, ServiceProxyFactory) {

	// Extends PagView class
	var ManageAlertsPageView = PageView.extend({

		_prefId: null, // ID attribute of preference being processing

		_param: null, // params of preference being processing

		_notifyEnabled: null, // notifyEnabled attribute of preference being processing

		_emailEnabled: null, // emailEnabled attribute of preference being processing

		_accountName: null, //account selected

		/**
		 * The View Constructor
		 * @param options, parameters passed from previous page
		 */
		initialize: function(options) {
			var self = this;
			PageView.prototype.initialize.call(this, options);

			self._prefId = options && options.data && options.data.prefId ? options.data.prefId : null;
			self._param = options && options.data && options.data.param ? options.data.param : null;
			self._notifyEnabled = options && options.data && options.data.notifyEnabled ? options.data.notifyEnabled : null;
			self._emailEnabled = options && options.data && options.data.emailEnabled ? options.data.emailEnabled : null;
			self._accountName = options && options.data && options.data.accountName ? options.data.accountName : null;

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

			var account = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT);
			if (!Utils.isNullOrEmpty(account)) {
				self._isAccountSelected = true;
				account = JSON.parse(account);
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT_ID,account.accountId);				
				if(self._accountName && account.name != decodeURI(self._accountName)){
					self._prefId = null;
				}
			}
			else{
				self._isAccountSelected = false;
			}

			//init alert list
			var onResponse = function(alertPrefs) {
				$.mobile.loading("hide");

				var onTemplate = function(html) {
					var model = MobileRouter.getModel();
					var settings = model.get("settings");
					var language = settings.get("language");
					var localizedHtml = Utils.applyLocalization(html, language);

					self.$el.find("#prefList").html(localizedHtml).listview("refresh");

					// retrieve alert setting account data
					var account = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT);
					if (!Utils.isNullOrEmpty(account)) {
						var onTemplate = function(html) {
							self.$el.find(".account .selectedInfo").html(html);
						};
						account = JSON.parse(account);
						DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT_ID,account.accountId);
						var params = {account: account};
						TemplateUtils.getTemplate("alert_account_info", params, onTemplate);
					}
				};

				var items = [];
				alertPrefs.each(function(alertPref) {
					var prefId = alertPref.get("prefId");
					var title = alertPref.get("title");
					var param = null;
					var notifyEnabled = null;
					var emailEnabled = null;

					if(prefId === self._prefId){
						if(self._param){
							param = self._param;
						}
						notifyEnabled = self._notifyEnabled === "true";
						emailEnabled = self._emailEnabled === "true";
					}else{
						param = alertPref.get("param");
						notifyEnabled = alertPref.get("notifyEnabled");
						emailEnabled = alertPref.get("emailEnabled");
					}

					var enabled = notifyEnabled || emailEnabled;

					title = self.populatePrefTitle(title, param);
                    
					var context = {prefId: alertPref.get("prefId"), title: title, param: param, notifyEnabled: notifyEnabled, emailEnabled: emailEnabled, enabled: enabled, editable: alertPref.get("editable")};
					items.push(context);
				});

				var params = {alertPrefs: items, isAccountSelected:self._isAccountSelected};
				TemplateUtils.getTemplate("alert_pref_list", params, onTemplate);
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};

			if(self._isAccountSelected){
			    ServiceProxyFactory.getServiceProxy().getPrefByAccountId(DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT_ID),onResponse,onError);
			    $.mobile.loading("show");
			}

			//alert row tap handler
			this.$el.on("click", "#prefList .preference", function(){
				if(!$(this).hasClass("editable")){
					self._showUnsupportedMessage();
					return false;
				}
				// retrieve account
				var accountTitle = "";
				var account = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT);
				if (!Utils.isNullOrEmpty(account)) {
					account = JSON.parse(account);
					accountTitle = account.name;
				}
				var data = { accountTitle: encodeURI(accountTitle), prefId: $(this).attr("data-id"), param: $(this).attr("data-param"), notifyEnabled: $(this).attr("data-notify-enabled"), emailEnabled: $(this).attr("data-email-enabled")};
				$.mobile.changePage("alert_detail.html", {data: data});
				return false;
			});

			//press back key to go home page
			$(document).on("backbutton", function(){
				self.goHome();
			});
			
			//init side menu
			new SideMenuPanel({el: this.$el.find("#menuPanel"), currentPageId: "#manageAlerts"});

			return this;
		},

		/**
		 * populate alert preference title with parameters
		 *
		 * @param title, preference title
		 * @param param, parameter, currently only support one parameter
		 */
		populatePrefTitle: function(title, param){
			if(title && param){
				return title.replace("{0}", param);
			}

			return title;
		},

		/**
		 * show feature unavailable message
		 * @param none
		 */
		_showUnsupportedMessage: function() {
			var message = Utils.getTranslation("%common.feature.unavailable%");
			Utils.showAlert(message, null);
		},

		/**
		 * do any cleanup, remove window binding here
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},
		
		/**
		 * clean storage data and return to home page
		 * @param none
		 */
		goHome: function() {
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT, "");
			DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT_ID, "");
			$.mobile.changePage("home.html", {transition: "none"});
		},

	});

	// Returns the View class
	return ManageAlertsPageView;

});