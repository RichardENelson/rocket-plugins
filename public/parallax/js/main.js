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

		$( ".rkt-parallax" ).rktParallax();

	}


	// ----- EVENT LISTENERS ----- //
	function onReady( e ) {
		console.log( "onReady" );

		init();

	}

	function onLoad( e ) {
		console.log( "onLoad" );

		$( ".rkt-parallax" ).rktParallax( "enable" );

	}


	/*************************************************
	* CALL
	*************************************************/
	$( document ).ready( onReady );
	$( window ).load( onLoad );


})( this, jQuery );
