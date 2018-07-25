
/* JavaScript content from js/com/views/TransactionsPageView.js in folder common */
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
		"com/models/TransactionModel",
		"com/collections/TransactionModelsCollection",
		"com/views/PageView",
		"com/utils/DataUtils",
		"com/utils/Utils",
		"com/utils/TemplateUtils",
		"com/utils/AdapterUtils",

	], function( $, Backbone, Constants, ServiceProxyFactory, TransactionModel, TransactionModelsCollection, PageView, DataUtils, Utils, TemplateUtils, AdapterUtils) {

	// Extends PagView class
	var TransactionsPageView = PageView.extend({

		_onSelectToPage: "", //url to redirect the user after a transaction is selected, default is to go back

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			PageView.prototype.initialize.call(this, options);

			var self = this;
			this._onSelectToPage = options && options.data && options.data.onSelectToPage ? options.data.onSelectToPage : "";

			//render view on pageshow event
			this.$el.on("pageshow", function(){
				var account = options && options.data && options.data.account ? options.data.account : null;
				self.render(account);
			});
		},

		/**
		 * Renders UI for page
		 * @param account, object
		 */
		render: function(account) {
			PageView.prototype.render.call(this);

			var self = this;

			//Render account info
			var onTemplate = function(html) {
				self.$el.find("#accountInfo").html(html);
			};
			var context =  {id: account.accountId, name: decodeURI(account.name),
	   				accountNum: account.accountNum, amount: account.amount
			};
			var params = {account:context};
			TemplateUtils.getTemplate("transactions_account_info", params, onTemplate);

			//Use the data-datetime attribute for autodividers when generating list view for transactions
			this.$el.find( "#transactionsList" ).listview({
				autodividers: true,

				autodividersSelector: function ( li ) {
					return $(li).attr("data-datetime");
				}
			});

			//Render transaction list
			var onTransactionsData = function(transactions) {
				$.mobile.loading("hide");
				var onTemplate = function(html) {
					self.$el.find("#transactionsList").html(html).listview("refresh");
				};

				var items = [];
				transactions.each(function(transaction) {
					console.log("transaction result is "+JSON.stringify(transaction));
					var context = {name: transaction.get("name"), id: transaction.get("transactionId"),
						memo: transaction.get("memo"), datetime: transaction.get("datetime"),
						amount: Utils.convertNumberToCurrency(transaction.get("amount")),
						isCheck: transaction.get("isCheck")};
					items.push(context);
				});

				var params = {transactions: items};
				TemplateUtils.getTemplate("transactions_list_row", params, onTemplate);
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};

			$.mobile.loading("show");

			ServiceProxyFactory.getServiceProxy().getUserTransactions({accountId: account.accountId},
					onTransactionsData,onError);

			//driver tap handler
			this.$el.on("click", "#transactionsList .transaction", function(){
				if($(this).attr("data-is-check") == "true"){
					$.mobile.changePage("view_check.html");
				}else if(self._onSelectToPage) {
					$.mobile.changePage(self._onSelectToPage);
				} else {
					//history.back();
				}
				return false;
			});

			//setup the update(filter) button handler
			self.$el.on("tap", "#filterBtn", function() {
				var filter = self.$el.find("input[type='radio']:checked").val();
				if(filter=="All Transactions"){
					ServiceProxyFactory.getServiceProxy().getUserTransactions({accountId: account.accountId},
							onTransactionsData,onError);
				}else{
					self._filter(filter,account);
				}
			});

			//
			self.$el.on("tap", "#category", function() {
				DataUtils.setLocalStorageData(Constants.LS_KEY_SELECTED_CATEGORY_ACCOUNT,JSON.stringify(account));
				DataUtils.setLocalStorageData(Constants.LS_KEY_CATEGORY_START_DATE,moment().subtract('days', 30).format("MM/DD/YYYY"));
				DataUtils.setLocalStorageData(Constants.LS_KEY_CATEGORY_END_DATE,moment().format("MM/DD/YYYY"));
				DataUtils.setLocalStorageData(Constants.LS_KEY_CATEGORY_CHART_TYPE,"pieChart");
				$.mobile.changePage("spending_by_category.html");
			});

			return this; //Maintains chainability
		},

		/**
		 * filter Credit and Debits
		 * @param filter, filter condition
		 * @param account, associated account
		 */
		_filter: function(filter,account) {
			var self = this;
		   	//Render transaction list
			var onTransactionsData = function(transactions) {
				$.mobile.loading("hide");
				var onTemplate = function(html) {
					self.$el.find("#transactionsList").html(html).listview("refresh");
				};

				var creditsItems = [];
				var debitsItems = [];
				transactions.each(function(transaction) {
					var context = {name: transaction.get("name"), id: transaction.get("transactionId"),
						memo: transaction.get("memo"), datetime: transaction.get("datetime"),
						amount: Utils.convertNumberToCurrency(transaction.get("amount")),
						isCheck: transaction.get("isCheck")};

					if(transaction.get("amount")<=0){
						creditsItems.push(context);
					}else{
						debitsItems.push(context);
					}
				});

				if(filter=="Credits"){
					var creditsParams = {transactions: creditsItems};
					TemplateUtils.getTemplate("transactions_list_row", creditsParams, onTemplate);
				}else{
					var debitsParams = {transactions: debitsItems};
					TemplateUtils.getTemplate("transactions_list_row", debitsParams, onTemplate);
				}
			};
			
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};

			$.mobile.loading("show");

			ServiceProxyFactory.getServiceProxy().getUserTransactions({accountId: account.accountId},
					onTransactionsData,onError);

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
	return TransactionsPageView;

});