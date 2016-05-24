/**
 * @title ImageLoader
 * @description Loads images via JavaScript.
 * @version 0.0.1
 * @author Richard Nelson
 * @github https://github.com/DeadCowboy
 */

(function( global ) {

	"use strict";

	// ----- CONSTRUCTOR ----- //
	global.ImageLoader = function( imagesArray ) {
		console.log( "new ImageLoader" );

		this.imagesArray = imagesArray;

	};

	// ----- PROTOTYPE ----- //
	global.ImageLoader.prototype = {

		// ----- VARS ----- //
		imagesArray: undefined,
		imagesLoaded: 0,
		imagesTotal: 0,
		loadLimit: 99999,
		queueLoaded: 0,
		queueTotal: 0,

		// ----- FUNCTIONS ----- //
		load: function() {
			console.log( "ImageLoader: load" );

			this.imagesLoaded = 0;
			this.imagesTotal = this.imagesArray.length;

			this.queueTotal = ( this.loadLimit < this.imagesTotal ) ? this.loadLimit : this.imagesTotal;

			this.loadNext();

		},

		loadNext: function() {
			console.log( "ImageLoader: loadNext" );

			var imagesRemaining = this.imagesTotal - this.imagesLoaded;

			this.queueLoaded = 0;
			this.queueTotal = ( imagesRemaining < this.loadLimit ) ? imagesRemaining : this.loadLimit;

			var i = this.imagesLoaded;
			var length = this.imagesLoaded + this.queueTotal;
			var self = this;

	        for ( i; i < length; i++ ) {

	            var image = new Image();
	            image.onload = function() { self.onImageLoad(); };
	            image.src = this.imagesArray[i];

	        }

		},

		// ----- EVENT LISTENERS ----- //
		onImageLoad: function( e ) {
			console.log( "ImageLoader: onImageLoad" );

			this.imagesLoaded++;
			this.queueLoaded++;

	        if ( this.imagesLoaded === this.imagesTotal
	        	 && typeof( this.onComplete ) === "function" ) {

	        	this.onComplete();

			} else if ( this.queueLoaded === this.queueTotal ) {

				this.loadNext();

			}

		},

		// ----- CALLBACKS ----- //
		onComplete: undefined

	};

}( this ));
