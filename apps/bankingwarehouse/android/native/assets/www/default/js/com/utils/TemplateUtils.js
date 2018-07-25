
/* JavaScript content from js/com/utils/TemplateUtils.js in folder common */
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
		"handlebars",
		"com/models/Constants",
		
	], function($, Backbone, Handlebars, Constants) {

	var TemplateUtils = Backbone.Model.extend({},
	
	{
		
		/**
		 * process a handlebar template
		 * @param template, name string to the template without the extension
		 * @param params, object to process the handlebar template
		 * @param onTemplateHandler, function to receive the post processed html of the template
		 * @param templateIsFullPath, boolean, [optional] specifies if the template param specifies the full path to the template
		 * @param async, boolean [optional], default is true
		 */
		getTemplate: function(template, params, onTemplateHandler, templateIsFullPath, async)
		{
			$.ajax({
				type: "GET",
				url: templateIsFullPath ? template : Constants.FOLDER_TEMPLATES + template + Constants.EXTENSION_TEMPLATES,
				async: typeof async =="undefined" ? true : async,
				cache: true,
				dataType: "text",
				success: function(data){
					var template = Handlebars.compile(data);
					var html = params ? template(params) : template({});
					
					if(onTemplateHandler){
						onTemplateHandler(html);
					}
				}
			});	
		},
	});

	return TemplateUtils;

}); 