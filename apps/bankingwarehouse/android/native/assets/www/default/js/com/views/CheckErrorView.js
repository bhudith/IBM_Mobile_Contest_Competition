
/* JavaScript content from js/com/views/CheckErrorView.js in folder common */
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
	
	], function( $, Backbone, Constants, PageView, Utils, DataUtils, TemplateUtils ) {
		
    // Extends PagView class
    var CheckErrorView = PageView.extend({
    	_errorModel : null,
    	
    	/**
         * The View Constructor
         * @param options, parameters passed from the previous page
         */
        initialize: function(options) {
        	var self = this;
        	self._errorModel = options && options.data ? options.data:null;
			PageView.prototype.initialize.call(this);
			
			//initialize components so it would be ready for the page
			this.$el.on("pageshow", function(){
				self.render();
			});
        },
        
        /**
         * Renders UI for page
         * @param none
         */
        render: function() {
        	PageView.prototype.render.call(this);
        	
        	var self = this;
        	
        	if(self._errorModel){
        		if(self._errorModel.type == "photo"){
        			self.$el.find("#photo_error").css("display", "inline");
        			self.$el.find("#data_error").css("display", "none");
        			if(self._errorModel.photoFace == "front"){
        				self.$el.find("#photo_error .errorInfo1").css("display", "inline");
        				self.$el.find("#photo_error .errorInfo2").css("display", "none");
        			}else{
        				self.$el.find("#photo_error .errorInfo1").css("display", "none");
        				self.$el.find("#photo_error .errorInfo2").css("display", "inline");
        			}
        		}
        		else{
        			self.$el.find("#photo_error").css("display", "none");
        			self.$el.find("#data_error").css("display", "inline");
        		}
        	}
        	
        	//setup the confirm button handler
			self.$el.on("click", "#confirmBtn", function() {
				history.back();
			});
			
			//setup the cancel button handler
			self.$el.on("click", "#cancelBtn", function() {
				var question = Utils.getTranslation("%check.cancel.question%");
				var onYes = function() {
					$.mobile.changePage("home.html", {transition: "none"});
				};
				Utils.showConfirmationAlert(question, onYes);
			});

            return this; //Maintains chainability
        },
        
         /**
         * do any cleanup, remove window binding here
         * @param none
         */
        dispose: function() {
        	PageView.prototype.dispose.call(this);
        },
    });

    // Returns the View class
    return CheckErrorView;
});