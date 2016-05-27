/**
 * @title FullpageJS Parallax
 * @description A helper plugin to parallax scroll images as sections transition up/down.
 * @version 0.0.2
 * @author Richard Nelson
 * @email richard.nelson@fuelintegrated.com
 */

(function( $ ) {

	"use strict";

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var FullpageParallaxImage = function( elem, options ) {
		console.log( "new FullpageParallaxImage" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $container;
		var $image;

		var containerWidth;
		var containerHeight;

		var isLoaded;

		var imageBleed;
		var imagePercentY;

		var minBleed;
		var naturalWidth;
		var naturalHeight;


		// ----- PRIVATE CONSTANTS ----- //


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem, options ) {
			console.log( "FullpageParallaxImage: init" );

			// Vars
			$image = $( elem );
			$container = $image.parent();
			naturalWidth = $image[0].naturalWidth;
			naturalHeight = $image[0].naturalHeight;
			isLoaded = ( naturalWidth && naturalHeight );
			imagePercentY = 1;

			// Minimum Bleed
			var bleed = ( options ) ? options.bleed : undefined;
			minBleed = bleed || parseInt( $image.data( "bleed" ) ) || 100;

			// Stuff
			if ( isLoaded ) {

				updateBounds();
				updateImage();
				updatePosition();

			} else {

				loadImage();

			}

		}

		function loadImage() {
			//console.log( "FullpageParallaxImage: loadImage" );

			var img = new Image();
			img.onload = onLoad;
			img.src = $image.attr( "src" );

		}

		function updateBounds() {
			//console.log( "FullpageParallaxImage: updateBounds" );

			containerWidth = $container.outerWidth();
			containerHeight = $container.outerHeight();

		}

		function updateImage() {
			console.log( "FullpageParallaxImage: updateImage" );

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

		}

		function updatePosition() {
			console.log( "FullpageParallaxImage: updatePosition" );

			var imageTop = -imageBleed * 2 * imagePercentY;
			$image.css( { transform: "translate3d( 0px, " + imageTop + "px, 0px )" } );

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onLoad() {
			console.log( "FullpageParallaxImage: onLoad" );

			isLoaded = true;

			naturalWidth = $image[0].naturalWidth;
			naturalHeight = $image[0].naturalHeight;

			updateBounds();
			updateImage();
			updatePosition( imagePercentY );

		}



		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function destroy() {
			console.log( "FullpageParallaxImage: destroy" );

			disable();

		}

		function execute( func, options ) {
			console.log( "FullpageParallaxImage: execute -> " + func );

			this[ func ].call( this, options );

		}

		function resize() {
			console.log( "FullpageParallaxImage: resize" );

			if ( isLoaded ) {

				updateBounds();
				updateImage();
				updatePosition();

			}

		}

		function transition( options ) {
			console.log( "FullpageParallaxImage: transition" );

			var active = options.active;
			var direction = options.direction;

			imagePercentY = 0.5;

			if ( !active )
				imagePercentY = ( direction === "up" ) ? 1 : 0;

			if ( isLoaded )
				updatePosition();

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
		 	execute: execute,
		 	resize: resize,
		 	transition: transition
		}

	}

	/*************************************************
	 * jQUERY PLUGIN
	 *************************************************/
	$.fn.fpParallaxImage = function() {

		var param0 = arguments[0];
		var param1 = arguments[1];

		this.each( function() {

			var $item = $( this );
			var pluginKey = "fp-parallax-image";
			var obj = $item.data( pluginKey );

			if ( obj ) {

				obj.execute( param0, param1 );

			} else {

				obj = new FullpageParallaxImage( this, param0 );
				$item.data( pluginKey, obj );

			}

		} );

		return this;

	};

}( jQuery ));
