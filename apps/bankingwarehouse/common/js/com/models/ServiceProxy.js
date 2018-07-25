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
		"com/models/Constants",
		"com/models/PayeeModel",
		"com/collections/PayeeModelsCollection",
		"com/models/InvestmentModel",
		"com/collections/InvestmentModelsCollection",
		"com/models/MoneyPayeeModel",
		"com/collections/MoneyPayeeModelsCollection",
		
	], function( $, Backbone, Moment, DataUtils, Constants, PayeeModel, PayeeModelsCollection, InvestmentModel, InvestmentModelsCollection ){

    var ServiceProxy = Backbone.Model.extend({
    	/**
		 * transferFund
		 * @param accountInfo, account info
		 * @param onTransferHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	transferFunds: function(accountsInfo, onTransferHandler,onErrorHandler){
		},
		
    	/**
		 * payBill
		 * @param accountInfo, account info
		 * @param onTransferHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	payBill: function(accountInfo, onTransferHandler,onErrorHandler){
		},
		
    	/**
		 * sendMoney
		 * @param accountInfo, account info
		 * @param onTransferHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	sendMoney: function(accountInfo, onTransferHandler,onErrorHandler){
		},
		
		
    	/**
		 * getPayeesByType
		 * @param payeeInfo, payee info
		 * @param onPayeeHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	getPayeesByType: function(payeeInfo, onPayeeHandler,onErrorHandler){
		},
		
	   	/**
		 * getPayeeByPayeeId
		 * @param payeeId
		 * @param onPayeeHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
    	getPayeeByPayeeId: function(payeeId, onPayeeHandler,onErrorHandler){
		},
		
	   	/**
		 * getPrefByAccountId
		 * @param accountId
		 * @param onPrefHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
		getPrefByAccountId: function(accountId, onPrefHandler,onErrorHandler){
		},
		
	   	/**
		 * updatePref
		 * @param prefInfo
		 * @param onPrefHandler, function to handle the receive data
		 * @param onErrorHandler, function to handler error
		 */
		updatePref: function(prefInfo, onPrefHandler,onErrorHandler){
		},
		
		
		/**
		 * load the user's transaction data within an account
		 * @param accountInfo, account info
		 * @param onTransactionsHandler, function to receive a TransactionModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserTransactions: function(accountInfo, onTransactionHandler,onErrorHandler){
		},
		
		/**
		 * query the user's transaction data within an account and date range
		 * @param accountInfo, a map contains query parameters including accountId, startDate and endDate
		 * @param onTransactionsHandler, function to receive a TransactionModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserTransactionsByDatetime: function(accountInfo, onTransactionHandler,onErrorHandler){
		},
		
		/**
		 * load the user's account data
		 * @param userInfo, user info
		 * @param onAccountsHandler, function to receive an AccountModel
		 * @param onErrorHandler, function to handler error
		 */
		getUserAccount: function(userInfo, onAccountHandler,onErrorHandler){
		},
		
		/**
		 * load the user's accounts data
		 * @param userInfo, user info
		 * @param onAccountHandler, function to receive an AccountModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserAccounts: function(userInfo, onAccountHandler,onErrorHandler){
		},
		
		
		/**
		 * load the user's payee data
		 * @param onPayeesHandler, function to receive a PayeeModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserPayees: function(onPayeesHandler,onErrorHandler)
		{
			DataUtils.getUserPayees(onPayeesHandler);
		},
		
		/**
		 * load the user's payee data by Id
		 * @param onPayeesHandler, function to receive a PayeeModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserPayeeById: function(payeeId, onPayeesHandler,onErrorHandler)
		{
			DataUtils.getUserPayeeById(payeeId, onPayeesHandler);
		},
		
		/**
		 * load the user's investment data
		 * @param onInvestmentsHandler, function to receive an InvestmentModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserInvestments: function(onInvestmentsHandler,onErrorHandler)
		{
			DataUtils.getUserInvestments(onInvestmentsHandler);
		},
		
				/**
		 * load the user's money payee data
		 * @param onPayeesHandler, function to receive a MoneyPayeeModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserMoneyPayees: function(onPayeesHandler,onErrorHandler)
		{
			DataUtils.getUserMoneyPayees(onPayeesHandler);
		},
		
		/**
		 * load the user's money payee data by Id
		 * @param onPayeesHandler, function to receive a MoneyPayeeModelsCollection
		 * @param onErrorHandler, function to handler error
		 */
		getUserMoneyPayeeById: function(payeeId, onPayeesHandler,onErrorHandler)
		{
			DataUtils.getUserMoneyPayeeById(payeeId, onPayeesHandler);
		},
		
		/**
		 * check deposit cheque from bpm server
		 * 
		 */
		 checkDepositInfo: function(depositInfo, onSuccessHandler, onErrorHandler)
		 {
			// 
		 },
		 
    }, {
    	PAYEES_JSON : "../data/payees.json",
		INVESTMENTS_JSON : "../data/investments.json",
		MONEY_PAYEES_JSON : "../data/moneypayees.json",
    });

    return ServiceProxy;

});