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
		"moment",
		"com/utils/DataUtils",
		"com/utils/AdapterUtils",
		"com/models/ServiceProxy",
		"com/models/Constants",
		"com/models/AccountModel",
		"com/collections/AccountModelsCollection",
		"com/models/TransactionModel",
		"com/collections/TransactionModelsCollection",
		"com/models/PayeeModel",
		"com/collections/PayeeModelsCollection",
		"com/models/MessageModel",
		"com/collections/MessageModelsCollection",
		"com/models/AlertPrefModel",
		"com/collections/AlertPrefModelsCollection",
		"com/utils/Utils",
				
	], function( $, Backbone, Moment, DataUtils, AdapterUtils, ServiceProxy, Constants, AccountModel, AccountModelsCollection, TransactionModel, TransactionModelsCollection, PayeeModel, PayeeModelsCollection, MessageModel, MessageModelsCollection, AlertPrefModel, AlertPrefModelsCollection, Utils )
	{

    var RemoteServiceProxy = ServiceProxy.extend({
    	/**
		 * transfer fund
		 * @param accountsInfo, account info
		 * @param onTransferHandler, function to handle the received transfer result
		 * @param onErrorHandler, function to handler error
		 */
    	transferFunds: function(accountsInfo, onTransferHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("transferFunds response = "+response.statusMessage);
        		if(response.errorCode=="0")
        		onTransferHandler();
        		else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
        		
			};
			
			var accountId = accountsInfo.accountId;
			console.log("accountId = "+accountId);
			accountsInfo.category = "OTHERS";
			this.invokeService("/accounts/transferFund/"+accountId, "PUT", accountsInfo, onResponse);
		},
		
    	/**
		 * pay bill
		 * @param accountInfo, account info
		 * @param onTransferHandler, function to handle the pay bill result
		 * @param onErrorHandler, function to handler error
		 */
    	payBill: function(accountInfo, onTransferHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("payBill response = "+response.statusMessage);
        		if(response.errorCode=="0")
            		onTransferHandler();
        		else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			var accountId = accountInfo.accountId;
			console.log("accountId = "+accountId);
			accountInfo.category = "HOME";
			this.invokeService("/accounts/payBill/"+accountId, "PUT", accountInfo, onResponse);
		},
		
    	/**
		 * send money
		 * @param accountInfo, account info
		 * @param onTransferHandler, function to handle the send money result
		 * @param onErrorHandler, function to handler error
		 */
    	sendMoney: function(accountInfo, onTransferHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("sendMoney response = "+response.statusMessage);
        		if(response.errorCode=="0")
            		onTransferHandler();
        		else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			var accountId = accountInfo.accountId;
			console.log("accountId = "+accountId);
			accountInfo.category = "OTHERS";
			this.invokeService("/accounts/sendMoney/"+accountId, "PUT", accountInfo, onResponse);
		},
		
    	/**
		 * deposit check
		 * @param accountInfo, account info
		 * @param onTransferHandler, function to handle the send money result
		 * @param onErrorHandler, function to handler error
		 */
    	depositCheck: function(accountInfo, onTransferHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("depositCheck response = "+response.statusMessage);
        		if(response.errorCode=="0")
            		onTransferHandler();
        		else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			var accountId = accountInfo.accountId;
			console.log("accountId = "+accountId);
			this.invokeService("/accounts/depositCheck/"+accountId, "PUT", accountInfo, onResponse);
		},
		
    	/**
		 * get payees by type
		 * @param payeeInfo, payee info
		 * @param onPayeeHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	getPayeesByType: function(payeeInfo, onPayeeHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("getPayeesByType = "+response.statusMessage);
        		var payeeArr = [];
				for(var i in response.data) {
					var payee = response.data[i];
					payeeArr.push(new PayeeModel(payee)); 
				}
				if(response.errorCode=="0")
				onPayeeHandler(new PayeeModelsCollection(payeeArr));
				else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			var type = payeeInfo.type;
			var userId = payeeInfo.userId;
			console.log("type = "+type);
			console.log("userId = "+userId);
			this.invokeService("/payees/users/"+userId+"?type="+type, "get", {}, onResponse);
		},
		
		/**
		 * get payee by ID
		 * @param payeeId
		 * @param onPayeeHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
		getPayeeByPayeeId: function(payeeId, onPayeeHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("getPayeeByPayeeId  = "+response.statusMessage);
        		       		
        		if(response.errorCode=="0")
        			onPayeeHandler(new PayeeModel(response.data));
        		else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			console.log("payeeId = "+payeeId);
			this.invokeService("/payees/"+payeeId, "get", {}, onResponse);
		},
		
	   	/**
		 * get account alert preferences by account ID
		 * @param accountId, account ID
		 * @param onPrefHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
		getPrefByAccountId: function(accountId, onPrefHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("getPrefByAccountId  = "+response.statusMessage);
        		var prefArr = [];
				for(var i in response.data) {
					var pref = response.data[i];
					prefArr.push(new AlertPrefModel(pref)); 
				}
				if(response.errorCode=="0")
				onPrefHandler(new AlertPrefModelsCollection(prefArr));
				else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			console.log("accountId = "+accountId);
			this.invokeService("/preferences/accounts/"+accountId, "get", {}, onResponse);
		},
		
	   	/**
		 * update preference
		 * @param prefInfo, preference info
		 * @param onPrefHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
		updatePref: function(prefInfo, onPrefHandler,onErrorHandler){
        	var onResponse = function(response) {
        		console.log("updatePref  = "+response.statusMessage);
        		if(response.errorCode=="0")
        			onPrefHandler();
        		else if(onErrorHandler){
        			onErrorHandler (response.errorCode, response.statusMessage);
        		}
			};
			
			var prefId = prefInfo.prefId;
			console.log("prefId = "+prefId);
			this.invokeService("/preferences/"+prefId, "put", prefInfo, onResponse);
		},
		/**
		 * load the user's transaction data
		 * @param accountInfo, account info
		 * @param onTransactionsHandler, function to receive a TransactionModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserTransactions: function(accountInfo, onTransactionHandler,onErrorHandler){
    		var onSuccess = function(response) {
    			console.log("transaction = "+response.statusMessage);
    			
				var arr = [];
				for(var i in response.data) {
					var transaction = new TransactionModel(response.data[i]);
					arr.push(transaction); 
				}
				
				if(onTransactionHandler){
					onTransactionHandler(new TransactionModelsCollection(arr));
				}
				else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			var accountId = accountInfo.accountId;
			console.log("Account Id = "+accountId);
			this.invokeService("/transactions?accountId="+accountId, "GET", {}, onSuccess);	
		},
		
		/**
		 * query the user's transaction data within an account and date range
		 * @param accountInfo, a map contains query parameters including accountId, startDate and endDate
		 * @param onTransactionsHandler, function to receive a TransactionModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserTransactionsByDatetime: function(accountInfo, onTransactionHandler,onErrorHandler){
    		var onSuccess = function(response) {
    			console.log("transaction = "+response.statusMessage);
    			
				var arr = [];
				for(var i in response.data) {
					var transaction = new TransactionModel(response.data[i]);
					arr.push(transaction); 
				}
				
				if(onTransactionHandler){
					onTransactionHandler(new TransactionModelsCollection(arr));
				}
				else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			
			var accountId = accountInfo.accountId;
			
			var startDate = moment(accountInfo.startDate).format("YYYY-MM-DD");
			var endDate = moment(accountInfo.endDate).format("YYYY-MM-DD");
			console.log("Account Id = "+accountId+" startDate = "+startDate+" endDate = "+endDate);
			this.invokeService("/transactions?accountId="+accountId+"&startTime="+startDate+"&endTime="+endDate, "GET", {}, onSuccess);	
		},
		 
		/**
		 * load the user's accounts data
		 * @param userInfo, user info
		 * @param onAccountHandler, function to receive an AccountModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserAccounts: function(userInfo, onAccountHandler,onErrorHandler){
        	var onSuccess = function(response) {
        		console.log("user account response = "+response.statusMessage);
        		var accountArr = [];
				for(var i in response.data) {
					var account = response.data[i];
					accountArr.push(new AccountModel(account)); 
				}
				if(response.errorCode=="0")
				onAccountHandler(new AccountModelsCollection(accountArr));
				else if(onErrorHandler){
        			onErrorHandler(response.errorCode, response.statusMessage);
        		}
			};
			var userId = userInfo.userId;
			console.log("user ID = "+userId);
			this.invokeService("/accounts?userId="+userId, "GET", {}, onSuccess);
		},
		
	    /**
		 * deposit check
		 * 
		 * @param userInfo, user info
		 * @param onCheckHandler, function to handle deposit check result
		 */
		checkDepositInfo: function(depositInfo, onSuccessHandler, onErrorHandler){
			var onSuccess = function(response){
				var jsonStr = response.replace("NaN","\"NaN\"");
				console.log("response == "+jsonStr);
				if(onSuccessHandler){
					onSuccessHandler(jsonStr);
				}
			};
			
			console.log("deposit info is  "+JSON.stringify(depositInfo));
			var contentType = "text";
			
			this.invokeService("/bpm/checkDepositCheque", "POST", depositInfo, onSuccess, true, contentType, onErrorHandler);
        },

		
		/**
		 * invoke backend service
		 * 
		 * @param url, rest service url to be invoked
		 * @param method, method used for the request, e.g., get, post, delete, etc.
		 * @param params, parameters to be sent with the request
		 * @param onResponseHandler, function to handle response from the server
		 * @param async, if use async onvocation
		 * 
		 */
		invokeService: function(url, method, params, onResponseHandler, async, contentType, onErrorHandler){
			console.log("accept = "+Constants.DEFAULT_REST_SERVICE_ACCEPT_HEADER);
			if(!Utils.isConnectionAvailable()){
				var self = this;
				$.mobile.loading("hide");
				
				var message = Utils.getTranslation("%common.network.unavailable%");
				var title = Utils.getTranslation("%common.network.unavailable.title%");
				var onYes = function(){		
					self.invokeService(url, method, params, onResponseHandler, async, contentType, onErrorHandler );
				};
				
				var onNo = function(){	
					if(onErrorHandler){
					   onErrorHandler("noconnection", message);
					};					
				};
				
				
				Utils.showConfirmationAlert(message, onYes, onNo, title, "Cancel,Retry");
			}else{
	        	var usingServerId = DataUtils.getLocalStorageData(Constants.LS_KEY_USING_SERVER_ID);
	        	if(!usingServerId){
	        		usingServerId = Constants.DEFAULT_USING_SERVER_ID;
	                DataUtils.setLocalStorageData(Constants.LS_KEY_USING_SERVER_ID, usingServerId);
	        	}
				var baseUrl = null;
				if(usingServerId == 1){
		        	var apiServer = DataUtils.getLocalStorageData(Constants.LS_KEY_API_SERVER_ADDRESS);
		        	if(!apiServer){
		        		apiServer = Constants.DEFAULT_API_SERVER_ADDRESS;
		                DataUtils.setLocalStorageData(Constants.LS_KEY_API_SERVER_ADDRESS, apiServer);
		        	}
		        	
		        	var apiPort = DataUtils.getLocalStorageData(Constants.LS_KEY_API_SERVER_PORT);
		        	if(!apiPort){
		        		apiPort = Constants.DEFAULT_API_SERVER_PORT;
		                DataUtils.setLocalStorageData(Constants.LS_KEY_API_SERVER_PORT, apiPort);
		        	}
					baseUrl = "http://"+apiServer+":"+apiPort;
				}else{
			       	var bluemixServer = DataUtils.getLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_ADDRESS);	        	
		        	var bluemixPort = DataUtils.getLocalStorageData(Constants.LS_KEY_BLUEMIX_SERVER_PORT);
		        	baseUrl = "http://"+bluemixServer+":"+bluemixPort;
				}
				
				console.log("api path = "+baseUrl+url);
                console.log("method = "+method);

				$.ajax({
					type: method,
					url: baseUrl+url,
					async: typeof async == "undefined" ? true : async,
							   cache: true,
					timeout: parseInt(DataUtils.getLocalStorageData(Constants.LS_KEY_CONNECT_TIMEOUT))*1000,
					dataType: typeof contentType == "undefined" ?"json":contentType,
					data: params,
					beforeSend: function(xhr){						    
						xhr.setRequestHeader("Accept",Constants.DEFAULT_REST_SERVICE_ACCEPT_HEADER);
					},
					success: function(data){
						if(onResponseHandler){
							onResponseHandler(data);
						}
					},
					error: function(data, errorCode){
						console.log("Failed to get data ");
						$.mobile.loading("hide");
						var message = errorCode == "timeout"?"Connection timeout":"System error connecting to backend service.";
						if(onErrorHandler){
							   onErrorHandler(errorCode , message);
							}else{ 		 
						      Utils.showAlert(message);
							}
					}
				});
			}
		},
		
    });

    return RemoteServiceProxy;

});