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
		"datepicker",
		"com/models/Constants",
		"com/views/PageView",
		"com/views/SideMenuPanel",
		"com/utils/Utils",
		"com/utils/DataUtils",
		"com/utils/TemplateUtils",
		"com/views/PieChart",
		"com/views/BarChart",
		"com/models/ServiceProxyFactory",

	], function( $, Backbone, Datepicker, Constants, PageView, SideMenuPanel, Utils, DataUtils, TemplateUtils, PieChart, BarChart, ServiceProxyFactory ) {

	// Extends PagView class
	var SpendingByCategoryPageView = PageView.extend({
		
		_accountId: null, //account ID

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function() {
			var self = this;
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

			var chart = DataUtils.getLocalStorageData(Constants.LS_KEY_CATEGORY_CHART_TYPE);

			if(chart=="pieChart"){
				self.$el.find("#pieChart").addClass("ui-btn-active");
				self.$el.find("#barchartContainer").css("display", "none");
				self.$el.find("#piechartContainer").css("display", "block");
			}else{
				self.$el.find("#barChart").addClass("ui-btn-active");
				self.$el.find("#piechartContainer").css("display", "none");
				self.$el.find("#barchartContainer").css("display", "block");
			}

			// retrieve account data
			var fromAccount = DataUtils.getLocalStorageData(Constants.LS_KEY_SELECTED_CATEGORY_ACCOUNT);
			if (!Utils.isNullOrEmpty(fromAccount)) {
				var onTemplate = function(html) {
					self.$el.find("#categoryAccount .selectedInfo").html(html);
				};
				fromAccount = JSON.parse(fromAccount);
				self._accountId = fromAccount.accountId;
				var context =  {id: fromAccount.accountId, name: decodeURI(fromAccount.name),
		   				accountNum: fromAccount.accountNum, amount: fromAccount.amount
				};
				var params = {account: context};
				TemplateUtils.getTemplate("select_category_account_info", params, onTemplate);
			}

			// init datepicker
			this.$el.find(".form_datetime").datetimepicker({
				format: "mm/dd/yyyy",
				todayBtn: true,
				autoclose: true,
				pickerPosition: "bottom-left",
				minView: 2,
			});

			var startDate = DataUtils.getLocalStorageData(Constants.LS_KEY_CATEGORY_START_DATE);
			var endDate = DataUtils.getLocalStorageData(Constants.LS_KEY_CATEGORY_END_DATE);

			self.$el.find("#dateFrom").val(startDate);
			self.$el.find("#dateTo").val(endDate);

			self._filterData(chart);

			self.$el.on("tap","#pieChart", function(){
				self.$el.find("#barchartContainer").css("display", "none");
				self.$el.find("#barchartContainer").html("");
				self.$el.find("#piechartContainer").css("display", "block");
				DataUtils.setLocalStorageData(Constants.LS_KEY_CATEGORY_CHART_TYPE,"pieChart");
				self._filterData(DataUtils.getLocalStorageData(Constants.LS_KEY_CATEGORY_CHART_TYPE));
			});

			self.$el.on("tap","#barChart", function(){
				self.$el.find("#piechartContainer").css("display", "none");
				self.$el.find("#piechartContainer").html("");
				self.$el.find("#barchartContainer").css("display", "block");
				Utils.showAlert(Utils.getTranslation("%common.feature.unavailable%"), null, null, null);
			});

			self.$el.on("change", "#dateFrom", function(){
				var dateFrom = new Date(self.$el.find("#dateFrom").val());
				var dateTo = new Date(self.$el.find("#dateTo").val());

				if(dateFrom > dateTo){
					self._showInvalidDateMessage();
					return false;
				}

				DataUtils.setLocalStorageData(Constants.LS_KEY_CATEGORY_START_DATE,self.$el.find("#dateFrom").val());
				self._filterData(DataUtils.getLocalStorageData(Constants.LS_KEY_CATEGORY_CHART_TYPE));
			});

			self.$el.on("change", "#dateTo", function(){
				var dateFrom = new Date(self.$el.find("#dateFrom").val());
				var dateTo = new Date(self.$el.find("#dateTo").val());

				if(dateFrom > dateTo){
					self._showInvalidDateMessage();
					return false;
				}

				DataUtils.setLocalStorageData(Constants.LS_KEY_CATEGORY_END_DATE,self.$el.find("#dateTo").val());
				self._filterData(DataUtils.getLocalStorageData(Constants.LS_KEY_CATEGORY_CHART_TYPE));
			});

			return this; //Maintains chainability
		},

		/**
		 * Render pie chart with transactions data
		 * @param transactions, Object
		 */
	   	_renderPieChart: function(transactions) {
	   		var self = this;
	
	   		var chartContainer = self.$el.find("#piechartContainer");
	
			var onSelectionHandler = function(selectedItem) {

			};

			//create the pie chart
			self._chart = new PieChart({el: chartContainer, data: transactions, selectionHandler: onSelectionHandler});
			self._chart.render();
	   	},
	
	
		_contains: function(a, obj){
			for (var i = 0; i < a.length; i++) {
				if (a[i] === obj) {
					return true;
				}
			}
			return false;
		},


		/**
		 * Render pie chart with transactions data
		 * @param transactions, Object
		 */
	   	_renderBarChart: function(transactions) {
	   		var self = this;
	
	   		var chartContainer = self.$el.find("#barchartContainer");
	
			var onSelectionHandler = function(selectedItem) {
			};

			//create the bar chart
			self._chart = new BarChart({el: chartContainer, data: transactions, selectionHandler: onSelectionHandler});
			self._chart.render();
	   	},
	
		/**
		 * process transactions data according to date range 
		 * 
		 * @param chart, the chart object
		 */
		_filterData: function(chart){

			var self = this;

			var onTransactionsData = function(transactions)	{
				var items = [];

				var categorys = [];

				transactions.each(function(transaction) {
					  var sumAmount = 0;
					  var currentCategory = transaction.get("category");

					  if(!self._contains(categorys, currentCategory)){	
						  transactions.each(function(transaction) {
							   var category = transaction.get("category");
							   if(category == currentCategory){
									  sumAmount = sumAmount -  transaction.get("amount");
								}
						  });
						
						  categorys.push(currentCategory);
						  var context = {name:currentCategory,amount:sumAmount};
						  items.push(context);
					  }
				});

				var params = {transactions: items};
				if(chart=="pieChart"){
				   self._renderPieChart(params);
				}else{
				   self._renderBarChart(params);
				}
			};
			var onError = function(errorCode, statusMessage){
				Utils.showAlert(statusMessage);
			};
			
			var startDate = DataUtils.getLocalStorageData(Constants.LS_KEY_CATEGORY_START_DATE);
			var endDate = DataUtils.getLocalStorageData(Constants.LS_KEY_CATEGORY_END_DATE);
			ServiceProxyFactory.getServiceProxy().getUserTransactionsByDatetime({accountId: self._accountId, startDate: startDate, endDate: endDate}, 
					onTransactionsData,onError);

		},
	
		/**
		 * called when the window is resized or changed orientation
		 * @param none
		 */
		_onResize: function() {
			PageView.prototype._onResize.call(this);

			var self = this;
			var windowH = $(window).height(),
				headerH =  self.$el.find("div[data-role=header]").outerHeight(),
				footerH =  self.$el.find("div[data-role=footer]").outerHeight(),
				height = windowH - headerH - footerH - 100;

			var piechartContainer = self.$el.find("#piechartContainer");
			piechartContainer.height(height).width("100%");
			var barchartContainer = self.$el.find("#barchartContainer");
			barchartContainer.height(height).width("100%");	

	   		if(self._chart){
				self._chart.hide();
				self._chart.show();
				self._chart.render();
			}
		},

		/**
		 * show invalid date message
		 * @param none
		 */
		_showInvalidDateMessage: function() {
			var message = Utils.getTranslation("%spend.time.error%");
			Utils.showAlert(message, null);
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
	return SpendingByCategoryPageView;

});