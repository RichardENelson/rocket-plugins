/**
 * @title pluginName
 * @description [plugin description]
 * @version 0.0.2
 * @author Richard Nelson
 * @email richard.nelson@fuelintegrated.com
 */

(function( $ ) {

	"use strict";

	/*************************************************
	 * PROTOTYPE
	 *************************************************/
	var ClassName = function( elem ) {
		console.log( "new ClassName" );


		/*************************************************
		 * PRIVATE
		 *************************************************/

		// ----- PRIVATE VARS ----- //
		var $elem;
		var _enabled;
		var _count;


		// ----- PRIVATE CONSTANTS ----- //


		// ----- PRIVATE FUNCTIONS ----- //
		function init( elem ) {
			console.log( "ClassName: init" );

			$elem = $( elem );
			_count = 0;

			increment();

		}


		// ----- PRIVATE EVENT LISTENERS ----- //
		function onEvent( e ) {
			console.log( "ClassName: onEvent" );

		}


		/*************************************************
		 * PUBLIC
		 *************************************************/

		// ----- PUBLIC VARS ----- //

		// ----- PUBLIC CONSTANTS ----- //

		// ----- PUBLIC FUNCTIONS ----- //
		function destroy() {
			console.log( "ClassName: destroy" );

			disable();

		}

		function disable() {
			console.log( "ClassName: disable" );

			_enabled = false;

		}

		function enable() {
			console.log( "ClassName: enable" );

			_enabled = true;

		}

		function execute( func, options ) {
			console.log( "ClassName: execute -> " + func );

			this[ func ].call( this, options );

		}

		function increment() {
			console.log( "ClassName: increment" );

			_count++;
			console.info( _count );

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
		 	execute: execute,
		 	increment: increment
		}

	}

	/*************************************************
	 * jQUERY PLUGIN
	 *************************************************/
	$.fn.pluginName = function( param1, param2 ) {

		this.each( function() {

			var $item = $( this );
			var pluginKey = "plugin-name";
			var obj = $item.data( pluginKey );

			if ( obj ) {

				obj.execute( param1, param2 );

			} else {

				obj = new ClassName( this, param1 );
				$item.data( pluginKey, obj );

			}

		} );

		return this;

	};

}( jQuery ));
