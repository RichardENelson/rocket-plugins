/**
 * @title Rocket Cookie
 * @description Manages cookie alerts for websites built using the Fuel Microsite Template.
 * @version 0.0.3
 * @author Richard Nelson
 * @email richard.nelson@fuelintegrated.com
 */

(function( $ ) {

	"use strict";

	/*************************************************
	 * jQUERY PLUGIN
	 *************************************************/
	$.fn.rktCookie = function() {
		console.log( "new RocketCookie" );


		// ----- PRIVATE VARS -----//
		var $alert;
		var $btnClose;

		var cookieProperty;
		var cookieDays;
		var cookiePath;


		// ----- PRIVATE CONSTANTS ----- //
		var STYLE_HIDDEN = "hidden";


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "RocketCookie: init" );

			$alert = elem;
			$btnClose = $alert.find( ".btn-close" );

			cookieProperty = $alert.data( "cookie-property" );
			cookieDays = $alert.data( "cookie-days" );
			cookiePath = $alert.data( "cookie-path" );

			if ( getCookie( cookieProperty ) ) {

				removeAlert();

			} else {

				$alert.removeClass( "hidden" );
				$btnClose.on( "click", onClose );

			}

		}

		function getCookie( property ) {
			console.log( "RocketCookie: getCookie" );

			var name = property + "=";
			var ca = document.cookie.split( ";" );

			for( var i = 0; i < ca.length; i++ ) {

				var c = ca[ i ];
				while ( c.charAt( 0 ) === " " ) c = c.substring( 1 );
				if ( c.indexOf( name ) === 0 ) return c.substring( name.length, c.length );

			}

			return "";

		}

		function setCookie( property, value, days, path ) {
			console.log( "RocketCookie: setCookie" );
			console.info( property, value, days, path );

			var d = new Date();
			d.setTime( d.getTime() + ( days * 24 * 60 * 60 * 1000 ) );

			var expires = "expires=" + d.toUTCString();
			document.cookie = property + "=" + value + "; " + expires + "; path=" + path;

		}

		function removeAlert() {
			console.log( "RocketCookie: removeAlert" );

			$btnClose.off( "click", onClose );
			$alert.remove();

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onClose( e ) {
			console.log( "RocketCookie: onClose" );

			setCookie( cookieProperty, "true", cookieDays, cookiePath );
			removeAlert();

		}


		// ----- PRIVATE CALL ----- //
		init( this );

	};

}( jQuery ));
