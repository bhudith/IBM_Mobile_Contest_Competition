
/* JavaScript content from js/com/views/ToggleButtonsGroup.js in folder common */
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
		"com/views/PageView",

	], function( $, Backbone, PageView ) {

	// Extends PagView class
	var ToggleButtonsGroup = PageView.extend({
		_buttonClickHandlers : null, //array of functions to run when a button is clicked in the order of the buttons

		/**
		 * The View Constructor
		 * @param options, parameters passed from the previous page
		 */
		initialize: function(options) {
			PageView.prototype.initialize.call(this);

			this._buttonClickHandlers = options && options.buttonClickHandlers ? options.buttonClickHandlers : [];
		},

		/**
		 * Renders UI for page
		 * @param none
		 */
		render: function() {
			PageView.prototype.render.call(this);

			var scope = this;
			scope.$el.find("button").each(function(index, value){
				$(this).unbind().on("tap", function(){
					var buttonClickHandler = scope._buttonClickHandlers[index];
					if(!scope._isSelected(this) && buttonClickHandler){
						buttonClickHandler();
					}

					return false;
				});
			});

			//enable swipe to change toggle
			var swipeElement = scope.$el.parent();
			$(swipeElement).bind("swipe", function(event){
				var selectedIndex = scope._getCurrentlySelectedIndex();
				switch(event.direction)	{
					case "left":
						selectedIndex--;
						if(selectedIndex < 0){
							selectedIndex = 0;
						}
						break;
					case "right":
						selectedIndex++;
						if(selectedIndex > scope.$el.find("button").size()-1) {
							selectedIndex = scope.$el.find("button").size()-1;
						}
						break;
				}
				scope.setSelectedState(selectedIndex);
			});


			return this; //Maintains chainability
		},

		/**
		 * deselect all buttons in the group
		 * @param skipIndex, index of the button to skip, does not select it
		 */
		_deselectAll : function(skipIndex) {
			var self = this;
			this.$el.find("button").each(function(index, value){
				if(index != skipIndex){
					self._setUnselectedState(this);
				}
			});
		},

		/**
		 * set the selected state
		 * does not trigger button click
		 * @param selectedIndex, int index of the selected toggle
		 */
		setSelectedState : function(selectedIndex) {
			this._deselectAll(selectedIndex);
			this._setSelectedState(this.$el.find("button").eq(selectedIndex));
		},

		/**
		 * get currently selected index
		 * @param none
		 * @return selectedIndex, int
		 */
		_getCurrentlySelectedIndex : function() {
			var self = this;
			var selectedIndex = 0;
			this.$el.find("button").each(function(index, value){
				if(self._isSelected(this)){
					selectedIndex = index;
					return false;
				}
			});
			return selectedIndex;
		},

		/**
		 * if specified button selected
		 * @param button, button object
		 * @return boolean
		 */
		_isSelected:  function(button) {
			return $(button).hasClass(ToggleButtonsGroup.SELECTED_CLASS);
		},

		/**
		 * set button as selected
		 * @param button, button object
		 */
		_setSelectedState : function(button) {
			$(button).addClass(ToggleButtonsGroup.SELECTED_CLASS);
			$(button).parent().addClass(ToggleButtonsGroup.SELECTED_CLASS);
		},

		/**
		 * set button as unselected
		 * @param button, button object
		 */
		_setUnselectedState : function(button) {
			$(button).removeClass(ToggleButtonsGroup.SELECTED_CLASS);
			$(button).parent().removeClass(ToggleButtonsGroup.SELECTED_CLASS);
		},

		 /**
		 * do cleanup
		 * @param none
		 */
		dispose: function() {
			//nothing to do here. page containing this button group should handle this
		},
	},

	{
		SELECTED_CLASS : "selected",
	});

	// Returns the View class
	return ToggleButtonsGroup;
});