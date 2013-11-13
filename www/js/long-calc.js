/**
 * 
 * Some test code for breaking a long running function into something that can
 * run in a single threaded event loop like environment.
 * 
 * Requires jQuery to run.
 */

// closure for strict mode code.
(function strict() {
	"use strict";
	
	// demo plugin for jQuery.
	;(function ($) {
		if (typeof $.isStrict === 'undefined') {
			$.isStrict = function () {
				return (function () { return !this;})();
			};
		} else {
			console.log("isStrict is already defined for jQuery");
		}
	})(jQuery);
	
	
	/**
	 * UI clock element
	 * 
	 * It should hang if the event loop is blocked from a long running function.
	 * 
	 */
	function clock($parent) {
		function update() {
			var now = new Date();
			function pad(value) {
				return (value < 10) ? '0' + value : value;
			}
			$parent.html([pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join(':'));
		}
		
		if ($parent === null) {
			console.log("No UI element for clock");
			return;
		}
		
		(function () {
			setInterval(update, 100);
		})();
	};

	/**
	 * Timer utility function. Logs run times to console.log 
	 */
	function timeMe(func, options) {
		var start = 0;
		var rtn = undefined;
		var elapsedTime = 0;
		
		options = options || {};
		options.title = options.title || 'func';
		options.logToConsole = options.logToConsole || false;
		options.resultCallback = options.resultCallback || null;
		
		start = Date.now();
		rtn = func();
		elapsedTime = Date.now() - start;
		if (options.logToConsole) {
			console.log(options.title, ' took: ', elapsedTime, 'ms');
		}
		if (options.resultCallback) {
			options.resultCallback(null, elapsedTime);
		}
		return rtn;
	}

	
	
	/**
	 * An object with a time consuming function.
	 */
	var longCalcWidget = (function () {
//		var n = 100000000;
		var n = 1000;
		
		function asyncCalc() {
			var i = 1;
			var result = 0;
			var chunks = 10;
			var chunkSize = n / chunks;
			
			function doChunk() {
				var nChunk = Math.min(i + chunkSize, n);
				while (i <= nChunk) {
					result += i;
					i++;
				}
				if (i > n) {
					$("#async").children(".statusBar").html(result);
				} else {
					setTimeout(doChunk, 0);
				}
			}
			
			doChunk();
		}
		
		var doSync = function () {
			var i = 1;
			var result = 0;
			
			while (i <= n) {
				result += i;
				i++;
			}
			$("#sync").children(".statusBar").html(result);
		};
		
		function asyncTimeSlice() {
			var i = 1;
			var result = 0;
			
			function nonBlockingLoop() {
				if (i <= n) {
					result += i;
					i++;
					setTimeout(nonBlockingLoop, 0);
				} else {
					$("#asyncTs").children(".statusBar").html(result);
				}
			};
			nonBlockingLoop();
		}
		
		return {
			// A time consuming function
			doWork: function (callback) {
				$("#sync").children(".statusBar").html('processing...');
				setTimeout(doSync, 20);
			},
			
			doAsyncWork: function () {
				$("#async").children(".statusBar").html('processing...');
				setTimeout(asyncCalc, 20);
			},
			
			doAsyncWorkTS: function () {
				$("#asyncTs").children(".statusBar").html('processing...');
				setTimeout(asyncTimeSlice, 20);
			},
			
			init: function ($parent) {
				// create a button
				var that = this;
				// hook an event.
				$("#sync").children("button").click(that.doWork);
				$("#async").children("button").click(that.doAsyncWork);
				$("#asyncTs").children("button").click(that.doAsyncWorkTS);
				
			}
		};
	} ());
	
	
	// jQuery "main" function
	$(function () {
		clock($('#clock'));
		longCalcWidget.init($('#widget1'));
		
	});
	
})();





