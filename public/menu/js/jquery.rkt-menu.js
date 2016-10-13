/**
 * @title Rocket Menu
 * @description Handles simple menus expand/collapse within mobile views.
 * @version 0.0.2
 * @author Richard Nelson
 * @email richard.nelson@fuelintegrated.com
 */

(function( $ ) {

	"use strict";


	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var RocketMenu = function( elem ) {
		console.log( "new RocketMenu" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $body;
		var $btn;
		var $menu;

		var $menuItems;
		var $menuLinks;
		var $backLinks;

		var $openLink;
		var $openSubmenu;

		var enabled;


		// ----- PRIVATE CONSTANTS ----- //
		var ARIA_EXPANDED = "aria-expanded";

		var EVENT_TRANSITION_END = "transitionend webkitTransitionEnd otransitionend MSTransitionEnd";

		var SELECTOR_BACK_LINK = ".back-link";
		var SELECTOR_MENU_ITEM = ".menu-item";
		var SELECTOR_MENU_LINK = ".menu-link";

		var STYLE_MENU_OPEN = "menu-open";
		var STYLE_SUBMENU_OPEN= "open";
		var STYLE_TRANSITIONED = "transitioned";


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "RocketMenu: init" );

			$body = $( "body" );
			$btn = $( elem );
			$menu = $( $btn.data( "target" ) );

			$menuItems = $menu.find( SELECTOR_MENU_ITEM );
			$menuLinks = $menu.find( SELECTOR_MENU_LINK );
			$backLinks = $menu.find( SELECTOR_BACK_LINK );

		}


		// ----- PRIVATE FUNCTIONS - MENU ----- //
		function showMenu() {
			console.log( "RocketMenu: showMenu" );

			if ( $openLink )
				hideSubmenu( false );

			$menu.on( EVENT_TRANSITION_END, onMenuTransitionEnd );
			$body.addClass( STYLE_MENU_OPEN );

		}

		function hideMenu() {
			console.log( "RocketMenu: hideMenu" );

			$menu.on( EVENT_TRANSITION_END, onMenuTransitionEnd );
			$body.removeClass( STYLE_MENU_OPEN );

		}

		function toggleMenu() {
			console.log( "RocketMenu: toggleMenu" );

			if ( $body.hasClass( STYLE_MENU_OPEN ) )
				hideMenu();
			else
				showMenu();

		}


		// ----- PRIVATE FUNCTIONS - SUBMENU ----- //
		function showSubmenu( transitioned ) {
			console.log( "RocketMenu: showSubmenu" );

			// Add Open Class to Item
			$openLink.parent().addClass( STYLE_SUBMENU_OPEN );

			// Get Submenu
			$openSubmenu = $( $openLink.data( "target" ) );

			// Add ARIA Expanded State
			$openLink.attr( ARIA_EXPANDED, true );
			$openSubmenu.attr( ARIA_EXPANDED, true );

			// Transitioned?
			if ( transitioned ) {

				$openSubmenu.addClass( STYLE_TRANSITIONED );
				$openSubmenu.on( EVENT_TRANSITION_END, onSubmenuTransitionEnd );

			}

			// Add Style
			$openSubmenu.addClass( STYLE_SUBMENU_OPEN );

		}

		function hideSubmenu( transitioned ) {
			console.log( "RocketMenu: hideSubmenu" );

			// Remove Open Class to Item
			$openLink.parent().removeClass( STYLE_SUBMENU_OPEN );

			// Remove ARIA Expanded State
			$openLink.attr( ARIA_EXPANDED, false );
			$openSubmenu.attr( ARIA_EXPANDED, false );

			// Transitioned?
			if ( transitioned ) {

				$openSubmenu.addClass( STYLE_TRANSITIONED );
				$openSubmenu.on( EVENT_TRANSITION_END, onSubmenuTransitionEnd );

			}

			// Remove Style
			$openSubmenu.removeClass( STYLE_SUBMENU_OPEN );

			// Delete Current Open Link
			$openLink = undefined;
			$openSubmenu = undefined;

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onBodyClick( e ) {
			console.log( "RocketMenu: onBodyClick" );

			if ( $openSubmenu && !$.contains( $openSubmenu[0], e.target ) )
			    hideSubmenu( true );
			else if ( $body.hasClass( STYLE_MENU_OPEN ) && !$.contains( $menu[0], e.target ) )
				hideMenu();

		}

		function onBackLinkClick( e ) {
			console.log( "RocketMenu: onBackLinkClick" );

			hideSubmenu( true );

		}

		function onMenuButtonClick( e ) {
			console.log( "RocketMenu: onMenuButtonClick" );

			e.stopPropagation();
			toggleMenu();

		}

		function onMenuLinkClick( e ) {
			console.log( "RocketMenu: onMenuLinkClick" );

			e.preventDefault();
			e.stopPropagation();

			var $link = $( e.currentTarget );

			if ( $openLink && $openLink[0] === $link[0] ) {

				hideSubmenu( true );

			} else {

				if ( $openLink )
					hideSubmenu( false );

				$openLink = $link;
				showSubmenu( true );

			}

		}

		function onMenuTransitionEnd( e ) {
			console.log( "RocketMenu: onMenuTransitionEnd" );

			$menu.off( EVENT_TRANSITION_END, onMenuTransitionEnd );

			if ( !$body.hasClass( STYLE_MENU_OPEN ) && $openLink )
				hideSubmenu( false );

		}

		function onSubmenuTransitionEnd( e ) {
			console.log( "RocketMenu: onSubmenuTransitionEnd" );

			var $submenu = $( e.currentTarget );

			$submenu.off( EVENT_TRANSITION_END, onSubmenuTransitionEnd );
			$submenu.removeClass( STYLE_TRANSITIONED );

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function destroy() {
			console.log( "RocketMenu: destroy" );

			disable();

			$body.off( "click", onBodyClick );
			$menu.off( EVENT_TRANSITION_END, onMenuTransitionEnd );

			if ( $openSubmenu ) {

				$openSubmenu
					.off( EVENT_TRANSITION_END, onSubmenuTransitionEnd )
					.removeClass( STYLE_SUBMENU_OPEN )
					.removeClass( STYLE_TRANSITIONED );

			}

		}

		function disable() {
			console.log( "RocketMenu: disable" );

			enabled = false;
			$backLinks.off( "click", onBackLinkClick );
			$body.off( "click", onBodyClick );
			$btn.off( "click", onMenuButtonClick );
			$menuLinks.off( "click", onMenuLinkClick );

		}

		function enable() {
			console.log( "RocketMenu: enable" );

			enabled = true;
			$backLinks.on( "click", onBackLinkClick );
			$body.on( "click", onBodyClick );
			$btn.on( "click", onMenuButtonClick );
			$menuLinks.on( "click", onMenuLinkClick );

		}

		function execute( func, options ) {
			console.log( "RocketMenu: execute -> " + func );

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
	$.fn.rktMenu = function() {

		var param0 = arguments[0]; // Command or Options
		var param1 = arguments[1]; // Options

		this.each( function() {

			var $item = $( this );
			var pluginKey = "rkt-menu";
			var obj = $item.data( pluginKey );

			if ( obj ) {

				obj.execute( param0, param1 );

			} else {

				obj = new RocketMenu( this, param0 );
				$item.data( pluginKey, obj );

			}

		} );

		return this;

	};

}( jQuery ));
