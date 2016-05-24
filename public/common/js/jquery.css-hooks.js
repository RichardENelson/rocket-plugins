// CSS Hooks
(function( $ ) {

    if ( !$.cssHooks ) {
        throw( new Error( "jQuery 1.4.3+ is needed for this plugin to work" ) );
    }

    function styleSupport( prop ) {

        var vendorProp,
            supportedProp,
            capProp = prop.charAt( 0 ).toUpperCase() + prop.slice( 1 ),
            prefixes = [ "Moz", "Webkit", "O", "ms" ],
            div = document.createElement( "div" );

        if ( prop in div.style ) {

            supportedProp = prop;

        } else {

            for ( var i = 0; i < prefixes.length; i++ ) {

                vendorProp = prefixes[ i ] + capProp;

                if ( vendorProp in div.style ) {

                    supportedProp = vendorProp;
                    break;

                }

            }

        }

        div = null;
        $.support[ prop ] = supportedProp;
        return supportedProp;

    }

    function addStyle( prop ) {

        var supportedProp = styleSupport( prop );

        if ( supportedProp && supportedProp !== prop ) {

            $.cssHooks[ prop ] = {

                get: function( elem, computed, extra ) {
                    return $.css( elem, supportedProp );
                },

                set: function( elem, value) {
                    elem.style[ supportedProp ] = value;
                }

            };
        }
    }

    addStyle( "animation" );
    addStyle( "animationDelay" );
    addStyle( "animationDirection" );
    addStyle( "animationDuration" );
    addStyle( "animationIterationCount" );
    addStyle( "animationName" );
    addStyle( "animationPlayState" );
    addStyle( "animationTimingFunction" );

    addStyle( "transition" );
    addStyle( "transitionDelay" );
    addStyle( "transitionDuration" );
    addStyle( "transitionProperty" );
    addStyle( "transitionTimingFunction" );

    addStyle( "transform" );

})( jQuery );
