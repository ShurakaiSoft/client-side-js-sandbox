/**
 * A JavaScript clock
 * 
 * Requires: jQuery
 * 
 * Arguments
 * $parent, jQuery Object - the parent node discribing the location to display 
 * the clock. 
 */

(function () {
	"use strict";
	window.CLOCK = window.CLOCK || {
		init: function ($parent) {
			function tick() {
				var now = new Date();
				function pad(value) {
					return (value < 10) ? '0' + value : value;
				}
				$parent.html([pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join(':'));
			}
	
			if ($parent) {
				setInterval(tick, 100);
			}
		}
	}; 
}());