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

    var MoneyPayeeModel = Backbone.Model.extend({
		
		initialize: function(attributes, options)
		{
			this.set({
				"payeeId": attributes["id"] || "",
				"name": attributes["name"] || "",
				"lastpaid": attributes["lastpaid"] || ""
			});
		},
		
    });

    return MoneyPayeeModel;

});