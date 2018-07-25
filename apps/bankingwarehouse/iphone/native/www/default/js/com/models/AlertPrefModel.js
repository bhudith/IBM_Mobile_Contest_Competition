
/* JavaScript content from js/com/models/AlertPrefModel.js in folder common */
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

    var AlertPrefModel = Backbone.Model.extend({
		
		initialize: function(attributes, options)
		{
			this.set({
				"prefId": attributes["id"] || "",
				"title": attributes["title"] || "",
				"param": attributes["param"] || "",
				"notifyEnabled": attributes["notifyEnabled"] || false,
				"emailEnabled": attributes["emailEnabled"] || false,
				"editable": attributes["editable"] || false
			});
		},
		
    });

    return AlertPrefModel;

});