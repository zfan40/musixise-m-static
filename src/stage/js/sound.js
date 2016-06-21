var Visual = require('./visual.js');
var Musixise = require('../../_common/js/jsbridge.js')

// timing params
var timeDiff = 0; //performer start time vs. audience enter 
var latency = 6000; //5000 milliseconds
var tt = 0; // total time, from the first two params
var hasFirstNoteArrived = false; //use first Note to set late 

var SoundModule = {
    sendMidi: function(note_data) {
        var delay = 0;
        if (!hasFirstNoteArrived && note_data.midi_msg) {
            hasFirstNoteArrived = true;
            timeDiff = note_data.time - performance.now(); //rough value
        }
        tt = note_data.time - timeDiff + latency;
        delay = tt - performance.now();
        if (delay >= 0) {
            //method 1: js setTimeout
            setTimeout(function() {
                Musixise.callHandler('MusicDeviceMIDIEvent', [+note_data.midi_msg[0], +note_data.midi_msg[1], +note_data.midi_msg[2], 0]);
                Visual.letThereBeLight(note_data);
                // console.log('bang');
            }, delay);
            //mathod 2: native sample based
            // Musixise.callHandler('MusicDeviceMIDIEvent', [+note_data.midi_msg[0], +note_data.midi_msg[1], +note_data.midi_msg[2], 44.1*delay]);
        } else {
            return;
        }
    },
    playPiece: function(pieceStr) {
        var noteArray = JSON.parse(pieceStr);
        var length = noteArray.length;

        // function cbplayNote(i) {
        //     return function() {
        //         setTimeout(function() {
        //             console.log(noteArray[i][0]);
        //             Musixise.callHandler('MusicDeviceMIDIEvent', [noteArray[i][0], noteArray[i][1], noteArray[i][2], 0]);
        //             // Visual.letThereBeLight(noteArray[i]);
        //         }, noteArray[i][3]);
        //     }
        // }

        for (var i = 0; i <= length - 1; i++) {
            //method 1: js setTimeout
            (function(i) {
                setTimeout(function() {
                    console.log(noteArray[i][0]);
                    Musixise.callHandler('MusicDeviceMIDIEvent', [noteArray[i][0], noteArray[i][1], noteArray[i][2], 0]);
                    // Visual.letThereBeLight(noteArray[i]);
                }, noteArray[i][3]);
            })(i);
            //mathod 2: native sample based
            // for (var i = 0; i <= length - 1; i++)
            //     Musixise.callHandler('MusicDeviceMIDIEvent', [noteArray[i][0], noteArray[i][1], noteArray[i][2], noteArray[i][3]]);
        }
    }
}

console.log('SoundModule Activated');
module.exports = SoundModule;