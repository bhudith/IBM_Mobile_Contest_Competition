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

    var MessageModel = Backbone.Model.extend({
		
		initialize: function(attributes, options)
		{
			this.set({
				"messageId": attributes["id"] || "",
				"subject": attributes["subject"] || "",
				"date": attributes["date"] || "",
				"content": attributes["content"] || "",
				"isRead": attributes["isRead"] || false,
				"actionRequired": attributes["actionRequired"] || false,
			});
		},
		
    });

    return MessageModel;

});