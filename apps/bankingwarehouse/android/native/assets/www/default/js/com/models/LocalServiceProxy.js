
/* JavaScript content from js/com/models/LocalServiceProxy.js in folder common */
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
		"com/models/ServiceProxy",
		"com/utils/DataUtils",
		"com/utils/Utils",
		"com/collections/TransactionModelsCollection",
		
	], function( $, Backbone, Moment, ServiceProxy, DataUtils, Utils, TransactionModelsCollection ){

    var LocalServiceProxy = ServiceProxy.extend({
		/**
		 * transfer funds from one account to another
         * @param accountsInfo, account info, omitted because LocalServiceProxy uses static data 
         * @param onTransferHandler, call function on transfer complete
         * @param onErrorHandler, function to handler error
         */
    	transferFunds: function(accountsInfo, onTransferHandler, onErrorHander){
    		if(onTransferHandler){
    			onTransferHandler();
    		}
    		else if(onErrorHandler){
    			onErrorHandler(response.statusCode, response.statusMessage);
    		}
		},
		
	  	/**
		 * payBill
		 * @param accountInfo, account info
		 * @param onTransferHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	payBill: function(accountInfo, onTransferHandler, onErrorHander){
    		if(onTransferHandler){
    			onTransferHandler();
    		}
    		else if(onErrorHandler){
    			onErrorHandler(response.statusCode, response.statusMessage);
    		}
		},
		
    	/**
		 * sendMoney
		 * @param accountInfo, account info
		 * @param onTransferHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	sendMoney: function(accountInfo, onTransferHandler, onErrorHander){
    		if(onTransferHandler){
    			onTransferHandler();
    		}
    		else if(onErrorHandler){
    			onErrorHandler(response.statusCode, response.statusMessage);
    		}
		},
		
    	/**
		 * getPayeesByType
		 * @param payeeInfo, payee info
		 * @param onPayeeHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	getPayeesByType: function(payeeInfo, onPayeeHandler, onErrorHander){
    	   if(onPayeeHandler)
           DataUtils.getPayeesByType(payeeInfo.type,onPayeeHandler);
           else if(onErrorHandler){
   			onErrorHandler(response.statusCode, response.statusMessage);
   		}
		},
		
   	/**
		 * getPayeeByPayeeId
		 * @param payeeId
		 * @param onPayeeHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	getPayeeByPayeeId: function(payeeId, onPayeeHandler, onErrorHander){
    		 if(onPayeeHandler)
           DataUtils.getUserPayeeById(payeeId,onPayeeHandler);
    		 else if(onErrorHandler){
    	   			onErrorHandler(response.statusCode, response.statusMessage);
		}
    	},
		
    	/**
		 * getPrefByAccountId
		 * @param accountId
		 * @param onPayeeHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
		getPrefByAccountId: function(accountId, onPrefHandler, onErrorHander){
			if(onPrefHandler)
			DataUtils.getUserAlertPrefs(onPrefHandler);
			else if(onErrorHandler){
	   			onErrorHandler(response.statusCode, response.statusMessage);
		}
		},		
		
	   	/**
		 * updatePref
		 * @param prefInfo
		 * @param onPrefHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
		updatePref: function(prefInfo, onPrefHandler, onErrorHander){
			if(onPrefHandler){
				onPrefHandler();
			}
			else if(onErrorHandler){
	   			onErrorHandler(response.statusCode, response.statusMessage);
			}
		},
		
		
		/**
		 * get user transactions 
         * @param accountInfo, account info, omitted because LocalServiceProxy uses static data 
         * @param onTransactionHandler, function to handle the received transactions
         * @param onErrorHandler, function to handler error
         */
		getUserTransactions: function(accountInfo, onTransactionHandler, onErrorHander){
			if(onTransactionHandler)
			DataUtils.getUserTransactions(onTransactionHandler);
			else if(onErrorHandler){
	   			onErrorHandler(response.statusCode, response.statusMessage);
		}
		},
		
		/**
		 * query the user's transaction data within an account and date range
		 * @param accountInfo, a map contains query parameters including accountId, startDate and endDate
		 * @param onTransactionsHandler, function to receive a TransactionModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserTransactionsByDatetime: function(accountInfo, onTransactionHandler, onErrorHander){
			var startDate = accountInfo.startDate;
			var endDate = accountInfo.endDate;
			console.log("startDate = "+startDate+" endDate = "+endDate);
			var onTransactionsData = function(transactions)	{
				var result = [];

				transactions.each(function(transaction) {
					 var date = moment(transaction.get("datetime")).format("YYYY-MM-DD");		
					 if((Utils.validateDate(date, startDate, endDate))&&(transaction.get("amount")<0)){
						 result.push(transaction);
					  }
				});
				
				if(onTransactionHandler){
					onTransactionHandler(new TransactionModelsCollection(result));
				}
				else if(onErrorHandler){
		   			onErrorHandler(response.statusCode, response.statusMessage);
			}
			};
			
			DataUtils.getUserTransactions(onTransactionsData);
		},
		
		/**
		 * get the user's messages data
		 * @param userInfo, user info
		 * @param onMessagesHandler, function to receive a MessageModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getMessages: function(userInfo, onMessagesHandler, onErrorHander){
			if(onMessagesHandler)
			DataUtils.getMessages(onMessagesHandler);
			else if(onErrorHandler){
	   			onErrorHandler(response.statusCode, response.statusMessage);
		}
		},
		
		/**
		 * get the user's message data by ID
		 * @param messageId, message ID
		 * @param onMessageHandler, function to receive a MessageModel
		 * @param onErrorHandler, function to handler error
		 */
		getMessageById: function(messageId, onMessageHandler, onErrorHander){	
			if(onMessageHandler){
				DataUtils.getMessageById(messageId, onMessageHandler);
			}else if(onErrorHandler){
	   			onErrorHandler(response.statusCode, response.statusMessage);
			}
		},
		
		/**
		 * delete user's message data by ID
		 * @param messageId, message ID
		 * @param onMessageHandler, function to handle delete completion
		 * @param onErrorHandler, function to handler error
		 */
		deleteMessageById: function(messageId, onDeletionHandler, onErrorHander){	
			if(onDeletionHandler){
				onDeletionHandler();
			}
			else if(onErrorHandler){
	   			onErrorHandler(response.statusCode, response.statusMessage);
		}
		},
		
		/**
		 * init messages' read state obj, it has two properties: 
		 * newMessageAmount and isReadStateArray
		 * @param userInfo, user info 
		 * @param onHandler, function to handle the state obj
		 * @param onErrorHandler, function to handler error
		 */
		 initMessagesState: function(userInfo, onHandler,onErrorHandler){	
             var onMessagesHandler = function(messages){
            	 var messagesState = { indexMap: {}, isReadStateArray: [], requireActionArray: [], deleteFlagArray: [] };
            	 
                 var index = 0;
                 var unreadTotal = 0;
                 messages.each(function(message) {
                	 messagesState.indexMap[message.get("messageId")+""] = index;
                     messagesState.isReadStateArray.push(message.get("isRead") ? 0 : 1);
                     messagesState.requireActionArray.push(message.get("requiredAction"));    
                     messagesState.deleteFlagArray.push(false);
                     
                     if(!message.get("isRead")){
                    	 unreadTotal++;
                     }
                     
                     index++;
				 });
                 
                 messagesState.newMessageAmount = unreadTotal;
                 
                 if(onHandler){
                         onHandler(messagesState);
                 }
                 else if(onErrorHandler){
         			onErrorHandler(response.statusCode, response.statusMessage);
         		}
	         };
	         
	         this.getMessages(userInfo, onMessagesHandler);			 
		 },
		
		/**
		 * get user account by account number
         * @param userInfo, user info
         * @param onAccountHandler, function to handle the received account
         * @param onErrorHandler, function to handler error
         */
		getUserAccount: function(userInfo, onAccountHandler, onErrorHander){
			var onData = function(data) {
				data.each(function(account) {
					var num = account.get("accountNum");
					if(num == userInfo[1]){ // userInfo[1] is the account number
						if(onAccountHandler) {
							onAccountHandler(account);
						}
						else if(onErrorHandler){
				   			onErrorHandler(response.statusCode, response.statusMessage);
					}
						return;
					}
				});
			};
			this.getUserAccounts(null, onData);
		},
		
		/**
		 * get user accounts
         * @param userInfo, user info, omitted because LocalServiceProxy uses static data 
         * @param onAccountHandler, function to handle the received accounts
         * @param onErrorHandler, function to handler error
         */
		getUserAccounts: function(userInfo, onAccountHandler, onErrorHander){
			DataUtils.getUserAccounts(onAccountHandler);
		},
		
		/**
		 * user login
         * @param userInfo, user info, omitted because LocalServiceProxy doesn't use it to access backend service
         * @param onLoginHandler, function to handle the login result
         * @param onErrorHandler, function to handler error
         */
		login: function(userInfo, onLoginHandler, onErrorHander){
			if(onLoginHandler){
				onLoginHandler();
			}
			else if(onErrorHandler){
	   			onErrorHandler(response.statusCode, response.statusMessage);
		}
		},
		
		/**
		 * user logout
         * @param userInfo, user info, omitted because LocalServiceProxy doesn't use it to access backend service
         * @param onLogoutHandler, function to handle the logout result
         * @param onErrorHandler, function to handler error
         */
		logout: function(userInfo, onLogoutHandler, onErrorHander){
			if(onLogoutHandler){
				onLogoutHandler();
			}
			else if(onErrorHandler){
	   			onErrorHandler(response.statusCode, response.statusMessage);
		}
		},
		
    });
    
    return LocalServiceProxy;

});