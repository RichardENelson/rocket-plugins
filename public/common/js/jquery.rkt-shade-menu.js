/**
 * @title Rocket Shade Menu
 * @description
 * @version 0.0.1
 * @author Richard Nelson
 * @email richard.nelson@fuelintegrated.com
 */

(function( $ ) {

	"use strict";

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketShadeMenu = function( elem ) {
		console.log( "new RocketShadeMenu" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $menu;
		var $menuButton;
		var $menuLinks;
		var enabled;


		// ----- PRIVATE CONSTANTS ----- //
		var STYLE_MENU_OPEN = "menu-open";


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "RocketShadeMenu: init" );

			$menuButton = $( elem );
			$menu = $( $menuButton.data( "target" ) );
			$menuLinks = $menu.find( "a" );

			enabled = false;

		}

		function openMenu() {
			console.log( "RocketShadeMenu: openMenu" );

			$menu.addClass( STYLE_MENU_OPEN );
			$menuButton.addClass( STYLE_MENU_OPEN );

		}

		function closeMenu() {
			console.log( "RocketShadeMenu: closeMenu" );

			$menu.removeClass( STYLE_MENU_OPEN );
			$menuButton.removeClass( STYLE_MENU_OPEN );

		}

		function toggleMenu() {
			console.log( "RocketShadeMenu: toggleMenu" );

			if ( $menu.hasClass( STYLE_MENU_OPEN ) )
			    closeMenu();
		    else
		       	openMenu();

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onMenuButtonClick( e ) {
			console.log( "RocketShadeMenu: onMenuButtonClick" );

			toggleMenu();

		}

		function onMenuLinkClick( e ) {
			console.log( "RocketShadeMenu: onMenuLinkClick" );

			closeMenu();

		}



		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function destroy() {
			console.log( "RocketShadeMenu: destroy" );

			disable();

		}

		function execute( func, options ) {
			console.log( "RocketShadeMenu: execute -> " + func );

			this[ func ].call( this, options );

		}

		function enable() {
			console.log( "RocketShadeMenu: enable" );

			$menuButton.on( "click", onMenuButtonClick );
			$menuLinks.on( "click", onMenuLinkClick );

		}

		function disable() {
			console.log( "RocketShadeMenu: disable" );

			$menuButton.off( "click", onMenuButtonClick );
			$menuLinks.off( "click", onMenuLinkClick );

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
	$.fn.rktShadeMenu = function( param1, param2 ) {

		this.each( function() {

			var $item = $( this );
			var pluginKey = "rkt-shade-menu";
			var obj = $item.data( pluginKey );

			if ( obj ) {

				obj.execute( param1, param2 );

			} else {

				obj = new RocketShadeMenu( this, param1 );
				$item.data( pluginKey, obj );

			}

		} );

		return this;

	};

}( jQuery ));
