/**
 * @title Swap SVG
 * @description Swaps out SVG images for PNG.
 * @version 0.0.1
 * @author Richard Nelson
 * @github https://github.com/DeadCowboy
 */

(function( $, Modernizr ) {

	"use strict";

	$.extend( {

		swapSVG: function( options ) {

			/*************************************************
			 * PRIVATE
			 *************************************************/

			// ----- PRIVATE VARS ----- //

			// ----- PRIVATE CONSTANTS ----- //

			// ----- PRIVATE FUNCTIONS ----- //
			function init( options ) {
				console.log( "SwapSVG: init" );

				// Swap SVG Images with Fallback Images
				if ( !Modernizr.svg || !Modernizr.smil ) {

					var $img;
					var source;
					var fallback;

					$( "img" ).each( function( i ) {

						$img = $( this );
						source = $img.attr( "src" );
						fallback = $img.data( "svg-fallback" );

						if ( fallback ) {

							$img.attr( "src", fallback );

						} else if ( source && source.indexOf( ".svg" ) !== -1 ) {

							source = source.replace( ".svg", ".png" );
							$img.attr( "src", source );

						}

					} );

				}

			}

			// ----- PRIVATE EVENT LISTENERS ----- //


			/*************************************************
			 * PUBLIC
			 *************************************************/

			// ----- PUBLIC VARS ----- //

			// ----- PUBLIC CONSTANTS ----- //

			// ----- PUBLIC FUNCTIONS ----- //

			// ----- PUBLIC EVENT LISTENERS ----- //


			/*************************************************
			 * CALL
			 *************************************************/
			init( options );

			 /*************************************************
			 * RETURN
			 *************************************************/


		}

	} );

}( jQuery, Modernizr ));

