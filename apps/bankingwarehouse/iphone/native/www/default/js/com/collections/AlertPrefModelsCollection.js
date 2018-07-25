
/* JavaScript content from js/com/collections/AlertPrefModelsCollection.js in folder common */
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
		"com/models/AlertPrefModel",
		 
	], function( $, Backbone, AlertPrefModel ) {

    var AlertPrefModelsCollection = Backbone.Collection.extend( {
    	
        /**
         * The Collection constructor
         * @param models
         * @param options
         */
        initialize: function( models, options ) 
        {
			this.comparator = function(alertPref) {
				return alertPref.get("prefId");
			};
        },
        
        model: AlertPrefModel,

    });

    return AlertPrefModelsCollection;

});
