/**
 * @title Rocket Carousel
 * @description A carousel plugin for jQuery.
 * @version 0.1.0
 * @author Richard Nelson
 * @email richard.nelson@fuelintegrated.com
 */

(function( $ ) {

	"use strict";

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketCarousel = function( elem, options ) {
		console.log( "new RocketCarousel" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $carousel;
		var $navPrev;
		var $navNext;
		var $pipList;
		var $pipItems;

		var autoplay;
		var currentIndex;
		var duration;
		var enabled;
		var looping;
		var slides;
		var styles;
		var timer;
		var timerDelay;
		var transitionClasses;
		var transitioningHide;
		var transitioningShow;


		// ----- PRIVATE CONSTANTS ----- //
		var EVENT_TRANSITION_END = "transitionend webkitTransitionEnd otransitionend MSTransitionEnd";

		var EVENT_ENTER = "enter.rkt.carousel";
		var EVENT_ENTER_COMPLETE = "enterComplete.rkt.carousel";
		var EVENT_LEAVE = "leave.rkt.carousel";
		var EVENT_LEAVE_COMPLETE = "leaveComplete.rkt.carousel";

		var SELECTOR_SLIDE = ".rkt-carousel-slide-item";
		var SELECTOR_NAV_PREV = ".rkt-carousel-nav-prev";
		var SELECTOR_NAV_NEXT = ".rkt-carousel-nav-next";
		var SELECTOR_PIP_LIST = ".rkt-carousel-pip-list";
		var SELECTOR_PIP_ITEM = ".rkt-carousel-pip-item";

		var STYLE_ACTIVE = "active";
		var STYLE_NEXT = "next";
		var STYLE_PREV = "prev";
		var STYLE_FORWARD = "forward";
		var STYLE_BACKWARD = "backward";


		// ----- PRIVATE GETTERS / SETTERS ----- //
		function getTransitioning() {

			return ( transitioningShow || transitioningHide );

		}


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem, options ) {
			console.log( "RocketCarousel: init" );
			console.info( options );

			// Set Carousel Element
			$carousel = $( elem );

			// Vars
			transitioningHide = false;
			transitioningShow = false;

			// Options
			options = options || {};

			// Autoplay
			autoplay = ( options.autoplay !== undefined )
				? options.autoplay
				: false;

			// Looping
			looping = ( options.looping !== undefined )
				? options.looping
				: false;

			// Set Nav Elements
			$navPrev = $carousel.find( SELECTOR_NAV_PREV );
			$navNext = $carousel.find( SELECTOR_NAV_NEXT );
			if ( $navPrev.length === 0 ) $navPrev = undefined;
			if ( $navNext.length === 0 ) $navNext = undefined;

			// Set Pip List Element
			$pipList = $carousel.find( SELECTOR_PIP_LIST );
			if ( $pipList.length === 0 ) $pipList = undefined;

			// Set Pip Item Elements
			$pipItems = ( $pipList )
				? $pipList.find( SELECTOR_PIP_ITEM )
				: undefined;

			transitionClasses = [ STYLE_NEXT, STYLE_PREV, STYLE_FORWARD, STYLE_BACKWARD ].join( " " );

			// Timer Delay
			timerDelay = ( options.duration >= 0 )
				? options.duration
				: 10000;

			// Create Carousel
			createCarousel();

			// Set Current Index
			currentIndex = -1;

		}

		function createCarousel() {
			console.log( "RocketCarousel: createCarousel" );

			slides = [];

			var $slide;

			$carousel.find( SELECTOR_SLIDE ).each( function( i ) {

				console.log( "RocketCarousel: adding slide", i );

				// Assign Slide
				$slide = $( this );

				// Add Slide to Array
				slides.push( {
					id: i,
					element: $slide[0]
				} );

			} );

		}

		function changeSlide( index, transitioned, dir ) {
			console.log( "RocketCarousel: changeSlide", index, transitioned, dir );

			if ( !getTransitioning() &&
			     index >= 0 &&
				 index < slides.length &&
				 index !== currentIndex ) {

				// Direction
				if ( dir === undefined )
					dir = ( index - currentIndex > 0 ) ? 1 : -1;

				// Transitioned
				transitioned = ( transitioned !== undefined )
					? transitioned
					: true;

				// Stop
				stop();

				// Set Current Index
				var prevIndex = currentIndex;
				currentIndex = index;

				// Hide
				if ( prevIndex > -1 )
					hideSlide( prevIndex, transitioned, dir );

				// Show
				updatePips();
				showSlide( index, transitioned, dir );

				// Play
				if ( autoplay )
					play();

			}

		}

		function showSlide( index, transitioned, dir ) {
			console.log( "RocketCarousel: showSlide: " + index );

			var $slide = $( slides[ index ].element );

			transitioningShow = true;

			// Change State to Enter
			if ( dir > 0 )
				$slide.addClass( STYLE_NEXT );
			else
				$slide.addClass( STYLE_PREV );

			// Force Reflow to Set Initial Position
			$slide[0].offsetWidth;

			// Direction
			if ( dir > 0 )
				$slide.addClass( STYLE_FORWARD );
			else
				$slide.addClass( STYLE_BACKWARD );

			// Dispatch Enter Event
			$carousel.trigger( EVENT_ENTER );

			// Transition End Function
			var onTransitionEnd = function( e ) {
				console.log( "RocketCarousel: onTransitionEnd" );

				transitioningShow = false;

				$slide.off( EVENT_TRANSITION_END, onTransitionEnd );
				$slide.removeClass( transitionClasses );

				// Make Active
				$slide.addClass( STYLE_ACTIVE );

				// Dispatch Enter Complete Event
				$carousel.trigger( EVENT_ENTER_COMPLETE );

			};

			// Add Event Listener -or- Call Animation End
			if ( transitioned )
				$slide.on( EVENT_TRANSITION_END, onTransitionEnd );
			else
				onTransitionEnd();

		}

		function hideSlide( index, transitioned, dir ) {
			console.log( "RocketCarousel: hideSlide: " + index );

			var $slide = $( slides[ index ].element );

			transitioningHide = true;

			// Direction
			if ( dir > 0 )
				$slide.addClass( STYLE_FORWARD );
			else
				$slide.addClass( STYLE_BACKWARD );

			// Dispatch Leave Event
			$carousel.trigger( EVENT_LEAVE );

			// Transition End Function
			var onTransitionEnd = function( e ) {
				console.log( "RocketCarousel: onTransitionEnd" );

				transitioningHide = false;

				$slide.off( EVENT_TRANSITION_END, onTransitionEnd );
				$slide.removeClass( transitionClasses );

				// Remove Active
				$slide.removeClass( STYLE_ACTIVE );

				// Dispatch Leave Complete Event
				$carousel.trigger( EVENT_LEAVE_COMPLETE );

			};

			// Add Event Listener -or- Call Animation End
			if ( transitioned )
				$slide.on( EVENT_TRANSITION_END, onTransitionEnd );
			else
				onTransitionEnd();

		}

		function updatePips() {
			console.log( "RocketCarousel: updatePips" );

			if ( $pipList ) {

				// Remove Selected
				$pipList.find( "." + STYLE_ACTIVE ).removeClass( STYLE_ACTIVE );

				// Add Selected
				$pipItems.eq( currentIndex ).addClass( STYLE_ACTIVE );

			}

		}

		// ----- PRIVATE EVENT LISTENERS ----- //
		function onTimeout( e ) {
			console.log( "RocketCarousel: onTimeout" );

			playNext();

		}

		function onNavPrevClick( e ) {
			console.log( "RocketCarousel: onNavPrevClick" );

			playPrev();

		}

		function onNavNextClick( e ) {
			console.log( "RocketCarousel: onNavNextClick" );

			playNext();

		}

		function onPipClick( e ) {
			console.log( "RocketCarousel: onPipClick" );

			var $target = $( e.currentTarget );
			changeSlide( $target.index() );

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function destroy() {
			console.log( "RocketCarousel: destroy" );

			// Remove Listeners
			disable();

			// Timer
			stop();
			timer = undefined;

			// Remove Navigation
			if ( $navPrev ) $navPrev = undefined;
			if ( $navNext ) $navNext = undefined;

			// Remove Animation Classes from Slides
			var $slide;

			$carousel.find( SELECTOR_SLIDE ).each( function( i ) {

				$slide = $( this );
				$slide.off();
				$slide.removeClass( transitionClasses );

			} );

			// Remove Slides Array
			slides = undefined;

			// Remove Styles
			styles = undefined;

		}

		function disable() {
			console.log( "RocketCarousel: disable" );

			enabled = false;

			// Nav
			if ( $navPrev )
				$navPrev.off( "click", onNavPrevClick );

			if ( $navNext )
				$navNext.off( "click", onNavNextClick );

			// Pips
			if ( $pipItems )
				$pipItems.off( "click", onPipClick );

		}

		function enable() {
			console.log( "RocketCarousel: enable" );

			enabled = true;

			// Nav
			if ( $navPrev )
				$navPrev.on( "click", onNavPrevClick );

			if ( $navNext )
				$navNext.on( "click", onNavNextClick );

			// Pips
			if ( $pipItems )
				$pipItems.on( "click", onPipClick );

		}

		function execute( func, options ) {
			console.log( "RocketCarousel: execute -> " + func );

			this[ func ].call( this, options );

		}

		function play() {
			console.log( "RocketCarousel: play" );

			clearTimeout( timer );
			timer = setTimeout( onTimeout, timerDelay );

		}

		function stop() {
			console.log( "RocketCarousel: stop" );

			clearTimeout( timer );

		}

		function playPrev() {
			console.log( "RocketCarousel: playPrev" );

			var index = currentIndex - 1;
			if ( looping && index < 0 ) index = slides.length - 1;

			changeSlide( index, -1 );

		}

		function playNext() {
			console.log( "RocketCarousel: playNext" );

			var index = currentIndex + 1;
			if ( looping && index > slides.length - 1 ) index = 0;

			changeSlide( index, 1 );

		}

		function moveTo( index ) {
			console.log( "RocketCarousel: moveTo", index );

			changeSlide( index, false );

		}

		function slideTo( index ) {
			console.log( "RocketCarousel: slideTo", index );

			changeSlide( index, true );

		}


		// ----- PUBLIC EVENT LISTENERS ----- //


		/*************************************************
		 * CALL
		 *************************************************/
		init( elem, options );


		/*************************************************
		 * RETURN
		 *************************************************/
		return {
		 	destroy: destroy,
		 	disable: disable,
		 	enable: enable,
		 	execute: execute,
		 	moveTo: moveTo,
		 	play: play,
		 	playPrev: playPrev,
		 	playNext: playNext,
		 	slideTo: slideTo,
		 	stop: stop
		}

	}

	/*************************************************
	 * jQUERY PLUGIN
	 *************************************************/
	$.fn.rktCarousel = function( param1, param2 ) {

		this.each( function() {

			var $item = $( this );
			var pluginKey = "rkt-carousel";
			var obj = $item.data( pluginKey );

			if ( obj ) {

				obj.execute( param1, param2 );

			} else {

				obj = new RocketCarousel( this, param1 );
				$item.data( pluginKey, obj );

			}

		} );

		return this;

	};

}( jQuery ));
