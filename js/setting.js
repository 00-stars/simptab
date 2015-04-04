
define([ "jquery", "date" ], function( $, date ) {

    initLR = function () {
        $( ".lineradio" ).each( function( index, item ) {
            if ( $( item ).hasClass("lrselected") ) {
                $( item ).prepend( '<span class="checked"></span>' );
                $( item ).find( "input" ).attr( "checked", true    );
            }
            else {
                $( item ).prepend( '<span class="unchecked"></span>' );
            }
        });
    }

    updateLR = function( $target ) {
        updateLrIcon( $target );
        updateLrState( $target );
    }

    updateLrIcon = function( $target ) {
        var $current = $target.parent(),
            $prev    = $current.prev(),
            $next    = $current.next();

        if ( $prev.find( "span" ).length > 0 ) {
            $prev.find( "span"  ).attr( "class", "unchecked" );
            $prev.find( "input" ).attr( "checked", false );
        }
        else {
            $next.find( "span"  ).attr( "class", "unchecked" );
            $next.find( "input" ).attr( "checked", false );
        }
        $current.find( "span"  ).attr( "class", "checked"    );
        $current.find( "input" ).attr( "checked", true    );
    }

    updateLrState = function( $target ) {
        var $current = $target.parent(),
            $prev    = $current.prev(),
            $next    = $current.next();

        if ( $prev.length > 0 ) {
            $prev.attr( "class", "lineradio" );
        }
        else {
            $next.attr( "class", "lineradio" );
        }
        $current.attr( "class", "lineradio lrselected" );
    }

    updateOriginState = function( $target, type ) {
        var $prev   = $($target.prev()),
            $parent = $($target.parent()),
            value   = $target.attr("value"),
            checked = "checked",
            inputel = "true",
            divel   = "lineradio lrselected";

        if ( type == "init" ) {
            value = value == "true" ? "false" : "true";
        }

        if ( value == "true" ) {
            checked = "unchecked";
            inputel = "false";
            divel   = "lineradio";
        }

        $target.attr( "value", inputel  );
        $prev.attr(   "class", checked  );
        $parent.attr( "class", divel    );
    }

    updateLocalStorge = function( $target ) {
        var index = $target.attr("name"),
            value = $target.attr("value"),
            arr   = localStorage["simptab-background-origin"] && JSON.parse( localStorage["simptab-background-origin"] ),
            item  = arr[index];

        if ( item.split(":")[0] == index ) {
            arr.splice( index, 1, index + ":" + value );
        }

        localStorage["simptab-background-origin"] = JSON.stringify( arr );

    }

    return {
        Init: function() {

            // init line radio
            initLR();

            // update changestate lineradio
            var mode      = localStorage["simptab-background-mode"],
                checked   = $( ".changestate input[value=" +  mode + "]" );
            if ( mode != undefined ) {
                updateLR( checked  );
            }

            // update clockstate lineradio
            mode      = localStorage["simptab-background-clock"];
            checked   = $( ".clockstate input[value=" +  mode + "]" );
            if ( mode != undefined ) {
                updateLR( checked );
            }

            // update originstate lineradio
            mode      = localStorage["simptab-background-origin"] || "[]";
            mode      = JSON.parse( mode );
            $(".originstate").find("input").each( function( idx, item ) {
                $(item).attr( "value", mode.length == 0 ? false : mode[idx].split(":")[1] );
                updateOriginState( $(item), "init" );
            });

            // set simptab-background-origin defalut value
            if ( mode.length == 0 ) {
               localStorage["simptab-background-origin"] = JSON.stringify(["0:false","1:false","2:false","3:false","4:false","5:false"]);
            }

        },

        Listen: function () {

            $( ".changestate input" ).click( function( event ) {
                localStorage["simptab-background-mode"] = $(event.currentTarget).attr( "value" );
                updateLR( $( event.currentTarget ));
            });

            $( ".clockstate input" ).click( function( event ) {

                localStorage["simptab-background-clock"] = $(event.currentTarget).attr( "value" );
                updateLR( $( event.currentTarget ));

                if ( localStorage["simptab-background-clock"] == "show") {
                    date.Show();
                }
                else {
                    date.Hide();
                }
            });

            $( ".originstate input" ).click( function( event ) {
                updateOriginState( $( event.currentTarget ), "update" );
                updateLocalStorge( $( event.currentTarget ));
            });

        },

        Get: function ( state ) {

            if ( state == "changestate" ) {
                return $( ".changestate input[value=day]" ).attr( "checked" );
            }
            else if ( state == "clockstate" ) {
                return $( ".clockstate input[value=show]" ).attr( "checked" );
            }

        },

        IsRandom: function() {
          var mode = localStorage["simptab-background-mode"];
          // when undefined same as time
          if ( mode == undefined || mode == "time" ) {
            return true;
          }
          else {
            return false;
          }
        },

        Verify: function( idx ) {
            var arr   = JSON.parse( localStorage["simptab-background-origin"] || "[]" ),
                value = arr && arr.length && arr[idx],
                value = value || idx + ":" + "true";

            return value.split(":")[1];
        }

    }
});
