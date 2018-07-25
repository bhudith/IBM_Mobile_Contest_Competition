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
		"com/utils/DataUtils",
		"com/models/Constants",
		"com/models/LocalServiceProxy",
		"com/models/RemoteServiceProxy",
		"com/utils/Utils",
	
	], function( $, Backbone, DataUtils, Constants, LocalServiceProxy, RemoteServiceProxy, Utils ) {
		
    // Extends Backbone.View
    var ServiceProxyFactory = Backbone.Model.extend({}, {
    	/**
    	 * Get service proxy
    	 * @param none
    	 */
    	getServiceProxy: function(){
    		return new RemoteServiceProxy();
    },
    });

    // Returns the View class
    return ServiceProxyFactory;

});