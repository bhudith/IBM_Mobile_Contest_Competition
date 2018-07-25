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
		"com/utils/DataUtils",
		
	], function($, Backbone, Constants, DataUtils ) 
	{
	var AdapterUtils = Backbone.Model.extend({},
	{
		/**
		 * initialize localization
		 * load all culture files
		 * @param onInitialized, function
		 */
		initLocalization: function(onInitialized){
			
		},
		
		/**
		 * check deposit cheque
		 * @param args, account info
		 * @param onSuccess, function to handle the receive data
		 * @param onError, function to deal the error situation
		 */
		checkDepositCheque: function(args, onSuccess, onError){
			var timeoutvalue = DataUtils.getLocalStorageData(Constants.LS_KEY_BPM_TIMEOUT);
			if(!timeoutvalue){
				timeoutvalue = Constants.DEFAULT_BPM_TIMEOUT;
			}
			
			this.invokeAdapter({adapter: Constants.LS_KEY_DEPOSIT_CHECK_ADAPTER,
				procedure: Constants.LS_KEY_CHECK_DEPOSIT_CHEQUE,
				parameters: args, 
				timeout: timeoutvalue, 
				onSuccess: onSuccess,
				onError: onError});
		},
		
		/**
		 * transfer fund
		 * @param args, account info
		 * @param onSuccess, function to handle the receive data
		 * @param onError, function to deal the error situation
		 */
		transferFunds: function(args, onSuccess, onError){
			this.invokeAdapter({adapter: Constants.LS_KEY_TRANSACTION_ADAPTER,
				procedure: Constants.LS_KEY_TRANSFER_FUNDS,
				parameters: args, 
				onSuccess: onSuccess,
				onError: onError});
		},
		
		/**
		 * load the user's transaction data
		 * @param args, account info
		 * @param onSuccess, function to receive a TransactionModelsCollection
		 * @param onError, function to deal the error situation
		 */
		getUserTransactions: function(args, onSuccess, onError){
			this.invokeAdapter({adapter: Constants.LS_KEY_TRANSACTION_ADAPTER,
				procedure: Constants.LS_KEY_GET_TRANSACTION_BY_ACCOUNT_ID,
				parameters: args, 
				onSuccess: onSuccess,
				onError: onError});
		},
		
		/**
		 * load the user's account data
		 * @param args, user info
		 * @param onSuccess, function to receive an AccountModel
		 * @param onError, function to deal the error situation
		 */
		getUserAccount: function(args, onSuccess, onError){
			this.invokeAdapter({adapter: Constants.LS_KEY_ACCOUNT_ADAPTER,
				procedure: Constants.LS_KEY_GET_ACCOUNT_BY_USER_ID_AND_ACCOUNT_NUM,
				parameters: args, 
				onSuccess: onSuccess,
				onError: onError});
		},
		
		/**
		 * load the user's accounts data
		 * @param args, user info
		 * @param onSuccess, function to receive an AccountModelsCollection
		 * @param onError, function to deal the error situation
		 */
		getUserAccounts: function(args, onSuccess, onError){
			this.invokeAdapter({adapter: Constants.LS_KEY_ACCOUNT_ADAPTER,
				procedure: Constants.LS_KEY_GET_ACCOUNT_BY_USER_ID,
				parameters: args, 
				onSuccess: onSuccess,
				onError: onError});
		},
		
		/**
		 * login
		 * @param args, user info
		 * @param onSuccess, function to change page and store info
		 * @param onError, function to change page and store info
		 */
		login: function(args, onSuccess, onError){
			this.invokeAdapter({adapter: Constants.LS_KEY_USER_ADAPTER,
				procedure: Constants.LS_KEY_LOGIN,
				parameters: args, 
				onSuccess: onSuccess,
				onError: onError});
		},
		
		/**
		 * logout
		 * @param args, user info
		 * @param onSuccess, function to change page and reset data storage
		 * @param onError, function to change page and reset data storage
		 */
		logout: function(args, onSuccess, onError){
			this.invokeAdapter({adapter: Constants.LS_KEY_USER_ADAPTER,
				procedure: Constants.LS_KEY_LOGOUT,
				parameters: args, 
				onSuccess: onSuccess,
				onError: onError});
		},
		
		/**
		 * invokeAdapter
		 * @param options, invoked adapter name , procedure name, arguments and callback functions
		 */
		invokeAdapter: function(options){
			var onResponse = function(response) {
				if(response.invocationResult.errorCode == 0 && options.onSuccess){
					options.onSuccess(response);
				} else{
					// show error message
					if(options.onError)
						options.onError(response);
				}
			};
			//connect time out handle
		    var onTimeoutHandler = function(result){
		    	options.onSuccess(result);
		    };
		    
			var invocationData = {
					adapter: options.adapter,
					procedure: options.procedure,
					parameters: options.parameters
			};
			
			var timeoutvalue = options.timeout;
			if(!timeoutvalue){
				timeoutvalue = Constants.DEFAULT_TIMEOUT;
			}
			timeoutvalue = Number(timeoutvalue)*1000;
			WL.Client.invokeProcedure(invocationData, {
				onSuccess : onResponse,
				timeout : timeoutvalue,
				onFailure : onTimeoutHandler
			});
		},
	});
	return AdapterUtils; 
	}
);