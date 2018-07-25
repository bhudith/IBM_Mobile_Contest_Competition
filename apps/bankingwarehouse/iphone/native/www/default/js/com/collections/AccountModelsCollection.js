
/* JavaScript content from js/com/collections/AccountModelsCollection.js in folder common */
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
		"com/models/AccountModel",
		 
	], function( $, Backbone, AccountModel ) {

    var AccountModelsCollection = Backbone.Collection.extend( {
    	
        /**
         * The Collection constructor
         * @param models
         * @param options
         */
        initialize: function( models, options ) 
        {
			this.sortByCategory();
        },
        
        /**
         * sort by category
         * @param none
         */
        sortByCategory: function() 
        {
        	this.comparator = function(account) {
				return account.get("category");
			};
        },
        
        model: AccountModel,

    });

    return AccountModelsCollection;

});
