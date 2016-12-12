// var Visual = require('./visual.js');
var Musixise = require('../../_common/js/jsbridge.js')

// timing params
var timeDiff = 0; //performer start time vs. audience enter 
var latency = 6000; //5000 milliseconds
var tt = 0; // total time, from the first two params
var hasFirstNoteArrived = false; //use first Note to set late 

var notePool = [];

var SoundModule = {
    sendMidi: function(note_data) {
        var delay = 0;
        if (!hasFirstNoteArrived && note_data.midi_msg) {
            hasFirstNoteArrived = true;
            timeDiff = note_data.time - performance.now(); //rough value
        }
        tt = note_data.time - timeDiff + latency;
        delay = tt - performance.now();
        
        // Visual.letThereBeLight(note_data);

        if (delay >= 0) {
            //method 1: js setTimeout
            // Musixise.callHandler('MusicDeviceMIDIEvent', [+note_data.midi_msg[0], +note_data.midi_msg[1], +note_data.midi_msg[2], delay]);
            setTimeout(function() {
                Musixise.callHandler('MusicDeviceMIDIEvent', [+note_data.midi_msg[0], +note_data.midi_msg[1], +note_data.midi_msg[2], 0]);       
                // Visual.letThereBeLight(note_data);
                // if (note_data.midi_msg[0]==144) {
                //     console.log('bang',delay);
                // }
            }, delay);
            //mathod 2: native sample based
            // Musixise.callHandler('MusicDeviceMIDIEvent', [+note_data.midi_msg[0], +note_data.midi_msg[1], +note_data.midi_msg[2], 44.1*delay]);
        } else {
            return;
        }
    },
    playRandomNote: function(){
        var i = 0;
        var hehe = setInterval(function(){
            i += 1;
            // console.log(i);
            Musixise.callHandler('MusicDeviceMIDIEvent', [144, 50+parseInt(Math.random()*30), 70, 0]);
            if (i == 20) {
                clearInterval(hehe);
            }
        },25);
        // var notenum1 = 50+parseInt(Math.random()*15);
        // var notenum2 = 65+parseInt(Math.random()*15);
        // var notenum3 = 80+parseInt(Math.random()*15);
        // Musixise.callHandler('MusicDeviceMIDIEvent', [144, notenum1, 50+parseInt(Math.random()*40), 0]);
        // Musixise.callHandler('MusicDeviceMIDIEvent', [144, notenum2, 50+parseInt(Math.random()*40), 0]);
        // Musixise.callHandler('MusicDeviceMIDIEvent', [144, notenum3, 50+parseInt(Math.random()*40), 0]);
        // setTimeout(function(){
        //     Musixise.callHandler('MusicDeviceMIDIEvent', [128, notenum, 50+parseInt(Math.random()*40), 64]);
        // },1000);
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
            if (i==0||i==length-1){
                console.log(performance.now());
            }
            //method 1: js setTimeout
            (function(i) {
                notePool.push(setTimeout(function() {
                    // console.log(noteArray[i][0]);
                    Musixise.callHandler('MusicDeviceMIDIEvent', [noteArray[i][0], noteArray[i][1], noteArray[i][2], 0]);
                    console.log('set note');
                    // Visual.letThereBeLight(noteArray[i]);
                }, noteArray[i][3]));
            })(i);
            //mathod 2: native sample based
               // Musixise.callHandler('MusicDeviceMIDIEvent', [noteArray[i][0], noteArray[i][1], noteArray[i][2], noteArray[i][3]]);
        }
    },
    stop: function() {
        var length = notePool.length;
        for (var i =0;i<=length-1;i++) {
            clearTimeout(notePool[i]);
        }
    }
}

console.log('SoundModule Activated');
module.exports = SoundModule;