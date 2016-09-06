/**
 * @title Rocket Parallax Image
 * @description Simple background image parallax effect.
 * @version 0.0.8
 * @author Richard Nelson
 * @email sc2071@gmail.com
 */

(function( $ ) {

	"use strict";

	/*************************************************
	 * CONSTANTS
	 *************************************************/
	var EVENT_CONTAINER_LOADED = "loaded.rocket.container";
	var EVENT_IMAGE_LOADED = "loaded.rocket.image";


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

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

		var containers;

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

			containers = [];

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
			var length = containers.length;

			for ( i; i < length; i++ ) {

				containers[i].updateBounds( windowHeight );
				containers[i].updateImages();

			};

		}

		function managePositions() {
			console.log( "RocketParallaxManager: managePositions" );

			docTop = $document.scrollTop();
			docBottom = docTop + windowHeight;

			var i = 0;
			var length = containers.length;

			for ( i; i < length; i++ ) {

				containers[i].updatePosition( docTop, docBottom );

			};

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onContainerLoaded( e, container ) {
			console.log( "RocketParallaxManager: onContainerLoaded" );

			container.updateBounds( windowHeight );
			container.updateImages();
			container.updatePosition( docTop, docBottom );

		}

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

			var container = new RocketParallaxContainer( elem, docTop, docBottom, windowHeight, bleed );
			container.getContainerElement().one( EVENT_CONTAINER_LOADED, onContainerLoaded );
			containers.push( container );

		}

		function destroy() {
			console.log( "RocketParallaxManager: destroy" );

			disable();

			var i = 0;
			var length = containers.length;

			for ( i; i < length; i++ ) {

				containers[i].destroy();

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

	};

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketParallaxContainer = function( elem, docTop, docBottom, windowHeight, bleed ) {
		console.log( "new RocketParallaxContainer" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var container;

		var $container;

		var containerWidth;
		var containerHeight;
		var containerTop;
		var containerBottom;
		var containerRange;

		var images;

		var isLoaded;
		var loadCount;


		// ----- PRIVATE CONSTANTS ----- //
		var SELECTOR_IMAGE = ".rkt-parallax-image";
		var STYLE_LOADED = "rkt-parallax-loaded";


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem, docTop, docBottom, windowHeight, bleed ) {
			console.log( "RocketParallaxContainer: init", docTop, docBottom, windowHeight, bleed );

			// Vars
			images = [];

			isLoaded = false;
			loadCount = 0;

			$container = $( elem );

			addImages();

			// Update Bounds
			updateBounds( windowHeight );
			updatePosition( docTop, docBottom );

		}

		function addImages() {
			console.log( "RocketParallaxContainer: addImages" );

			var $images = $container.find( SELECTOR_IMAGE );

			$images.each( function( i ) {

				var image = new RocketParallaxImage( $images[i], bleed );
				image.getElement().one( EVENT_IMAGE_LOADED, onImageLoaded );
				image.setup();

				images.push( image );

			} );

		}

		function loadImages() {
			console.log( "RocketParallaxContainer: loadImages" );
			console.info( isLoaded );
			console.info( images.length );

			if ( !isLoaded ) {

				var i = 0;
				var length = images.length;
				var image;

				for ( i; i < length; i++ ) {

					image = images[i];

					if ( image.getIsLoaded() ) {
						console.info( "RocketParallaxContainer: loadImages > already loaded" );

						onImageLoaded( null );

					} else {
						console.info( "RocketParallaxContainer: loadImages > loading image" );

						image.load();

					}

				}

			}

		}

		function showContainer() {
			console.log( "RocketParallaxContainer: showContainer" );

			$container.addClass( STYLE_LOADED );

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onImageLoaded( e ) {
			console.log( "RocketParallaxContainer: onImageLoaded" );

			loadCount++;

			if ( loadCount >= images.length ) {
				console.info( "RocketParallaxContainer: onImageLoaded > images loaded" );

				isLoaded = true;
				updateImages();
				showContainer();

				$container.trigger( EVENT_CONTAINER_LOADED, container );

			}

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function destroy() {
			console.log( "RocketParallaxContainer: destroy" );

			// TBD

		}

		function getContainerElement() {
			return $container;
		}

		function updateBounds( windowHeight ) {
			console.log( "RocketParallaxContainer: updateBounds", windowHeight );

			containerWidth = $container.outerWidth();
			containerHeight = $container.outerHeight();

			containerTop = $container.offset().top;
			containerBottom = containerTop + containerHeight;

			containerRange = windowHeight + containerHeight;

			//console.info( containerHeight, containerTop, containerBottom, containerRange );

		}

		function updateImages() {
			console.log( "RocketParallaxContainer: updateImages" );

			var i = 0;
			var length = images.length;
			var image;

			for ( i; i < length; i++ ) {

				image = images[i];
				image.updateImageSize( containerWidth, containerHeight );

			}

		}

		function updatePosition( docTop, docBottom ) {
			console.log( "RocketParallaxContainer: updatePosition", docTop, docBottom );

			if ( docBottom > containerTop && docTop < containerBottom ) {

				if ( !isLoaded )
					loadImages();

				var i = 0;
				var length = images.length;
				var image;

				for ( i; i < length; i++ ) {

					image = images[i];
					image.updateImagePosition( docTop, containerTop, containerHeight, containerRange );

				}

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
		container = {
		 	destroy: destroy,
		 	getContainerElement: getContainerElement,
		 	updateBounds: updateBounds,
		 	updateImages: updateImages,
		 	updatePosition: updatePosition
		};

		return container;

	};

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketParallaxImage = function( elem, bleed ) {
		console.log( "new RocketParallaxImage" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $image;

		var isLoaded;
		var isLoading;

		var imageBleed;
		var imagePercentY;
		var imageSource;

		var minBleed;
		var naturalWidth;
		var naturalHeight;


		// ----- PRIVATE CONSTANTS ----- //


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem, bleed ) {
			console.log( "RocketParallaxImage: init", bleed );

			// Vars
			$image = $( elem );

			isLoaded = false;
			isLoading = false;

			minBleed = $image.data( "bleed" ) || bleed || 100;

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

			naturalWidth = $image[0].naturalWidth;
			naturalHeight = $image[0].naturalHeight;

			console.info( "RocketParallaxImage: onLoad: Natural >", naturalWidth, naturalHeight );

			isLoaded = true;
			isLoading = false;

			$image.trigger( EVENT_IMAGE_LOADED );

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

		function setup() {
			console.log( "RocketParallaxImage: setup" );

			imagePercentY = 1;
			imageSource = getImageSource();

			naturalWidth = $image[0].naturalWidth;
			naturalHeight = $image[0].naturalHeight;

			isLoaded = ( naturalWidth && naturalHeight ) === true;

			if ( isLoaded ) {
				console.log( "RocketParallaxImage: ready > image is loaded" );

				$image.trigger( EVENT_IMAGE_LOADED );

			} else if ( $image.attr( "src" ) ) {
				console.warn( "RocketParallaxImage: ready > image is not loaded, source is set" );

				load();

			} else {
				console.warn( "RocketParallaxImage: ready > image is not loaded, source not set" );

			}

		}

		function load() {
			console.log( "RocketParallaxImage: load" );

			isLoading = true;

			if ( !$image.attr( "src" ) )
				$image.attr( "src", imageSource );

			var img = new Image();
			img.onload = onLoad;
			img.src = imageSource;

		}

		function getElement() {
			return $image;
		}

		function getIsLoaded() {
			return isLoaded;
		}

		function updateImageSize( containerWidth, containerHeight ) {
			console.log( "RocketParallaxImage: updateImageSize", containerWidth, containerHeight );

			// Vars
			var fillWidth = containerWidth;
			var fillHeight = containerHeight + minBleed * 2;

			var nWidth;
			var nHeight;
			var nX;
			var nY;

			// Check Naturals
			if ( !naturalWidth || !naturalHeight )
				console.error( "Natural Width & Height not set!" );

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

			console.info( "RocketParallaxImage: Container >", containerWidth, containerHeight );
			console.info( "RocketParallaxImage: Fill >", fillWidth, fillHeight );
			console.info( "RocketParallaxImage: Natural >", naturalWidth, naturalHeight );
			console.info( "RocketParallaxImage: New Dimensions >", nWidth, nHeight );

		}

		function updateImagePosition( docTop, containerTop, containerHeight, containerRange ) {
			console.log( "RocketParallaxImage: updateImagePosition", docTop, containerTop, containerHeight, containerRange );

			imagePercentY = ( containerTop + containerHeight - docTop ) / containerRange;
			updateTransform();

		}


		// ----- PUBLIC EVENT LISTENERS ----- //


		/*************************************************
		 * CALL
		 *************************************************/
		init( elem, bleed );


		/*************************************************
		 * RETURN
		 *************************************************/
		return {
		 	destroy: destroy,
		 	getElement: getElement,
		 	getIsLoaded: getIsLoaded,
		 	load: load,
		 	setup: setup,
		 	updateImageSize: updateImageSize,
		 	updateImagePosition: updateImagePosition
		}

	};


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

