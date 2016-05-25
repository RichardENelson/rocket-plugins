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

		$( "#main" ).rktReveal();

	}


	// ----- EVENT LISTENERS ----- //
	function onReady( e ) {
		console.log( "onReady" );

		init();

	}

	function onLoad( e ) {
		console.log( "onLoad" );

		$( "#main" )
			.rktReveal( "enable" )
			.rktReveal( "update" );

	}


	/*************************************************
	* CALL
	*************************************************/
	$( document ).ready( onReady );
	$( window ).load( onLoad );


})( this, jQuery );