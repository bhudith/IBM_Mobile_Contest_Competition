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
		"d3",
		"com/utils/Utils",

	], function( $, Backbone, d3, Utils) {

	// Extends Backbone.View class
	var BarChart = Backbone.View.extend ({

		_data : null,

		_animationFlagTimerId : null,  //timer id used to flag if animation is happening
		_onSelectionHandler : null, //handler when slice selected

		/**
		 * The View Constructor
		 * 
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			var self = this;
			self._data = options && options.data && options.data.transactions ? options.data.transactions : [];
			self._onSelectionHandler = options && options.selectionHandler ? options.selectionHandler : null;
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function() {
			this._draw();

			return this; //Maintains chainability
		},

		 /**
		 * do any cleanup
		 * @param none
		 */
		dispose: function() {
			//nothing to do here, page containing this chart should handle this
		},

		/**
		 * highlight the chart by selected data name
		 * @param name, data name of the selected slice
		 */
		highlight : function(name) {
			var selectedData = this._getDataByName(name);
			this._highlight(selectedData); //redraw the chart with selected item
		},

		/**
		 * highlight the chart by selected data
		 * @param selectedData, data of the selected slice
		 */
		_highlight : function(selectedData) {
			this._draw(selectedData); //redraw the chart with selected item
		},


		/**
		 * draw the chart
		 * @param selectedData, data object of the selected slice
		 */
		_draw : function(selectedData) {

			var scope = this;
			var data = [];
			var transactions = this._data;
			for(var i=0; i<transactions.length; i++){
				var d = transactions[i];
				data.push(d.amount);
			}

			var width = this.$el.width(),
				height = this.$el.height(),
				colours = d3.scale.category20();

			this.$el.html("");

			var chart = d3.select(this.$el.get(0)).append("svg")
			   .attr("class", "chart")
			   .attr("width", width)
			   .attr("height", height)
			   .append("g")
			   .attr("transform", "translate(15, -10)");

				
			var y = d3.scale.linear()
			   .domain([0, d3.max(data)])
			   .range([0, height-30]);
				
			var x = d3.scale.ordinal()
			   .domain(data)
			   .rangeBands([0, width-30]);

			chart.selectAll("rect").data(data).enter().append("rect")
			.attr("x",x)
			.attr("y",function(d){return height-y(d)})
			.attr("width",x.rangeBand())
			.attr("height",y)
			.attr("stroke","white")
			.attr("fill", function(d, i) {
					var selectedColour = colours( (i+1) );
					if(scope._getDataAtIndex(i) === selectedData){
						selectedColour = BarChart.HIGHLIGHT_COLOUR;
					}
					return selectedColour;
				})
			//cant use tap, d3 only supports click
			.on("click", function(d, i) {
					var obj = scope._getDataAtIndex(i);
					scope._highlight(obj);

					if(scope._onSelectionHandler){
						scope._onSelectionHandler(obj);
					}			

			  });
			
			chart.selectAll("text")
			   .data(data)
			   .enter().append("text")
			   .attr("x", function(d) { return x(d) + x.rangeBand() / 2; })  
			   .attr("y",function(d){return height-y(d)})
			   .attr("dx", ".35em") //  horizontal-align: middle
			   .attr("dy", 0) // vertical-align: middle
			   .attr("text-anchor", "middle") // text-align: right
	   		   .text(function(d, i) {
				var label = "";
				var obj = scope._getDataAtIndex(i);
				label = obj.name;
				label += " - " + Utils.convertNumberToCurrency(obj.amount);

				return label;
			});
		},


		/**
		 * returns the data object at specified index
		 * @param index, int
		 * @return data, object
		 */
		_getDataAtIndex : function(index) {
			var data = null;
			var transactions = this._data;
			if(transactions[index]) {
				data = transactions[index];
			}
			return data;
		},

		/**
		 * returns the data by name
		 * @param name, string
		 * @return data, object
		 */
		_getDataByName : function(name) {
			var transactions = this._data;
			for(var i in transactions) {
				var transaction = transactions[i];
				if(transaction.name === name) {
					return transaction;
				}
			}
			return null;
		},

		/**
		 * returns the index of the data
		 * @param data, object
		 * @return index, int
		 */
		_getIndexOfData : function(data) {
			var transactions = this._data;
			for(var i in transactions){
				var transaction = transactions[i];
				if(transaction === data)	{
					return i;
				}
			}
			return -1;
		},

		/**
		 * hide the chart
		 * @param none
		 */
		hide : function() {
			var chart = this.$el.find("svg");
			$(chart).hide();
		},

		/**
		 * show the chart
		 * @param none
		 */
		show : function() {
			var chart = this.$el.find("svg");
			$(chart).show();
		},


		/**
		 * returns if chart is animating
		 * @param none
		 * @return isAnimating, boolean
		 */
		isAnimating : function() {
			return !this._animationFlagTimerId==null;
		},
	},

	{
		HIGHLIGHT_COLOUR : "#ffc600",  //color for highlighted slice
	});

	// Returns the View class
	return BarChart;
});