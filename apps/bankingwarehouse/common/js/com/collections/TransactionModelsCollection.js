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
		"com/models/TransactionModel",
		 
	], function( $, Backbone, TransactionModel ) {

    var TransactionModelsCollection = Backbone.Collection.extend( {
    	
        /**
         * The Collection constructor
         * @param models
         * @param options
         */
        initialize: function( models, options ) 
        {
			this.comparator = function(transaction) {
				return transaction.get("transactionId");
			};
        },
        
        model: TransactionModel,

    });

    return TransactionModelsCollection;

});



