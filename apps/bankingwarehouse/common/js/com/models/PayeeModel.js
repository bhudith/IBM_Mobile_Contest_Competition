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
		 
	], function( $, Backbone ) {

    var PayeeModel = Backbone.Model.extend({
		
		initialize: function(attributes, options)
		{
			this.set({
				"payeeId": attributes["id"] || "",
				"payeeNum": attributes["payeeNum"] || "",
				"payeeName": attributes["payeeName"] || "",
				"amount": attributes["amount"] || 0,
				"lastpaid": attributes["lastPaid"] || "",
				"type": attributes["type"] || 0,
				"userId": attributes["userId"] || ""
			});
		},
		
    });

    return PayeeModel;

});