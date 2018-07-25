
/* JavaScript content from js/com/models/AccountModel.js in folder common */
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
		 
	], function( $, Backbone, Moment ) {

    var AccountModel = Backbone.Model.extend({
		
		initialize: function(attributes, options)
		{
			this.set({
				"accountId": attributes["id"] || "",
				"accountNum": attributes["accountNum"] || "",
				"accountName": attributes["accountName"] || "",
				"balance": attributes["balance"] || 0,
				"category": attributes["category"] || 0,
				"isTotal": attributes["isTotal"] || false
			});
		},
		
    },
    {
    
    	CATEGORIES : 
    	{
    		1: "Bank Accounts",
    		0: "Credit",
    		2: "Retirement"
		}	
    	
    });

    return AccountModel;

});