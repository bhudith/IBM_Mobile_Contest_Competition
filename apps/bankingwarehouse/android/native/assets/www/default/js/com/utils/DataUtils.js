
/* JavaScript content from js/com/utils/DataUtils.js in folder common */
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
		"com/collections/AccountModelsCollection",
		"com/models/TransactionModel",
		"com/collections/TransactionModelsCollection",
		"com/models/PayeeModel",
		"com/collections/PayeeModelsCollection",
		"com/models/InvestmentModel",
		"com/collections/InvestmentModelsCollection",
		"com/models/MessageModel",
		"com/collections/MessageModelsCollection",
		"com/models/MoneyPayeeModel",
		"com/collections/MoneyPayeeModelsCollection",
		"com/models/AlertPrefModel",
		"com/collections/AlertPrefModelsCollection",		
		
	], function($, Backbone, Constants, AccountModel, AccountModelsCollection, TransactionModel, TransactionModelsCollection, PayeeModel, PayeeModelsCollection, InvestmentModel, InvestmentModelsCollection, MessageModel, MessageModelsCollection,MoneyPayeeModel, MoneyPayeeModelsCollection, AlertPrefModel, AlertPrefModelsCollection) 
	{

	var DataUtils = Backbone.Model.extend({},
	
	{
		
		LOCALIZATION_JSON : "../data/localizations/mapping.json",
		ACCOUNTS_JSON : "../data/accounts.json",
		TRANSACTIONS_JSON : "../data/transactions.json",
		PAYEES_JSON : "../data/payees.json",
		INVESTMENTS_JSON : "../data/investments.json",
		MESSAGES_JSON : "../data/messages.json",
		MONEY_PAYEES_JSON : "../data/moneypayees.json",
		ALERT_PREFS_JSON : "../data/alertprefs.json",
		
		
		/**
		 * load the json data and store in memory
		 * @param file, string path to the file
		 * @param onResultHandler, function to receive the data
		 * @param async, boolean [optional]
		 */
		getJSONData: function(file, onResultHandler, async)
		{
			$.ajax({
				type: "GET",
				url: file,
				async: typeof async == "undefined" ? true : async,
				cache: true,
				dataType: "json",
				success: function(data){
					if(onResultHandler){
						onResultHandler(data);
					}
				},
				error: function(data){
					console.log("Failed to get json data ");
				}
			});	
		},
		
		/**
		 * initialize localization
		 * load all culture files
		 * @param onInitialized, function
		 */
		initLocalization: function(onInitialized)
		{
			var onData = function(mapping)
			{
				var cultureFiles = [];
				for(var language in mapping) 
				{
					var cultureFile = mapping[language].culture;
					if(cultureFile) {
						cultureFiles.push("../../" + cultureFile); //fixing paths for intialization
					}
				}
				
				//load all culture files
				require(cultureFiles, function(){
					if(onInitialized) {
						onInitialized();
					}
				});
			};
			DataUtils.getJSONData(DataUtils.LOCALIZATION_JSON, onData);
		},
		
		/**
		 * load a language file and unload all others
		 * @param language, language code string
		 * @param onLoaded, function
		 */
		loadLanguage: function(language, onLoaded)
		{
			//reset translations for all languages except for the default language
			for(var languageCode in Globalize.cultures) {
				if(languageCode != Constants.SETTINGS_DEFAULT_LANGUAGE) {
					var culture = Globalize.cultures[languageCode];
					culture.messages = {};
				}
			}
			
			//load selected language file into memory if exists
			var onData = function(mapping)
			{
				if(mapping.hasOwnProperty(language)) 
				{
					var languageFile = mapping[language].language;
					if(languageFile) 
					{
						$.getJSON("../" + languageFile, function(data, textStatus, jqXHR){
							Globalize.addCultureInfo(language, { messages: data });
							if(onLoaded) {
								onLoaded();
							}
						}).fail(function(){
							console.log("Language file failed to load for " + language);
						});
					}
					else {
						console.log("No language file found for " + language);
					}
				}
				else {
					console.log("Language not found in mapping: " + language);
				}
			};
			DataUtils.getJSONData(DataUtils.LOCALIZATION_JSON, onData);
		},
		
		/**
		 * get all the loaded cultures in an array sorted alphabetically
		 * @param none
		 * @return cultures, array of Globalize.culture objects
		 */
		getAllCulturesAlphabetically: function()
		{
			var cultures = [];
			for(var languageCode in Globalize.cultures) 
			{
				var culture = Globalize.cultures[languageCode];
				if(languageCode != "default") {
					cultures.push(culture);
				}
			}
			
			function sortAlphabetically(a,b) {
				if (a.language < b.language)
					return -1;
				if (a.language > b.language)
			  		return 1;
				return 0;
			}
			cultures.sort(sortAlphabetically);
			return cultures;
		},
		
		/**
		 * get data from local storage
		 * @param key, string
		 * @return data, string
		 */
		getLocalStorageData: function(key)
		{
			var data = window.localStorage.getItem(Constants.APP_LOCAL_STORAGE_PREFIX + key);
			return data;
		},
		
		/**
		 * set data to local storage
		 * @param key, string
		 * @param value, string
		 */
		setLocalStorageData: function(key, value) {
			window.localStorage.setItem(Constants.APP_LOCAL_STORAGE_PREFIX + key, value);
		},
		
		/**
		 * get the user's account data
		 * @param onAccountsHandler, function to receive an AccountModelsCollection
		 */
		getUserAccounts: function(onAccountsHandler)
		{
			var onData = function(data) {
				var arr = [];
				for(var i in data) {
					var account = new AccountModel(data[i]);
					arr.push(account); 
				}
				
				var accounts = new AccountModelsCollection(arr);				
				if(onAccountsHandler) {
					onAccountsHandler(accounts);
				}
			};
			DataUtils.getJSONData(DataUtils.ACCOUNTS_JSON, onData);
		},
		
		/**
		 * get the user's transaction data
		 * @param onTransactionsHandler, function to receive a TransactionModelsCollection
		 */
		getUserTransactions: function(onTransactionsHandler)
		{
			var onData = function(data) {
				var arr = [];
				for(var i in data) {
					var transaction = new TransactionModel(data[i]);
					arr.push(transaction); 
				}
				var transactions = new TransactionModelsCollection(arr);
				
				if(onTransactionsHandler) {
					onTransactionsHandler(transactions);
				}
			};
			DataUtils.getJSONData(DataUtils.TRANSACTIONS_JSON, onData);
		},
		
		/**
		 * get the user's account data by id
		 * @param accountId, account ID
		 * @param onAccountHandler, function to receive an AccountModel
		 */
		getUserAccountById: function(accountId, onAccountHandler)
		{
			var onData = function(data) {
				data.each(function(account) {
					var id = account.get("accountId");
					if(id == accountId){
						if(onAccountHandler) {
							onAccountHandler(account);
						}
						return;
					}
				});
			};
			DataUtils.getUserAccounts(onData);
		},
		
		
		/**
		 * get the user's payee data by type
		 * @param onPayeesHandler, function to receive a PayeeModelsCollection
		 */
		getPayeesByType: function(type,onPayeesHandler)
		{
			var onData = function(data) {
				var arr = [];
				for(var i in data) {
					var payee = new PayeeModel(data[i]);
					if(payee.get("type") == type){
					  arr.push(payee); 
					}
				}
				
				var payees = new PayeeModelsCollection(arr);				
				if(onPayeesHandler) {
					onPayeesHandler(payees);
				}
			};
			DataUtils.getJSONData(DataUtils.PAYEES_JSON, onData);
		},
		
		/**
		 * get the user's payee data
		 * @param onPayeesHandler, function to receive a PayeeModelsCollection
		 */
		getUserPayees: function(onPayeesHandler)
		{
			var onData = function(data) {
				var arr = [];
				for(var i in data) {
					var payee = new PayeeModel(data[i]);
					arr.push(payee); 
				}
				
				var payees = new PayeeModelsCollection(arr);				
				if(onPayeesHandler) {
					onPayeesHandler(payees);
				}
			};
			DataUtils.getJSONData(DataUtils.PAYEES_JSON, onData);
		},
		
		/**
		 * get the user's payee data by Id
		 * @param payeeId, payee ID
		 * @param onPayeesHandler, function to receive a PayeeModelsCollection
		 */
		getUserPayeeById: function(payeeId, onPayeesHandler)
		{
			var onData = function(data) {
				var result = null;
				data.each(function(payee) {
					var id = payee.get("payeeId");
					if(id == payeeId){
						result = payee;
						
					}
				});
								
				if(onPayeesHandler) {
					onPayeesHandler(result);
				}
			};
			DataUtils.getUserPayees(onData);
		},
		
		/**
		 * get the user's investment data
		 * @param onInvestmentsHandler, function to receive an InvestmentModelsCollection
		 */
		getUserInvestments: function(onInvestmentsHandler)
		{
			var onData = function(data) {
				var arr = [];
				for(var i in data) {
					var investment = new InvestmentModel(data[i]);
					arr.push(investment); 
				}
				
				var investments = new InvestmentModelsCollection(arr);				
				if(onInvestmentsHandler) {
					onInvestmentsHandler(investments);
				}
			};
			DataUtils.getJSONData(DataUtils.INVESTMENTS_JSON, onData);
		},
		
		/**
		 * get the user's messages data
		 * @param onMessagesHandler, function to receive a MessageModelsCollection
		 */
		getMessages: function(onMessagesHandler){
			var onMessages = function(data) {
				var arr = [];
				for(var i in data) {
					var message = new MessageModel(data[i]);
					arr.push(message); 
				}
				
				var messages = new MessageModelsCollection(arr);				
				if(onMessagesHandler) {
					onMessagesHandler(messages);
				}
			};
			
			DataUtils.getJSONData(DataUtils.MESSAGES_JSON, onMessages);
		},
		
		/**
		 * init messages' read state obj, it has two properties: 
		 * newMessageAmount and isReadStateArray
		 * @param onHandler, function to handle the state obj
		 */
		 initMessagesState: function(onHandler){
             var onMessagesHandler = function(messages){
                     var messagesState = { isReadStateArray: [], requireActionArray: [] };
                     for(var i = 0; i < messages.length; i++){
                             messagesState.isReadStateArray.push(1);
                             messagesState.requireActionArray.push(false);
                     };
                     messagesState.requireActionArray[0] = true;
                     messagesState.newMessageAmount = messages.length;
                     
                     if(onHandler){
                             onHandler(messagesState);
                     }
             };
             DataUtils.getMessages(onMessagesHandler);
		 },
		
		/**
		 * get the user's message data by ID
		 * @param messageId, message ID
		 * @param onMessageHandler, function to receive a MessageModel
		 */
		getMessageById: function(messageId, onMessageHandler){
			var onMessages = function(messages) {
				messages.each(function(message){
					if(message.get("messageId") == messageId){
						if(onMessageHandler) {
							onMessageHandler(message);
						}
						return false;
					}
				});
			};
			DataUtils.getMessages(onMessages);
		},
			
			
		/**
		 * get the user's money payee data
		 * @param onPayeesHandler, function to receive a PayeeModelsCollection
		 */
		getUserMoneyPayees: function(onPayeesHandler)
		{
			var onData = function(data) {
				var arr = [];
				for(var i in data) {
					var payee = new MoneyPayeeModel(data[i]);
					arr.push(payee); 
				}
				
				var payees = new MoneyPayeeModelsCollection(arr);				
				if(onPayeesHandler) {
					onPayeesHandler(payees);
				}
			};
			DataUtils.getJSONData(DataUtils.MONEY_PAYEES_JSON, onData);
		},
		
		/**
		 * get the user's payee data by ID
		 * @param payeeId, payee ID
		 * @param onPayeesHandler, function to receive a PayeeModelsCollection
		 */
		getUserMoneyPayeeById: function(payeeId, onPayeesHandler)
		{
			var onData = function(data) {
				var result = null;
				data.each(function(payee) {
					var id = payee.get("payeeId");
					if(id == payeeId){
						result = payee;
						
					}
				});
								
				if(onPayeesHandler) {
					onPayeesHandler(result);
				}
			};
			DataUtils.getUserMoneyPayees(onData);
		},
		
		/**
		 * get the user's alert preferences data
		 * @param onPrefsHandler, function to receive a AlertPrefModelsCollection
		 */
		getUserAlertPrefs: function(onPrefsHandler)
		{
			var onData = function(data) {
				var arr = [];
				for(var i in data) {
					var alertPref = new AlertPrefModel(data[i]);
					arr.push(alertPref); 
				}
				
				var alertPrefs = new AlertPrefModelsCollection(arr);				
				if(onPrefsHandler) {
					onPrefsHandler(alertPrefs);
				}
			};
			DataUtils.getJSONData(DataUtils.ALERT_PREFS_JSON, onData);
		},
		
	});

	return DataUtils;

}); 
