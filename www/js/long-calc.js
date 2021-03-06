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
		window.CLOCK.init($("#clock"));
		longCalcWidget.init($('#widget1'));
		
	});
	
})();





