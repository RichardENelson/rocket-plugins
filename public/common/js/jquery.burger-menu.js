/**
 * @title Burger Menu
 * @description Collapsable menu for mobile and small screen devices.
 * @version 0.0.1
 * @author Richard Nelson
 * @email richard.nelson@fuelintegrated.com
 */

(function( $ ) {

	"use strict";

	$.fn.burgerMenu = function() {
		console.log( "new BurgerMenu" );

		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS -----//
		var $body;
		var $btn;
		var $menu;
		var mediaQuery;
		var isActive;


		// ----- PRIVATE CONSTANTS ----- //
		var STYLE_OPEN = "menu-open";
		var STYLE_CLOSE = "menu-close";


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "BurgerMenu: init" );

			$body = $( "body" );
			$btn = elem;
			$menu = $( $btn.data( "target" ) );
			mediaQuery = $menu.data( "media-query" );
			isActive = false;

			detectActive();

			// Add Event Listeners
			$btn.on( "click", onToggle );
			$menu.find( "a" ).on( "click", onClick );
			$( window ).on( "resize", onResize );

		}

		function detectActive() {
			console.log( "BurgerMenu: detectActive" );

			var mq = ( window.matchMedia ) ? window.matchMedia( mediaQuery ) : { matches:false };

			if ( mq.matches && !isActive ) {

				console.info( "Menu Active" );
				isActive = true;
				hideMenu();

			} else if ( !mq.matches && isActive ) {

				console.info( "Menu Inactive" );
				isActive = false;
				showMenu();

			} else if ( !mq.matches ) {

				$body.removeClass( STYLE_OPEN );
				$body.removeClass( STYLE_CLOSE );

			}

		}

		function showMenu() {
			console.log( "BurgerMenu: showMenu" );

			$body.addClass( STYLE_OPEN );
			$body.removeClass( STYLE_CLOSE );

		}

		function hideMenu() {
			console.log( "BurgerMenu: hideMenu" );

			$body.removeClass( STYLE_OPEN );
			$body.addClass( STYLE_CLOSE );

		}

		function toggleMenu() {
			console.log( "BurgerMenu: toggleMenu" );

			if ( $body.hasClass( STYLE_OPEN ) ) {

				hideMenu();

			} else {

				showMenu();

			}

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onClick( e ) {
			console.log( "BurgerMenu: onClick" );

			hideMenu();

		}

		function onResize( e ) {

			detectActive();

		}

		function onToggle( e ) {
			console.log( "BurgerMenu: onToggle" );

			toggleMenu();

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- OBJECT ----- //
		var menu = {};

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC GET/SET FUNCTIONS ----- //

		// ----- PUBLIC FUNCTIONS ----- //


		/*************************************************
		 * CALL
		 *************************************************/
		init( this );


		/*************************************************
		 * RETURN
		 *************************************************/
		return menu;


	};

}( jQuery ));
