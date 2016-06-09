// var $ = require('../../_common/js/zepto.min.js');
var $window = $(window);
var the_light = '#ffff00';
var VisualModule = {
    bindResponsiveBackgroundSprite: function() {

        var s = false;

        function generateLight() {
            setInterval(function() {
                var a = '' + (parseInt(Math.random() * 255));
                var b = '' + (parseInt(Math.random() * 255));
                var c = '' + (parseInt(Math.random() * 255));
                var dice = parseInt(Math.random() * 3);
                the_light = 'rgb(' + a + ',' + b + ',' + c + ')';
            }, 10000);
        }
        generateLight();

        // background sprite animation
        function r() {
            $('#bgi').width($(window).width() * 21);
            $('#bgi').height($(window).height() * 21);
        }
        // $('#bgi').load(function() {
        $('#bgi').css('visibility', 'visible');
        r();
        var f = 0;
        setInterval(function() {
            $('#bg').css('left', '-' + ((f % 21) * $(window).width()) + 'px');
            $('#bg').css('top', '-' + ((Math.floor(f / 21)) * $(window).height()) + 'px');
            f = f + 1;
            if (f == 410) f = 0;
        }, 120);
        // });

        $(window).resize(function() { r(); });
    },
    letThereBeLight: function(note_data) {
        if (note_data.midi_msg[0] == 144) {
            $('body').css({ backgroundColor: the_light });
        } else {
            $('body').css({ backgroundColor: '#000' });
        }
        // $('body').stop().animate({ backgroundColor: "#000" }, 400);
    }
}


console.log('VisualModule Activated');
module.exports = VisualModule;