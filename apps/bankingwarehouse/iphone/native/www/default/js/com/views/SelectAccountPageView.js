
/* JavaScript content from js/com/views/SelectAccountPageView.js in folder common */
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
		"com/models/AccountModel",
		"com/models/ServiceProxyFactory",
		"com/collections/AccountModelsCollection",
		"com/views/PageView",
		"com/utils/Utils",
		"com/utils/DataUtils",
		"com/utils/TemplateUtils",
		"com/utils/AdapterUtils",

	], function( $, Backbone, Constants, AccountModel, ServiceProxyFactory, AccountModelsCollection, PageView, Utils, DataUtils, TemplateUtils, AdapterUtils ) {

	// Extends PagView class
	var SelectAccountPageView = PageView.extend({

		_onSelectToPage: "", //url to redirect the user after a account is selected, default is to go back
		_accountStorageKey: "", // account local storage key stored and passed by different pages
		_accountStorageFilterKey: "",// account local storage key to filter the account in the list

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options)
		{
			var self = this;
			this._onSelectToPage = options && options.data && options.data.onSelectToPage ? options.data.onSelectToPage : "";
			this._accountStorageKey = options && options.data && options.data.accountStorageKey ? options.data.accountStorageKey : "";
			this._accountStorageFilterKey = options && options.data && options.data.accountStorageFilterKey ? options.data.accountStorageFilterKey : "";

			PageView.prototype.initialize.call(this, options);

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

			$.mobile.loading("show");

			// list the accounts
			var onAccounts = function(accounts) {
				$.mobile.loading("hide");
				var onTemplate = function(html) {
					self.$el.find("#accountsList").html(html).listview("refresh");
				};

				var params = {accounts: accounts};
				TemplateUtils.getTemplate("select_account_list_row", params, onTemplate);
			};

			var accountArr = [];
			var accountIdFilter = DataUtils.getLocalStorageData(self._accountStorageFilterKey);
			accountIdFilter = Utils.isNullOrEmpty(accountIdFilter) ? "{}" : accountIdFilter;
			accountIdFilter = JSON.parse(accountIdFilter);
			// filter the response from server
			var onSuccess = function(accounts) {
				accounts.each(function(account) {
					if(accountIdFilter.accountNum != account.get("accountNum")){
						var context = {accountId: account.get("accountId"), accountNum: account.get("accountNum"),
								name: account.get("accountName"), amount: Utils.convertNumberToCurrency(account.get("balance")),
								category: account.get("category")};
						accountArr.push(context);
					}
				});
				onAccounts(accountArr);
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};

			ServiceProxyFactory.getServiceProxy().getUserAccounts({userId:DataUtils.getLocalStorageData(Constants.LS_KEY_USERID)},
					onSuccess,onError);

			//account row tap handler
			this.$el.on("click", "#accountsList .account", function(){
				var num = $(this).attr("data-num");
				for(var i in accountArr){
					if(accountArr[i].accountNum == num){
						DataUtils.setLocalStorageData(self._accountStorageKey, JSON.stringify(accountArr[i]));
					}
				}

				if(self._onSelectToPage) {
					$.mobile.changePage(self._onSelectToPage);
				} else {
					history.back();
				}
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
		},

	});

	// Returns the View class
	return SelectAccountPageView;

});