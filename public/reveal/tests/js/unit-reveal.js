(function( $, QUnit ) {

	QUnit.test( 'Test Reveal', function( assert ) {

		console.info( assert );

		assert.expect( 1 );

		var $templateHtml = $( '<div>'
			+ '<div class="rkt-reveal" style="float: left; width: 100px; height: 100px;"></div>'
			+ '</div>' );

		$templateHtml.appendTo( '#qunit-fixture' );
		var $elem = $templateHtml.find( 'div' );

		assert.equal( $elem.hasClass( 'rkt-reveal' ), true );

	} );

})( jQuery, QUnit );