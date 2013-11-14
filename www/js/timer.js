/**
 * A simple synchronous function runtime timer.
 * 
 * Adds TIMER to the global window namespace.
 */


/**
 * Timer utility function. Logs run times to console.log 
 */
(function () {
	"use strict";
	window.TIMER = window.TIMER || {
		timefunction: function (func, resultCallback) {
			var start = Date.now();
			var returnValue = func();
			
			resultCallback(null, Date.now() - start);
			return returnValue;
		}
	};
}());