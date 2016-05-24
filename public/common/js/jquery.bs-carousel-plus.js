/**
 * @title Bootstrap Carousel Plus
 * @description Adds additional funcitonality to Bootstrap Carousel.
 * @version 0.0.2
 * @author Richard Nelson
 * @email richard.nelson@fuelintegrated.com
 */

(function( $ ) {

	"use strict";

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var CarouselPlus = function( elem ) {
		console.log( "new CarouselPlus" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $carousel;
		var $slides;
		var $window;

		var enabled;

		var isTouch;
		var lockScroll;
		var swipeAxis;

		var xStart;
		var yStart;
		var tStart;

		var maxSlideHeight;


		// ----- PRIVATE CONSTANTS ----- //
		var SWIPE_DELTA_THRESHOLD = 100;
		var SWIPE_DURATION_THRESHOLD = 200;


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "CarouselPlus: init" );

			$carousel = $( elem );
			$slides = $carousel.find( ".carousel-inner .item" );
			$window = $( window );

			isTouch = detectTouch();
			lockScroll = $carousel.data( "lock-scroll" );
			swipeAxis = $carousel.data( "swipe-axis" );

			resizeSlides();

			enable();

		}

		function detectTouch() {
			console.log( "CarouselPlus: detectTouch" );

			return document.ontouchstart !== undefined;

		}

		function resizeSlides() {
			console.log( "CarouselPlus: resizeSlides" );

			// Reset Max Slide Height
			maxSlideHeight = 0;

			// Reset Slide Height
			$slides.css( "height", "" );

			// Find Max Height
			var $item;
			var itemHeight;

			$slides.each( function( i ) {

				$item = $( this );
				itemHeight = $item.height();
				maxSlideHeight = ( itemHeight > maxSlideHeight ) ? itemHeight : maxSlideHeight;

			} );

			// Set All Slides to Max Height
			$slides.css( "height", maxSlideHeight.toString() + "px" );

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onResize( e ) {
			console.log( "CarouselPlus: onResize" );

			resizeSlides();

		}

		function onSlide( e ) {
			console.log( "CarouselPlus: onSlide" );

		}

		function onSlid( e ) {
			console.log( "CarouselPlus: onSlid" );

		}

		function onTouchStart( e ) {
			console.log( "CarouselPlus: onTouchStart" );

			xStart = e.touches[0].clientX;
			yStart = e.touches[0].clientY;
			tStart = new Date().getTime();

		}

		function onTouchMove( e ) {

			if ( lockScroll )
				e.preventDefault();

		}

		function onTouchEnd( e ) {
			console.log( "CarouselPlus: onTouchEnd" );

			var tEnd = new Date().getTime();

			if ( tEnd - tStart <= SWIPE_DURATION_THRESHOLD ) {

				var xEnd = e.changedTouches[0].clientX;
				var yEnd = e.changedTouches[0].clientY;
				var xDelta = xEnd - xStart;
				var yDelta = yEnd - yStart;

				// Horizontal Swipe
				if ( swipeAxis !== "vertical" && Math.abs( xDelta ) >= Math.abs( yDelta ) && Math.abs( xDelta ) > SWIPE_DELTA_THRESHOLD ) {

					// Swipe Left
					if ( xDelta < 0 ) {
						console.info( "Swipe Left" );

						$carousel.carousel( "next" );

					// Swipe Right
					} else {
						console.info( "Swipe Right" );

						$carousel.carousel( "prev" );

					}


				// Vertical Swipe
				} else if ( swipeAxis === "vertical" && Math.abs( yDelta ) > SWIPE_DELTA_THRESHOLD ) {

					// Swipe Up
					if ( yDelta < 0 ) {
						console.info( "Swipe Up" );

						$carousel.carousel( "prev" );

					// Swipe Down
					} else {
						console.info( "Swipe Down" );

						$carousel.carousel( "next" );

					}

				}

			}

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function destroy() {
			console.log( "CarouselPlus: destroy" );

			disable();

		}

		function disable() {
			console.log( "CarouselPlus: disable" );

			enabled = false;

			$carousel.off( "slide.bs.carousel", onSlide );
			$carousel.off( "slid.bs.carousel", onSlid );
			$window.off( "resize", onResize );

			$carousel[0].removeEventListener( "touchstart", onTouchStart );
			$carousel[0].removeEventListener( "touchmove", onTouchMove );
			$carousel[0].removeEventListener( "touchend", onTouchEnd );

		}

		function enable() {
			console.log( "CarouselPlus: enable" );

			enabled = true;

			$carousel.on( "slide.bs.carousel", onSlide );
			$carousel.on( "slid.bs.carousel", onSlid );
			$window.on( "resize", onResize );

			if ( isTouch ) {

				$carousel[0].addEventListener( "touchstart", onTouchStart );
				$carousel[0].addEventListener( "touchmove", onTouchMove );
				$carousel[0].addEventListener( "touchend", onTouchEnd );

			}

		}

		function execute( func, options ) {
			console.log( "CarouselPlus: execute -> " + func );

			this[ func ].call( this, options );

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
		 	disable: disable,
		 	enable: enable,
		 	execute: execute
		}

	}

	/*************************************************
	 * jQUERY PLUGIN
	 *************************************************/
	$.fn.bsCarouselPlus = function( param1, param2 ) {

		this.each( function() {

			var $item = $( this );
			var pluginKey = "bs-carousel-plus";
			var obj = $item.data( pluginKey );

			if ( obj ) {

				obj.execute( param1, param2 );

			} else {

				obj = new CarouselPlus( this, param1 );
				$item.data( pluginKey, obj );

			}

		} );

		return this;

	};

}( jQuery ));
