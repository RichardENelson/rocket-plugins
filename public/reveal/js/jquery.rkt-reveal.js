/**
 * @title Rocket Reveal
 * @description Adds reveal class when element scrolls past threshold.
 * @version 0.0.5
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
		var passiveSupported;
		var resizeTimer;
		var scrollTimer;
		var windowHeight;
		var windowTop;


		// ----- PRIVATE CONSTANTS ----- //
		var RESIZE_DELAY = 250;
		var SCROLL_DELAY = 250;


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "RocketRevealManager: init" );

			containers = [];
			passiveSupported = getPassiveSupport();

			$window = $( window );
			windowHeight = $window.height();
			windowTop = $window.scrollTop();

		}

		function clearResizeTimer() {
			console.log( "RocketRevealManager: clearResizeTimer" );

			if ( resizeTimer ) {

				clearTimeout( resizeTimer );
				resizeTimer = undefined;

			}

		}

		function clearScrollTimer() {
			console.log( "RocketRevealManager: clearScrollTimer" );

			if ( scrollTimer ) {

				clearTimeout( scrollTimer );
				scrollTimer = undefined;

			}

		}

		function getPassiveSupport() {
			console.log( "RocketParallaxManager: getPassiveSupport" );

			var supportsPassive = false;

			try {

				var opts = Object.defineProperty( {}, "passive", {
					get: function() {
						supportsPassive = true;
					}
				} );

				window.addEventListener( "test", null, opts );

			} catch ( e ) {}

			return supportsPassive;

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onResize( e ) {
			console.log( "RocketRevealManager: onResize" );

			clearResizeTimer();
			resizeTimer = setTimeout( onResizeTimeout, RESIZE_DELAY );

		}

		function onResizeTimeout() {
			console.log( "RocketRevealManager: onResizeTimeout" );

			clearResizeTimer();
			update();

		}

		function onScroll( e ) {
			console.log( "RocketRevealManager: onScroll" );

			if ( !scrollTimer )
				scrollTimer = setTimeout( onScrollTimeout, SCROLL_DELAY );

		}

		function onScrollTimeout() {
			console.log( "RocketRevealManager: onScrollTimeout" );

			clearScrollTimer();
			update();

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function add( elem, options ) {
			console.log( "RocketRevealManager: add" );

			var stagger = ( options ) ? options.stagger : undefined;
			var threshold = ( options ) ? options.threshold : undefined;

			var revealer = new RocketReveal( elem, stagger, threshold );
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

			clearResizeTimer();
			clearScrollTimer();

			$window.off( "resize", onResize );
			$window[0].removeEventListener( "scroll", onScroll );

		}

		function enable() {
			console.log( "RocketRevealManager: enable" );

			enabled = true;

			$window.on( "resize", onResize );

			if ( passiveSupported )
				$window[0].addEventListener( "scroll", onScroll, { passive: true } );
			else
				$window[0].addEventListener( "scroll", onScroll );

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

			windowTop = $window.scrollTop();

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
	var RocketReveal = function( elem, stagger, threshold ) {
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
		var EVENT_ANIMATION_TRANSITION_END = "animationend webkitAnimationEnd oanimationend MSAnimationEnd transitionend webkitTransitionEnd otransitionend MSTransitionEnd";
		var STYLE_REVEAL = "rkt-reveal";
		var STYLE_REVEAL_IN = "rkt-reveal-in";


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem, stagger, threshold ) {
			console.log( "RocketReveal: init" );

			$container = $( elem );
			staggerTime = stagger || parseFloat( $container.data( "stagger" ) ) || 0.1;
			thresholdRatio = threshold || parseFloat( $container.data( "threshold" ) ) || 0.9;

			console.warn( staggerTime, thresholdRatio );

			addItems();
			updateItems();

		}

		function addItems() {
			console.log( "RocketReveal: addItems" );

			var $item;

			items = [];
			$container.find( "." + STYLE_REVEAL ).not( "." + STYLE_REVEAL_IN ).each( function( i ) {

				$item = $( this );
				items.push( $item );

			} );

			console.info( "Added " + items.length + " items..." );

		}

		function getElementOffsetTop( elem ) {
			//console.log( "RocketReveal: getElementOffsetTop" );

			var itemTransform = elem.css( "transform" ).replace( /[a-zA-Z\(\)\s]/g, "" ).split( "," );
			var itemTop = elem.offset().top - itemTransform[5];

			return itemTop;

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

			$container.find( "." + STYLE_REVEAL ).not( "." + STYLE_REVEAL_IN ).each( function( i ) {

				$( this ).off( EVENT_ANIMATION_TRANSITION_END );

			} );

			items = undefined;

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
				//console.info( "---> ITEM TOP: " + getElementOffsetTop( $item ) );

				if ( getElementOffsetTop( $item ) <= thresholdTop ) {

					//console.info( "---> ITEM DELAY: ", delay );
					$item.css( "animation-delay", delay.toString() + "s" );
					$item.css( "transition-delay", delay.toString() + "s" );
					delay += staggerTime;
					lastIndex = i;

					var onEnd = function( e ) {
						console.log( "RocketReveal: onEnd" );

						var $target = $( e.currentTarget );

						$target.off( EVENT_ANIMATION_TRANSITION_END, onEnd );
						$target.css( "animation-delay", "" );
						$target.css( "transition-delay", "" );
						$target.removeClass( STYLE_REVEAL )
						$target.removeClass( STYLE_REVEAL_IN );

					}

					$item.on( EVENT_ANIMATION_TRANSITION_END, onEnd );
					$item.addClass( STYLE_REVEAL_IN );

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
		init( elem, stagger, threshold );


		/*************************************************
		 * RETURN
		 *************************************************/
		return {
		 	destroy: destroy,
		 	refreshItems: refreshItems,
		 	updateItems: updateItems
		}

	}

	/*************************************************
	 * jQUERY PLUGIN
	 *************************************************/
	$.fn.rktReveal = function() {

		var mgr = RocketRevealSingleton.getInstance();

		var param0 = arguments[0];
		var param1 = arguments[1];

		this.each( function() {

			if ( typeof( param0 ) !== "string" )
				mgr.add( this, param0 );
			else
				mgr.execute( param0, param1 );

		} );

		return this;

	};

}( jQuery ));

