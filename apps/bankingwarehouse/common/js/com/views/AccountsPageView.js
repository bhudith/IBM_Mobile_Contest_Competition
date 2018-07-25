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
		"com/models/AccountModel",
		"com/collections/AccountModelsCollection",
		"com/views/PageView",
		"com/utils/DataUtils",
		"com/utils/Utils",
		"com/utils/TemplateUtils",
		"com/views/SideMenuPanel",
		"com/utils/AdapterUtils",

	], function( $, Backbone, Constants, ServiceProxyFactory, AccountModel, AccountModelsCollection, PageView, DataUtils, Utils, TemplateUtils, SideMenuPanel, AdapterUtils) {

	// Extends PagView class
	var AccountsPageView = PageView.extend({

		_onSelectToPage: "", //url to redirect the user after a account is selected, default is to go back

		/**
		 * The View Constructor
		 * @param options
		 */
		initialize: function(options) {
			var self = this;
			this._onSelectToPage = options && options.data && options.data.onSelectToPage ? options.data.onSelectToPage : "";
			PageView.prototype.initialize.call(this, options);

			//render view on pageshow event
			this.$el.on("pageshow", function(){

				self.render();

			});
		},
	
	   	/**
	   	 * get the context objects needed to generate the accounts list view using the template
	   	 * sorted by account categories
	   	 * @param accounts, AccountModelsCollection
	   	 * @return context, object
	   	 */
	   	getAccountsTemplateContext: function(accounts) {
	   		accounts.sortByCategory();
	
			var items = [];
			var sumItems = [],
				SUM_CATEGORY_ID = -1,
				SUM_CATEGORY_NAME = "Account Summary";
			var currentCategory = -1;

			var total = 0;
			accounts.each(function(account) {
				var categoryId = account.get("category");
				var amount = parseInt(account.get("balance"));
				if(categoryId != currentCategory){
					//Append total for previous category
					if(currentCategory >= 0){
						items.push( {name: AccountModel.CATEGORIES[currentCategory], amount: Utils.convertNumberToCurrency(total),
			   				categoryId: currentCategory, categoryName: AccountModel.CATEGORIES[currentCategory],
			   				isTotal: true
						});

						sumItems.push( {name: AccountModel.CATEGORIES[currentCategory], amount: Utils.convertNumberToCurrency(total),
			   				categoryId: SUM_CATEGORY_ID, categoryName:SUM_CATEGORY_NAME, sumName:"Credit",
			   				isTotal: true, isSummary: true, isNegative: (total<0)
						});
					}
					currentCategory = categoryId;
					total = 0;
				}

				var context =  {accountId: account.get("accountId"), name: account.get("accountName"),
		   				accountNum: account.get("accountNum"), amount: Utils.convertNumberToCurrency(amount),
		   				categoryId: categoryId, categoryName: AccountModel.CATEGORIES[categoryId],
				};
				items.push(context);
                
				total += amount;
			});

			//Append total for the last category
			if(currentCategory >= 0){
				items.push( {name: AccountModel.CATEGORIES[currentCategory], amount: Utils.convertNumberToCurrency(total),
	   				categoryId: currentCategory, categoryName: AccountModel.CATEGORIES[currentCategory],
	   				isTotal: true
				});

				sumItems.push( {name: AccountModel.CATEGORIES[currentCategory], amount: Utils.convertNumberToCurrency(total),
	   				categoryId: SUM_CATEGORY_ID, categoryName:SUM_CATEGORY_NAME, sumName:"Cash",
	   				isTotal: true, isSummary: true, isNegative: (total<0)
				});
			}	

			return {accounts: sumItems.reverse().concat(items.reverse())};
	   	},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function() {
			PageView.prototype.render.call(this);

			var self = this;

			$.mobile.loading("show");

			var accountsCollection = null;
			// list accounts by category
			var onAccounts = function(accounts)
			{
				accountsCollection = accounts;
				$.mobile.loading("hide");
				var onTemplate = function(html) {
					self.$el.find("#accountsList").html(html).listview("refresh");
				};

				var context = self.getAccountsTemplateContext(accounts);
				TemplateUtils.getTemplate("accounts_list_row", context, onTemplate);
			};
			
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};

			// use the local or remote service to get accounts
			ServiceProxyFactory.getServiceProxy().getUserAccounts({userId:DataUtils.getLocalStorageData(Constants.LS_KEY_USERID)},
					onAccounts, onError);

			//account row tap handler
			this.$el.on("click", "#accountsList .account", function(){
				if(self._onSelectToPage) {
					if($(this).find("a").length > 0){ //if not total row
						var context = null;
						var accountId = $(this).attr("data-id");
						accountsCollection.each(function(account){
							if(accountId == account.get("id")){ // the selected row
								context = {accountId: account.get("accountId"), name: encodeURI(account.get("accountName")),
						   				accountNum: account.get("accountNum"), amount: Utils.convertNumberToCurrency(account.get("balance")),
						   				categoryId: account.get("category")};
								return false;
							}
						});
						var data = {account: context};
						$.mobile.changePage(self._onSelectToPage, {data: data});
					}
				} else {
					history.back();
				}
				return false;
			});

			//add a account
			this.$el.on("click", "#addAccountBtn", function(){
				self._showUnsupportedMessage();
				return false;
			});

			//render the side menu
			new SideMenuPanel({el: this.$el.find("#menuPanel"), currentPageId: "#accounts"});

			return this; //Maintains chainability
		},

		/**
		 * alert unsupported message when the function is not provide.
		 * @param none
		 */
		_showUnsupportedMessage: function() {
			var message = Utils.getTranslation("%common.feature.unavailable%");
			Utils.showAlert(message, null);
		},

		 /**
		 * do cleanup
		 * @param none
		 */
		dispose: function() {
			PageView.prototype.dispose.call(this);
		},

	});

	// Returns the View class
	return AccountsPageView;
});