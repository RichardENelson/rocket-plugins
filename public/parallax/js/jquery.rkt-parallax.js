/**
 * @title Rocket Parallax Image
 * @description Simple background image parallax effect.
 * @version 0.0.3
 * @author Richard Nelson
 * @email sc2071@gmail.com
 */

(function( $ ) {

	"use strict";


	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketParallaxManager = function( elem ) {
		console.log( "new RocketParallaxManager" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $parent;

		var imageSelector;

		var images;
		var reqBounds;
		var reqBackgroundPositions;
		var type;
		var windowHeight;


		// ----- PRIVATE CONSTANTS ----- //
		var TYPE_SCROLL = "scroll";
		var TYPE_TRANSFORM = "transform";


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "RocketParallaxManager: init" );

			// Vars
			$parent = $( elem );
			images = [];
			imageSelector = ".parallax-image";


			// Options
			type = $parent.data( "parallax-type" ) || TYPE_SCROLL;


			// Setup
			addImages();
			manageBounds();
			managePositions();


			// Add Listeners
			$( window ).on( "resize", onResize );

			if ( type === TYPE_SCROLL )
				$( window ).on( "scroll", onScroll );
			else if ( type === TYPE_TRANSFORM )
				$parent.on( "transitionupdate", onTransitionUpdate );

		}

		function addImages() {
			console.log( "RocketParallaxManager: addImages" );

			$parent.find( imageSelector ).each( function( i ) {

				add( this );

			} );

		}

		function getParentTop() {

			if ( type === TYPE_SCROLL ) {

				return $parent.scrollTop();

			} else if ( type === TYPE_TRANSFORM ) {

				var matrix = $parent.css( "transform" ).replace( /[a-zA-Z\s\(\)]/gi, "" ).split( "," );
				return -matrix[ 5 ];

			}

		}

		function manageBounds() {
			//console.log( "RocketParallaxManager: manageBounds" );

			windowHeight = $( window ).height();

			$.each( images, function( i, img ) {

				img.updateBounds( windowHeight );

			} );

			reqBounds = undefined;

		}

		function managePositions() {
			//console.log( "RocketParallaxManager: managePositions" );

			$.each( images, function( i, img ) {

				img.updatePosition( windowHeight );

			} );

			reqBackgroundPositions = undefined;

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onResize( e ) {
			//console.log( "RocketParallaxManager: onResize" );

			if ( reqBounds )
				cancelAnimationFrame( reqBounds );

			reqBounds = requestAnimationFrame( manageBounds );

			if ( reqBackgroundPositions )
				cancelAnimationFrame( reqBackgroundPositions );

			reqBackgroundPositions = requestAnimationFrame( managePositions );

		}

		function onScroll( e ) {
			//console.log( "RocketParallaxManager: onScroll" );

			if ( reqBackgroundPositions )
				cancelAnimationFrame( reqBackgroundPositions );

			reqBackgroundPositions = requestAnimationFrame( managePositions );

		}

		function onTransitionUpdate() {
			//console.log( "RocketParallaxManager: onTransitionUpdate" );

			managePositions();

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function add( elem ) {
			console.log( "RocketParallaxManager: add" );

			var img = new RocketParallaxImage( elem );
			images.push( img );

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
		 	add: add
		}

	}


	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketParallaxImage = function( elem ) {
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

		var naturalWidth;
		var naturalHeight;

		var imageBleed;
		var parallaxBleedMin;


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "RocketParallaxImage: init" );

			// Vars
			$image = $( elem );
			$container = $image.parent();
			naturalWidth = $image[0].naturalWidth;
			naturalHeight = $image[0].naturalHeight;
			parallaxBleedMin = parseInt( $image.data( "parallax-bleed-min" ) ) || 100;

			// Style Container
			$container.css( {
				position: "relative",
				overflow: "hidden"
			} );

		}

		function updateImage() {
			//console.log( "RocketParallaxImage: updateImage" );

			// Vars
			var fillWidth = containerWidth;
			var fillHeight = containerHeight + parallaxBleedMin * 2;

			// Update Natural Dimensions
			naturalWidth = naturalWidth || $image[0].naturalWidth;
			naturalHeight = naturalHeight || $image[0].naturalHeight;

			//console.info( "Container Dimensions: ", containerWidth, containerHeight );
			//console.info( "Fill Dimensions: ", fillWidth, fillHeight );
			//console.info( "Image Dimensions: ", naturalWidth, naturalHeight );

			var nWidth;
			var nHeight;
			var nX;
			var nY;

			// Fill Width, Crop Height
			if ( naturalWidth / naturalHeight < fillWidth / fillHeight ) {

				nWidth = fillWidth;
				nHeight = fillWidth * naturalHeight / naturalWidth;

				nX = 0;
				//nY = -( nHeight - containerHeight ) / 2;
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
				display: "block",
				position: "absolute",
				margin: 0,
				border: 0,
				padding: 0,
				width: nWidth,
				height: nHeight,
				left: nX,
				top: nY
			} );

		}


		// ----- PRIVATE EVENT LISTENERS ----- //


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC FUNCTIONS ----- //
		function updateBounds( windowHeight ) {
			//console.log( "RocketParallaxImage: updateBounds ", windowHeight );

			containerWidth = $container.outerWidth();
			containerHeight = $container.outerHeight();

			containerRange = windowHeight + containerHeight * 2;

			updateImage();

		}

		function updatePosition( windowHeight ) {
			//console.log( "RocketParallaxImage: updatePosition", windowHeight );

			containerTop = $container.offset().top;

			var windowTop = 0;
			var windowBottom = windowTop + windowHeight;

			var limitTop = windowTop - containerHeight;
			var limitBottom = windowBottom + containerHeight;

			//console.info( "Window: ", windowHeight, windowTop, windowBottom );
			//console.info( "Limit: ", limitTop, limitBottom );
			//console.info( "Container: ", containerTop );

			if ( containerTop > limitTop && containerTop < limitBottom ) {

				var percentY = ( containerTop + containerHeight ) / containerRange;
				var imageTop = -imageBleed * 2 * percentY;

				$image.css( { transform: "translate3d( 0px, " + imageTop + "px, 0px )" } );
				//$image.attr( "percent-y", percentY );
				//$image.attr( "image-bleed", imageBleed );

			}

		}


		/*************************************************
		 * CALL
		 *************************************************/
		init( elem );


		/*************************************************
		 * RETURN
		 *************************************************/
		return {
		 	updateBounds: updateBounds,
		 	updatePosition: updatePosition
		}

	}


	/*************************************************
	 * jQUERY PLUGIN
	 *************************************************/
	$.fn.rktParallax = function( param1, param2 ) {

		this.each( function() {

			var $item = $( this );
			var pluginKey = "rkt-parallax";
			var obj = $item.data( pluginKey );

			if ( obj ) {

				obj.execute( param1, param2 );

			} else {

				obj = new RocketParallaxManager( this, param1 );
				$item.data( pluginKey, obj );

			}

		} );

		return this;

	};

}( jQuery ));

