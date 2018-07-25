
/* JavaScript content from js/com/models/InvestmentModel.js in folder common */
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

    var InvestmentModel = Backbone.Model.extend({
		
		initialize: function(attributes, options)
		{
			this.set({
				"name": attributes["name"] || "",
				"amount": attributes["amount"] || 0,
			});
		},
	
    });

    return InvestmentModel;

});