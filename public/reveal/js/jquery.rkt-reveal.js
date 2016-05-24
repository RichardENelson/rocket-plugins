/**
 * @title Rocket Reveal
 * @description Adds reveal class when element scrolls past threshold.
 * @version 0.0.1
 * @author Richard Nelson
 * @email sc2071@gmail.com
 */

(function( $ ) {

	"use strict";

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketRevealSingleton = (function() {
		console.log( "new RocketRevealSingleton" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var instance;


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC FUNCTIONS ----- //
		function getInstance() {
			console.log( "RocketRevealSingleton: getInstance" );

			if ( !instance ) {

				instance = new RocketRevealManager();

			}

			return instance;

		}


		/*************************************************
		 * RETURN
		 *************************************************/
		return {
		 	getInstance: getInstance
		}


	}());

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketRevealManager = function( elem ) {
		console.log( "new RocketRevealManager" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $window;
		var containers;
		var enabled;
		var windowHeight;
		var windowTop;


		// ----- PRIVATE CONSTANTS ----- //


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "RocketRevealManager: init" );

			containers = [];

			$window = $( window );
			windowHeight = $window.height();
			windowTop = $window.scrollTop();

			enable();

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onResize( e ) {
			console.log( "RocketRevealManager: onResize" );

			windowHeight = $window.height();
			update();

		}

		function onScroll( e ) {
			console.log( "RocketRevealManager: onScroll" );

			windowTop = $window.scrollTop();
			update();

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function add( elem ) {
			console.log( "RocketRevealManager: add" );

			var revealer = new RocketReveal( elem );
			containers.push( revealer );

		}

		function destroy() {
			console.log( "RocketRevealManager: destroy" );

			disable();

			$.each( containers, function( i ) {

				containers[ i ].destroy();

			} );

		}

		function disable() {
			console.log( "RocketRevealManager: disable" );

			enabled = false;

			$window.off( "resize", onResize );
			$window.off( "scroll", onScroll );

		}

		function enable() {
			console.log( "RocketRevealManager: enable" );

			enabled = true;

			$window.on( "resize", onResize );
			$window.on( "scroll", onScroll );

		}

		function execute( func, options ) {
			console.log( "RocketRevealManager: execute -> " + func );

			this[ func ].call( this, options );

		}

		function refresh() {
			console.log( "RocketRevealManager: refresh" );

			$.each( containers, function( i ) {

				containers[ i ].refreshItems();
				containers[ i ].updateItems( windowTop, windowHeight );

			} );

		}

		function update() {
			console.log( "RocketRevealManager: update" );

			$.each( containers, function( i ) {

				containers[ i ].updateItems( windowTop, windowHeight );

			} );

		}


		// ----- PUBLIC EVENT LISTENERS ----- //


		/*************************************************
		 * CALL
		 *************************************************/
		init( elem );


		/*************************************************
		 * RETURN
		 *************************************************/
		return {
			add: add,
		 	destroy: destroy,
		 	disable: disable,
		 	enable: enable,
		 	execute: execute,
		 	refresh: refresh,
		 	update: update
		}

	}

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketReveal = function( elem ) {
		console.log( "new RocketReveal" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $container;
		var items;
		var staggerTime;
		var thresholdRatio;


		// ----- PRIVATE CONSTANTS ----- //
		var STYLE_REVEAL = "rkt-reveal";
		var STYLE_REVEAL_IN = "rkt-reveal-in";


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "RocketReveal: init" );

			$container = $( elem );
			staggerTime = parseFloat( $container.data( "stagger-time" ) );
			thresholdRatio = parseFloat( $container.data( "threshold-ratio" ) );

			addItems();
			updateItems();

		}

		function addItems() {
			console.log( "RocketReveal: addItems" );

			items = [];
			$container.find( "." + STYLE_REVEAL ).not( "." + STYLE_REVEAL_IN ).each( function( i ) {

				items.push( $( this ) );

			} );

			console.info( "Added " + items.length + " items..." );

		}


		// ----- PRIVATE EVENT LISTENERS ----- //


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function destroy() {
			console.log( "RocketReveal: destroy" );

		}

		function execute( func, options ) {
			console.log( "RocketReveal: execute -> " + func );

			this[ func ].call( this, options );

		}

		function refreshItems() {
			console.log( "RocketReveal: refreshItems" );

			addItems();
			updateItems();

		}

		function updateItems( windowTop, windowHeight ) {
			console.log( "RocketReveal: updateItems", windowTop, windowHeight );

			var $item;
			var delay = 0;
			var i = 0;
			var lastIndex;
			var length = items.length;
			var thresholdTop = windowTop + windowHeight * thresholdRatio;

			//console.info( "NUM ITEMS: " + items.length );
			//console.info( "------> THRESHOLD TOP: " + thresholdTop );

			for ( i; i < length; i++ ) {

				$item = items[i];

				//console.info( $item );
				//console.info( "---> ITEM TOP: " + $item.offset().top );

				if ( $item.offset().top <= thresholdTop ) {

					//console.info( "---> ITEM DELAY: ", delay );
					$item.css( "animation-delay", delay.toString() + "s" );
					$item.css( "transition-delay", delay.toString() + "s" );
					$item.addClass( STYLE_REVEAL_IN );
					delay += staggerTime;
					lastIndex = i;

				}

			}

			// Clean Up Array
			if ( lastIndex )
				items.splice( 0, lastIndex + 1 );

		}

		// ----- PUBLIC EVENT LISTENERS ----- //


		/*************************************************
		 * CALL
		 *************************************************/
		init( elem );


		/*************************************************
		 * RETURN
		 *************************************************/
		return {
		 	destroy: destroy,
		 	execute: execute,
		 	refreshItems: refreshItems,
		 	updateItems: updateItems
		}

	}

	/*************************************************
	 * jQUERY PLUGIN
	 *************************************************/
	$.fn.rktReveal = function() {

		var mgr = RocketRevealSingleton.getInstance();

		this.each( function() {

			mgr.add( this );

		} );

		return this;

	};

}( jQuery ));

