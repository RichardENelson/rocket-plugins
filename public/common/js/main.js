(function( global, $ ) {

	"use strict";

	/*************************************************
	* PRIVATE
	*************************************************/

	// ----- VARS ----- //


	// ----- CONSTANTS ----- //


	// ----- GET/SET FUNCTIONS ----- //

	// ----- FUNCTIONS ----- //
	function init() {
		console.log( "init" );

		testPluginTemplate();

	}

	function testPluginTemplate() {
		console.log( "testPluginTemplate" );

		$( "#main" ).pluginName();
		$( "#main" ).pluginName( "increment" );

	}


	// ----- EVENT LISTENERS ----- //
	function onReady( e ) {
		console.log( "onReady" );

		init();

	}

	function onLoad( e ) {
		console.log( "onLoad" );

	}



	/*************************************************
	* PUBLIC
	*************************************************/

	// ----- OBJECT ----- //
	var main = {

		// ----- VARS ----- //

		// ----- CONSTANTS ----- //

		// ----- GET/SET FUNCTIONS ----- //

		// ----- FUNCTIONS ----- //

		// ----- EVENT LISTENERS ----- //

	};

	// ----- GLOBAL ----- //
	//global.main = main;


	/*************************************************
	* CALL
	*************************************************/
	$( document ).ready( onReady );
	$( window ).load( onLoad );


})( this, jQuery );
