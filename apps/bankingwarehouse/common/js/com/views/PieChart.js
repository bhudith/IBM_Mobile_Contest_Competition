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
	var PieChart = Backbone.View.extend ({

		_data : null,

		_animationFlagTimerId : null,  //timer id used to flag if animation is happening
		_onSelectionHandler : null, //handler when slice selected

		/**
		 * The View Constructor
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
		 * do cleanup
		 * @param none
		 */
		dispose: function() {
			//nothing to do here. page containing this chart should handle this
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
			var selectedIndex = this._getIndexOfData(selectedData);
			var scope = this;
			var data = [];
			var transactions = this._data;
			for(var i=0; i<transactions.length; i++){
				var d = transactions[i];
				data.push(d.amount);
			}

			var offset = 20;
			var width = this.$el.width(),
				height = this.$el.height(),
				radius = Math.min((width-offset), (height-offset)) / 2,
				colours = d3.scale.category20(),
				arc = d3.svg.arc().outerRadius(radius),
				outerRadius = Math.min((width-offset), (height-offset)) / 2,
				innerRadius = outerRadius * .3,
				arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius),
				donut = d3.layout.pie();
			console.log("radius" + radius+"");
			//resize container	
			this.$el.html("");

			var vis = d3.select(this.$el.get(0)).append("svg")
				.data([data])
				.attr("width", width)
				.attr("height", height);

			var arcs = vis.selectAll("g.arc")
				.data(donut)
			  .enter().append("g")
				.attr("class", "arc")
				.attr("transform", "translate(" + Math.round(width/2) + "," + Math.round(height/2) + ")");

			var paths = arcs.append("path")
				.attr("fill", function(d, i) {
					var selectedColour = colours( (i+1) );
					if(scope._getDataAtIndex(i) === selectedData){
						selectedColour = PieChart.HIGHLIGHT_COLOUR;
					}
					return selectedColour;
				})
				.attr("stroke", function(d, i){
					if(i == selectedIndex){
						return "white";
					}
					return "rgba(0, 0, 0, 0)";
				})
				.attr("stroke-width", function(d, i){
					if(i == selectedIndex){
						return 5;
					}
					return null;
				})
				//cant use tap, d3 only supports click
				.on("click", function(d, i) {
					var obj = scope._getDataAtIndex(i);
					scope._highlight(obj);

					if(scope._onSelectionHandler){
						scope._onSelectionHandler(obj);
					}			

			  });
			
			if(selectedData) {
				//put selected slice to the top
				var arcs = vis.selectAll("g.arc");
				var selectedSlice = $(arcs[0]).get(selectedIndex);
				this.$el.find("svg").append(selectedSlice);
			}

			arcs.append("text")
				.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.attr("text-anchor", "middle")
				.attr("pointer-events", "none")
				.text(function(d, i) {
					var label = "";
					var obj = scope._getDataAtIndex(i);
					label = obj.name;
					return label;
				});

			// only draw the full arc if not animating
		  	selectedData ? paths.attr("d", arc) : animate();

			function tweenPie(b) {
			  b.innerRadius = 0;
			  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
			  return function(t) {
				return arc(i(t));
			  };
			}

			function tweenDonut(b) {
			  b.innerRadius = radius * .6;
			  var i = d3.interpolate({innerRadius: 0}, b);
			  return function(t) {
				return arc(i(t));
			  };
			}

			function animate() {
				paths.transition()
					.duration(2000)
					.attrTween("d", tweenPie);

				paths.transition()
					.ease("elastic")
					.delay(function(d, i) { return 2000 + i * 50; })
					.duration(750)
					.attrTween("d", tweenDonut);

				clearTimeout(scope._animationFlagTimerId);
				scope._animationFlagTimerId = setTimeout(function(){
					scope._animationFlagTimerId = null;
				}, 2000);
			}
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
		_getDataByName : function(name)
		{
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
		 * @param data
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
	return PieChart;

});