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
	
], function($, Backbone) {

    // The Model constructor
    var Constants = Backbone.Model.extend({},
	    {
	    	PASSCODE : "ibmwl", 
	    	FOLDER_TEMPLATES : "../templates/",
			EXTENSION_TEMPLATES : ".handlebars",
			DEFAULT_PAGE_TRANSITION : "slide",
			DEFAULT_WINDOW_RESIZE_DELAY : 250, //default time to wait until handling the window resize event
			ALPHABETS : "abcdefghijklmnopqrstuvwxyz",
			DEFAULT_USER_LAT : 41.8782,
    		DEFAULT_USER_LNG : -87.6297,
    		CONTACTS_FILTER : "ibm",
    		
    		DEFAULT_TIMEOUT: 30,
    		
    		DEFAULT_REST_SERVICE_BASE_URL: "http://9.123.104.103:4002", //base URL to backend services
    		DEFAULT_REST_SERVICE_ACCEPT_HEADER: "application/com.ibm.mobilecoc.retailbanking-v1.0+json",  //accept value in the request header    		
    		DEFAULT_COMMON_ACCEPT_HEADER: "application/com.ibm.mobilecoc.common-v1.0+json", 
    		REST_SERVICE_RESPONSE_CODE_OK: "0", // code for successful response
    			
			/**** page view classes need to be added here so they can be loaded before being initialized ****/
			VIEW_CLASSES : [
				"com/views/SplashPageView",
				"com/views/IndexPageView",
				"com/views/LoginPageView",
				"com/views/HomePageView",
				"com/views/AccountsPageView",
				"com/views/TransactionsPageView",
				"com/views/TransfersPageView",
				"com/views/TransfersConfirmPageView",
				"com/views/TransfersFinalPageView",
				"com/views/BillsPageView",
				"com/views/SelectAccountPageView",
				"com/views/BillsPayeePageView",
				"com/views/BillsConfirmPageView",
				"com/views/BillsFinalPageView",
				"com/views/CheckPageView",
				"com/views/CheckConfirmPageView",
				"com/views/CheckFinalPageView",
				"com/views/LocationsPageView",
				"com/views/ContactPageView",
				"com/views/MessagesPageView",
				"com/views/MessagePageView",
				"com/views/MoneyPageView",
				"com/views/MoneyPayeePageView",
				"com/views/MoneyConfirmPageView",
				"com/views/MoneyFinalPageView",
				"com/views/ViewCheckPageView",
				"com/views/ImagePageView",
				"com/views/SpendingByCategoryPageView",
				"com/views/MoneyNewPayeePageView",
				"com/views/ManageAlertsPageView",
				"com/views/AlertDetailPageView",
				"com/views/GoalsPageView",
				"com/views/MobileCashCodePageView",
				"com/views/MobileCashPageView",
				"com/views/CheckErrorView",
				"com/views/SplashSettingsPageView"
			],
			
			/**** default settings ****/
			SETTINGS_DEFAULT_LANGUAGE : "en",
			USER_DEFAULT_IMAGE : "../images/default_user.jpg",
			
			/**** resolution constants ****/
			RESOLUTION_PHONE : 480,
			RESOLUTION_TABLET : 767,
			RESOLUTION_DESKTOP : 1200,
			
			/**** events constants ****/
			EVENT_SETTINGS_UPDATE : "settingsupdate",
			
			/**** localStorage constants ****/
			APP_LOCAL_STORAGE_PREFIX : "ReadyBanking.",
			LS_KEY_LANGUAGE : "language",
			LS_KEY_SELECTED_ACCOUNT_ID: "selectedAccountId",
			LS_KEY_SELECTED_TRANSFERS_FROM_ID: "selectedTransfersFromId",
			LS_KEY_SELECTED_TRANSFERS_TO_ID: "selectedTransfersToId",
			LS_KEY_SELECTED_TRANSFERS_FROM_NUM: "selectedTransfersFromNum",
			LS_KEY_SELECTED_TRANSFERS_TO_NUM: "selectedTransfersToNum",
			LS_KEY_SELECTED_TRANSFERS_FROM_ACCOUNT: "selectedTransfersFromAccount",
			LS_KEY_SELECTED_TRANSFERS_TO_ACCOUNT: "selectedTransfersToAccount",
			LS_KEY_TRANSFERS_AMOUNT: "transfersAmount",
			LS_KEY_SELECTED_BILLS_ACCOUNT_ID: "selectedBillsAccountId",
			LS_KEY_SELECTED_BILLS_ACCOUNT: "selectedBillsAccount",
			LS_KEY_SELECTED_BILLS_PAYEE_ID: "selectedBillsPayeeId",
			LS_KEY_BILLS_AMOUNT: "billsAmount",
			LS_KEY_SELECTED_CHECK_TO_ACCOUNT_ID: "selectedCheckToAccountId",
			LS_KEY_SELECTED_CHECK_TO_ACCOUNT: "selectedCheckToAccount",
			LS_KEY_SELECTED_CHECK_ACCOUNT: "selectedCheckAccount",
			LS_KEY_CAPTURED_CHECK_FRONT_IMG: "capturedCheckFrontImg",
			LS_KEY_CAPTURED_CHECK_BACK_IMG: "capturedCheckBackImg",
			LS_KEY_CHECK_AMOUNT : "checkAmount",
			LS_KEY_USERNAME: "username",
			LS_KEY_PASSWORD: "password",
			LS_KEY_USERID: "userId",
			LS_KEY_TOKEN: "token",
			LS_KEY_SESSION_ID: "sessionId",
			LS_KEY_IS_ONLINE: "isOnline",
			LS_KEY_MESSAGES_STATE : "messagesStateArray",
			LS_KEY_SELECTED_MONEY_ACCOUNT_ID: "selectedMoneyAccountId",
			LS_KEY_SELECTED_MONEY_ACCOUNT: "selectedMoneyAccount",
			LS_KEY_SELECTED_MONEY_PAYEE_ID: "selectedMoneyPayeeId",
			LS_KEY_MONEY_AMOUNT: "MoneyAmount",
			LS_KEY_CHECK_AMOUNT: "checkAmount",
			LS_KEY_SELECTED_CONTACT_NAME : "selectedContactName",
			LS_KEY_SELECTED_CATEGORY_ACCOUNT : "selectedCategoryAccount",
			LS_KEY_CATEGORY_START_DATE : "categoryStartDate",
			LS_KEY_CATEGORY_END_DATE : "categoryEndDate",
			LS_KEY_CATEGORY_CHART_TYPE : "categoryChartType",
			LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT : "selectedAlertSettingAccount",
			LS_KEY_SELECTED_ALERT_SETTING_ACCOUNT_ID : "selectedAlertSettingAccountId",
			LS_KEY_SELECTED_CASH_ACCOUNT: "selectedCashAccount",
			LS_KEY_CASH_AMOUNT: "cashAmount",
			
			/**** adapter ****/
			LS_KEY_USER_ADAPTER: 'UserAdapter',
			LS_KEY_ACCOUNT_ADAPTER: 'AccountAdapter',
			LS_KEY_TRANSACTION_ADAPTER: 'TransactionAdapter',
			LS_KEY_DEPOSIT_CHECK_ADAPTER: "DepositCheck",
			
			/**** adapter procedure ****/
			LS_KEY_LOGIN: 'login',
			LS_KEY_LOGOUT: 'logout',
			LS_KEY_GET_ACCOUNT_BY_USER_ID: 'getAccountsByUserId',
			LS_KEY_GET_ACCOUNT_BY_USER_ID_AND_ACCOUNT_NUM: "getAccountByUserIdAndAccountNum",
			LS_KEY_GET_ACCOUNT_DETAIL: 'getAccountDetail',
			LS_KEY_GET_TRANSACTION_BY_ACCOUNT_ID: 'getTransactionsByAccountId',
			LS_KEY_TRANSFER_FUNDS: 'transferFunds',
			LS_KEY_CHECK_DEPOSIT_CHEQUE: "checkDepositCheque",
			
			/**mark whether have already Load google api **/
			LS_KEY_LOADMAP_MARK: 'loadmapMark',
			
			LS_KEY_CHECK_ROUNTING_NUMBER: "rountingNumber",
			LS_KEY_CHECK_CHECK_ACCOUNT: "checkAccount",
			
			LS_KEY_CONNECT_TIMEOUT: "connectTimeout",
			DEFAULT_CONNECT_TIMEOUT: 5,
			
			LS_KEY_USING_SERVER_ID: "usingServerId",
			LS_KEY_API_SERVER_ADDRESS: "apiServerAddress",
			LS_KEY_API_SERVER_PORT: "apiServerPort",
			LS_KEY_BLUEMIX_SERVER_ADDRESS: "blueMixServerAddress",
			LS_KEY_BLUEMIX_SERVER_PORT: "blueMixServerPort",
			
			DEFAULT_API_SERVER_ADDRESS: "12.139.41.106",
			DEFAULT_API_SERVER_PORT: 4101 ,
			DEFAULT_BLUEMIX_SERVER_ADDRESS: "9.16.172.108",
			DEFAULT_BLUEMIX_SERVER_PORT: 4101 ,
			DEFAULT_USING_SERVER_ID : 1,
			DEFAULT_IS_ONLINE : "true",
			DEFAULT_AUTHENTICATE_PORT: 4001,
			DEFAULT_MESSAGES_PORT: 4002,
			DEFAULT_PAYMENTS_PORT: 4003,
			
			/**** payee type ****/
			BILLS_PAYEE_TYPE : 2,
			MONEY_PAYEE_TYPE : 3,
			
			/**** transaction type ****/
			TRANSFER_TRANS_TYPE : 1,
			BILLS_TRANS_TYPE : 2,
			MONEY_TRANS_TYPE : 3,
    	}
    );

    // Returns the Model class
    return Constants;

});
