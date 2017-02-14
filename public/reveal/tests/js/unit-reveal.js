(function( $, QUnit ) {

	// ----- VARS ----- //
	var $fixture = $( '#qunit-fixture' );
	var $html = $( 'html, body' );

	// ----- TESTS ----- //
	QUnit.test( 'Test Reveal Enable', function( assert ) {

		assert.expect( 1 );

		var $templateHtml = $( '<div>'
			+ '<div class="target rkt-reveal fade"></div>'
			+ '</div>' );
		$templateHtml.appendTo( $fixture );

		$fixture.rktReveal();
		$.fn.rktReveal( 'enable' );

		var events = $._data( window, 'events' );
		assert.notEqual( events[ 'resize' ], undefined );

	} );

	QUnit.test( 'Test Reveal Disable', function( assert ) {

		assert.expect( 1 );

		var $templateHtml = $( '<div>'
			+ '<div class="target rkt-reveal fade"></div>'
			+ '</div>' );
		$templateHtml.appendTo( $fixture );

		$fixture.rktReveal();
		$.fn.rktReveal( 'enable' );
		$.fn.rktReveal( 'disable' );

		var events = $._data( window, 'events' );
		assert.equal( events, undefined );

	} );


	QUnit.test( 'Test Reveal Scroll', function( assert ) {

		var done = assert.async();

		var $templateHtml = $( '<div class="wrapper">'
			+ '<div class="container">'
			+ '<div class="target rkt-reveal fade"></div>'
			+ '</div>'
			+ '</div>' );
		$templateHtml.appendTo( $fixture );

		$wrapper = $templateHtml;
		$container = $wrapper.find( '.container' );
		$target = $container.find( '.target' );

		$container.rktReveal();
		$.fn.rktReveal( 'enable' );
		$.fn.rktReveal( 'update' );

		$wrapper.scrollTop( 1000 );

		setTimeout( function() {

			$.fn.rktReveal( 'update' );
			assert.equal( $target.hasClass( 'rkt-reveal' ), true );
			done();

		}, 110 );

	} );

})( jQuery, QUnit );