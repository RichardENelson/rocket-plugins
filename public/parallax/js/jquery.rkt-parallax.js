/**
 * @title Rocket Parallax Image
 * @description Simple background image parallax effect.
 * @version 0.0.7
 * @author Richard Nelson
 * @email sc2071@gmail.com
 */

(function( $ ) {

	"use strict";


	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketParallaxSingleton = (function() {
		console.log( "new RocketParallaxSingleton" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var instance;


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC FUNCTIONS ----- //
		function destroyInstance() {
			console.log( "RocketParallaxSingleton: destroyInstance" );

			instance = undefined;

		}

		function getInstance() {
			console.log( "RocketParallaxSingleton: getInstance" );

			if ( !instance ) {

				instance = new RocketParallaxManager();

			}

			return instance;

		}


		/*************************************************
		 * RETURN
		 *************************************************/
		return {
		 	destroyInstance: destroyInstance,
		 	getInstance: getInstance
		}


	}());

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketParallaxManager = function() {
		console.log( "new RocketParallaxManager" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $document;
		var $window;

		var enabled;
		var passiveSupported;

		var images;

		var docTop;
		var docBottom;

		var windowHeight;
		var windowTop;

		var resizeTimer;


		// ----- PRIVATE CONSTANTS ----- //
		var RESIZE_DELAY = 250;


		// ----- PRIVATE FUNCTIONS ----- //
		function init() {
			console.log( "RocketParallaxManager: init" );

			passiveSupported = getPassiveSupport();

			images = [];

			$document = $( document );
			$window = $( window );

			windowHeight = $window.height();
			windowTop = $window.scrollTop();

			docTop = $document.scrollTop();
			docBottom = docTop + windowHeight;

		}

		function clearResizeTimer() {
			//console.log( "RocketParallaxManager: clearResizeTimer" );

			if ( resizeTimer ) {

				clearTimeout( resizeTimer );
				resizeTimer = undefined;

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

		function manageBounds() {
			console.log( "RocketParallaxManager: manageBounds" );

			windowHeight = $( window ).height();

			var i = 0;
			var length = images.length;

			for ( i; i < length; i++ ) {

				images[i].updateBounds( windowHeight );
				images[i].updateImage();

			};

		}

		function managePositions() {
			console.log( "RocketParallaxManager: managePositions" );

			docTop = $document.scrollTop();
			docBottom = docTop + windowHeight;

			var i = 0;
			var length = images.length;

			for ( i; i < length; i++ ) {

				images[i].updatePosition( docTop, docBottom );

			};

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onResize( e ) {
			console.log( "RocketParallaxManager: onResize" );

			clearResizeTimer();
			resizeTimer = setTimeout( onResizeTimeout, RESIZE_DELAY );

		}

		function onResizeTimeout() {
			console.log( "RocketParallaxManager: onResizeTimeout" );

			clearResizeTimer();
			manageBounds();
			managePositions();

		}

		function onScroll( e ) {
			//console.log( "RocketParallaxManager: onScroll" );

			requestAnimationFrame( managePositions );

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function add( elem, options ) {
			console.log( "RocketParallaxManager: add" );

			var bleed = ( options ) ? options.bleed : undefined;

			var image = new RocketParallaxImage( elem, docTop, docBottom, windowHeight, bleed );
			images.push( image );

		}

		function destroy() {
			console.log( "RocketParallaxManager: destroy" );

			disable();

			var i = 0;
			var length = images.length;

			for ( i; i < length; i++ ) {

				images[i].destroy();

			};

		}

		function disable() {
			console.log( "RocketParallaxManager: disable" );

			enabled = false;

			clearResizeTimer();

			$window.off( "resize", onResize );
			$window[0].removeEventListener( "scroll", onScroll );

		}

		function enable() {
			console.log( "RocketParallaxManager: enable" );

			enabled = true;

			$window.on( "resize", onResize );

			if ( passiveSupported )
				$window[0].addEventListener( "scroll", onScroll, { passive: true } );
			else
				$window[0].addEventListener( "scroll", onScroll );

		}

		function execute( func, options ) {
			console.log( "RocketParallaxManager: execute -> " + func );

			this[ func ].call( this, options );

		}


		// ----- PUBLIC EVENT LISTENERS ----- //


		/*************************************************
		 * CALL
		 *************************************************/
		init();


		/*************************************************
		 * RETURN
		 *************************************************/
		return {
			add: add,
		 	destroy: destroy,
		 	disable: disable,
		 	enable: enable,
		 	execute: execute
		}

	}


	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketParallaxImage = function( elem, docTop, docBottom, windowHeight, bleed ) {
		console.log( "new RocketParallaxImage" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $container;
		var $image;

		var containerWidth;
		var containerHeight;
		var containerTop;
		var containerBottom;
		var containerRange;

		var isLoaded;
		var isLoading;

		var imageBleed;
		var imagePercentY;
		var imageSource;

		var minBleed;
		var naturalWidth;
		var naturalHeight;


		// ----- PRIVATE CONSTANTS ----- //
		var SELECTOR_IMAGE = ".rkt-parallax-image";
		var STYLE_LOADED = "rkt-parallax-loaded";


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem, docTop, docBottom, windowHeight, bleed ) {
			console.log( "RocketParallaxImage: init", docTop, docBottom, windowHeight, bleed );

			// Vars
			$container = $( elem );
			$image = $container.find( SELECTOR_IMAGE );
			minBleed = bleed || parseInt( $container.data( "bleed" ) ) || 100;
			naturalWidth = $image[0].naturalWidth;
			naturalHeight = $image[0].naturalHeight;
			isLoaded = ( naturalWidth && naturalHeight );
			isLoading = false;
			imagePercentY = 1;
			imageSource = getImageSource();

			// Update Bounds
			updateBounds( windowHeight );

			// Update Image if Loaded
			if ( isLoaded ) {

				updateImage();
				showImage();

			} else if ( $image.attr( "src" ) ) {

				loadImage();

			}

			// Update Position
			updatePosition( docTop, docBottom );

		}

		function getImageSource() {
			console.log( "RocketParallaxImage: getImageSource" );

			var pixelRatio = getPixelRatio();
			var srcset = $image.attr( "srcset" );

			if ( srcset ) {

				var ary = srcset.split( "," );

				ary.forEach( function( item ) {

					if ( item.indexOf( pixelRatio ) !== -1 )
						return item.replace( /(\b\s\dx|\s)/gi, "" );

				} );

			} else if ( $image.attr( "src" ) ) {

				return $image.attr( "src" );

			} else if ( $image.data( "src" + pixelRatio ) ) {

				return $image.data( "src" + pixelRatio );

			} else {

				return $image.data( "src" );

			}

		}

		function getPixelRatio() {
			console.log( "RocketParallaxImage: getPixelRatio" );

			var pixelRatio = window.devicePixelRatio || 1;

			if ( pixelRatio >= 2 )
				return "2x";

			return "1x";

		}

		function loadImage() {
			console.log( "RocketParallaxImage: loadImage" );

			isLoading = true;

			if ( !$image.attr( "src" ) )
				$image.attr( "src", imageSource );

			var img = new Image();
			img.onload = onLoad;
			img.src = imageSource;

		}

		function showImage() {
			console.log( "RocketParallaxImage: showImage" );

			$container.addClass( STYLE_LOADED );

		}

		function updateTransform() {
			console.log( "RocketParallaxImage: updateTransform" );

			if ( isLoaded ) {

				var imageTop = -imageBleed * 2 * imagePercentY;
				$image.css( { transform: "translate3d( 0px, " + imageTop + "px, 0px )" } );

				//console.info( "Image Percent Y:", imagePercentY, " - Image Top:", imageTop );

			}

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onLoad() {
			console.log( "RocketParallaxImage: onLoad", imageSource );

			isLoaded = true;
			isLoading = false;

			naturalWidth = $image[0].naturalWidth;
			naturalHeight = $image[0].naturalHeight;

			updateImage();
			updateTransform();

			showImage();

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function destroy() {
			console.log( "RocketParallaxImage: destroy" );

			$image.css( {
				width: "",
				height: "",
				left: "",
				top: "",
				transform: ""
			} );

		}

		function execute( func, options ) {
			console.log( "RocketParallaxImage: execute -> " + func );

			this[ func ].call( this, options );

		}

		function updateBounds( windowHeight ) {
			console.log( "RocketParallaxImage: updateBounds", windowHeight );

			containerWidth = $container.outerWidth();
			containerHeight = $container.outerHeight();

			containerTop = $container.offset().top;
			containerBottom = containerTop + containerHeight;

			containerRange = windowHeight + containerHeight;

			//console.info( containerHeight, containerTop, containerBottom, containerRange );

		}

		function updateImage() {
			console.log( "RocketParallaxImage: updateImage" );

			// Vars
			var fillWidth = containerWidth;
			var fillHeight = containerHeight + minBleed * 2;

			var nWidth;
			var nHeight;
			var nX;
			var nY;

			// Fill Width, Crop Height
			if ( naturalWidth / naturalHeight < fillWidth / fillHeight ) {

				nWidth = fillWidth;
				nHeight = fillWidth * naturalHeight / naturalWidth;

				nX = 0;
				nY = 0;

			// Fill Height, Crop Width
			} else {

				nWidth = fillHeight * naturalWidth / naturalHeight;
				nHeight = fillHeight;

				nX = -( nWidth - fillWidth ) / 2;
				nY = 0;

			}

			// Set Image Bleed
			imageBleed = ( nHeight - containerHeight ) / 2;

			// Set CSS
			$image.css( {
				width: nWidth,
				height: nHeight,
				left: nX,
				top: nY
			} );

			console.info( "Container:", containerWidth, containerHeight );
			console.info( "Fill:", fillWidth, fillHeight );
			console.info( "Natural:", naturalWidth, naturalHeight );
			console.info( "New Dimensions:", nWidth, nHeight );

		}

		function updatePosition( docTop, docBottom ) {
			console.log( "RocketParallaxImage: updatePosition", docTop, docBottom );

			if ( docBottom > containerTop && docTop < containerBottom ) {

				imagePercentY = ( containerTop + containerHeight - docTop ) / containerRange;

				if ( isLoaded )
					updateTransform();
				else if ( !isLoading )
					loadImage();

			}

		}


		// ----- PUBLIC EVENT LISTENERS ----- //


		/*************************************************
		 * CALL
		 *************************************************/
		init( elem, docTop, docBottom, windowHeight, bleed );


		/*************************************************
		 * RETURN
		 *************************************************/
		return {
		 	destroy: destroy,
		 	execute: execute,
		 	updateBounds: updateBounds,
		 	updateImage: updateImage,
		 	updatePosition: updatePosition
		}

	}


	/*************************************************
	 * jQUERY PLUGIN
	 *************************************************/
	$.fn.rktParallax = function() {

		var mgr = RocketParallaxSingleton.getInstance();

		var param0 = arguments[0];
		var param1 = arguments[1];

		this.each( function() {

			if ( typeof( param0 ) !== "string" ) {

				mgr.add( this, param0 );

			} else {

				mgr.execute( param0, param1 );

				if ( param0 === "destroy" )
					RocketParallaxSingleton.destroyInstance();

			}

		} );

		return this;

	};

}( jQuery ));

