
/* JavaScript content from js/com/views/AlertDetailPageView.js in folder common */
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
		"com/models/Constants",
		"com/views/PageView",
		"com/utils/Utils",
		"com/utils/DataUtils",
		"com/utils/TemplateUtils",
		"com/models/ServiceProxyFactory",
	
	], function( $, Backbone, Constants, PageView, Utils, DataUtils, TemplateUtils, ServiceProxyFactory ) {
		
    // Extends PagView class
    var AlertDetailPageView = PageView.extend({
    	
    	_accountTitle : "", //account title
    	
    	_prefId : "", //preference ID
    	
    	_param : "", //preference param, currently only support one param
    	
    	_notifyEnabled : "", //preference notifyEnabled,
    	
    	_emailEnabled : "", //preference emailEnabled,
    	
    	/**
         * The View Constructor
         * @param options, parameters passed from the previous page
         */
        initialize: function(options) {
        	var self = this;
			PageView.prototype.initialize.call(this, options);
			
			self._accountTitle = options && options.data && options.data.accountTitle ? options.data.accountTitle : "";
			self._prefId = options && options.data && options.data.prefId ? options.data.prefId : "";
			self._param = options && options.data && options.data.param ? options.data.param : "";
			self._notifyEnabled = options && options.data && options.data.notifyEnabled ? options.data.notifyEnabled : "";
			self._emailEnabled = options && options.data && options.data.emailEnabled ? options.data.emailEnabled : "";
			
			//initialize components so it would be ready for the page
			this.$el.on("pageshow", function(){
				self.render();
			});
			
			//return to previous page
			$(document).on("backbutton", function(){
				self._back();
			});
        },
        
        /**
         * Renders UI for page
         * @param none
         */
        render: function() {
        	PageView.prototype.render.call(this);
        	
        	var self = this;
        	
        	//populate the preference title with account title selected
        	var prefTitle = self.$el.find("#threshold span:first");
        	var titleHtml = prefTitle.html();

        	prefTitle.html(titleHtml.replace("{0}", decodeURI(self._accountTitle)));
        	
        	//set parame value
        	self.$el.find("#threshold input").val(self._param);	
        	
        	//set notification enabled
        	if(self._notifyEnabled === "true"){
        		self.$el.find('#notifyEnabledYes').prop( "checked", true ).checkboxradio( "refresh" );       		
        	}else{
        		self.$el.find('#notifyEnabledNo').prop( "checked", true ).checkboxradio( "refresh" );   
        	}
        	
        	//set email enabled
        	if(self._emailEnabled === "true"){
        		self.$el.find('#emailEnabledYes').prop( "checked", true ).checkboxradio( "refresh" );   		
        	}else{
        		self.$el.find('#emailEnabledNo').prop( "checked", true ).checkboxradio( "refresh" );   
        	}
        	
        	//set preference ID
        	self.$el.find("#prefId").val(self._prefId);
        	
        	//back btn handler
        	this.$el.on("click", "#backBtn", function(){
        		self._back();
        		return false;
        	});
        	
            return this;
        },
        
        /**
         * do any cleanup, remove window binding here
         * @param none
         */
        dispose: function() {
        	PageView.prototype.dispose.call(this);
        },
        
        /**
         * collect inputs, update the preference and return to previous page
         * @param none
         */
        _back: function() {
        	var self = this;
        	
        	var prefId = self.$el.find("#prefId").val();
        	var threshold = self.$el.find("#threshold input").val();
        	var notifyEnabled = self.$el.find(".rightForm input[name='notifyEnabled']:checked").val();
        	var emailEnabled = self.$el.find(".rightForm input[name='emailEnabled']:checked").val();
        	var onResponse = function(){
        	   $.mobile.changePage("manage_alerts.html", {data:{prefId: prefId, notifyEnabled: notifyEnabled, emailEnabled: emailEnabled, param: threshold, accountName:self._accountTitle}});
        	};
        	var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};
			
			//update preference
        	ServiceProxyFactory.getServiceProxy().updatePref({prefId: prefId, notifyEnabled: notifyEnabled, emailEnabled: emailEnabled, param: threshold},onResponse,onError);
        }, 

    });

    // Returns the View class
    return AlertDetailPageView;
});