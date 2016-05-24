 module.exports = function(grunt){

	"use strict";

	grunt.initConfig( {

		pkg: grunt.file.readJSON( "package.json" ),

		copy: {
			build: {
				files: [

					// Bootstrap
					{
						expand: true,
						cwd: "bower_components/bootstrap/dist/css/",
						src: [ "bootstrap.min.*" ],
						dest: "public/common/css"
					},
					{
						expand: true,
						cwd: "bower_components/bootstrap/dist/js/",
						src: [ "bootstrap.min.js" ],
						dest: "public/common/js/vendor"
					},

					// FontAwesome
					{
						expand: true,
						cwd: "bower_components/components-font-awesome/css/",
						src: [ "font-awesome.css.map", "font-awesome.min.css" ],
						dest: "public/common/css"
					},
					{
						expand: true,
						cwd: "bower_components/components-font-awesome/fonts/",
						src: [ "*-webfont.*" ],
						dest: "public/common/fonts"
					},

					// jQuery
					{
						expand: true,
						cwd: "bower_components/jquery/dist/",
						src: [ "*.min.*" ],
						dest: "public/common/js/vendor"
					}
				]
			}
		},

		sass: {
			options: {
				sourceMap: false
			},
			prod: {
				files: {
					"public/common/css/main.css": "public/common/sass/main/main.scss"
				}
			}
		},

		postcss: {
			options: {
				processors: [
					require( "autoprefixer" )( {
						browsers: "last 2 versions"
					} ),
					require( "cssnano" )( {
						discardComments: { removeAll: true },
						safe: true
					} )
				]
			},
			build: {
				files: {
					"public/common/css/main.min.css": "public/common/css/main.css"
				}
			}
		},

		uglify: {
			options: {
				banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - " + "<%= grunt.template.today('yyyy-mm-dd H:M') %> */",
				compress: {
					drop_console: true
				},
				mangle: false,
				preserveComments: false,
				report: "min"
			},
			build: {
				files: {
					"public/common/js/vendor/modernizr-2.8.3.min.js": [
						"bower_components/modernizr/modernizr.js"
					],
					"public/reveal/js/jquery.rkt-reveal.min.js": [
						"public/reveal/js/jquery.rkt-reveal.js"
					]
				}
			}
		},

		watch: {
			css: {
				files: [
					"public/common/sass/**/*.scss"
				],
				tasks: [ "sass", "notify:css" ]
			}
		},

		notify: {
			css: {
				options: {
					message: "Successfully built CSS",
					title: "Grunt CSS"
				}
			}
		}

	} );

 	// Load Grunt Plugins
 	grunt.loadNpmTasks( "grunt-contrib-copy" );
 	grunt.loadNpmTasks( "grunt-contrib-uglify" );
 	grunt.loadNpmTasks( "grunt-contrib-watch" );
 	grunt.loadNpmTasks( "grunt-notify" );
 	grunt.loadNpmTasks( "grunt-postcss" );
	grunt.loadNpmTasks( "grunt-sass" );

	// Register Tasks
	grunt.registerTask( "init", [ "copy" ] );
	grunt.registerTask( "buildcss", [ "sass", "postcss" ] );
	grunt.registerTask( "default", [ "buildcss", "uglify" ] );

};