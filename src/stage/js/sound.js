// jsbridge
var MUSIXISE = undefined;

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge);
        }, false)
    }
}

// 调用处理
function callHandler(evt, data, callback) {
    if (!MUSIXISE) {
        connectWebViewJavascriptBridge(function(bridge) {
            MUSIXISE = bridge;
            bridge.callHandler(evt, data, callback)
        })
    } else {
        MUSIXISE.callHandler(evt, data, callback)
    }
}
// timing params
var timeDiff = 0; //performer start time vs. audience enter 
var latency = 5000; //5000 milliseconds
var tt = 0; // total time, from the first two params
var hasFirstNoteArrived = false; //use first Note to set late 

var SoundModule = {
    sendMidi: function(note_data) {
        if (!hasFirstNoteArrived && note_data.midi_msg) {
            hasFirstNoteArrived = true;
            timeDiff = note_data.time - performance.now(); //rough value
        }
        tt = note_data.time - timeDiff + latency;
        
        //method 1: js setTimeout
        setTimeout(function() {
            callHandler('MusicDeviceMIDIEvent', [+note_data.midi_msg[0], +note_data.midi_msg[1], +note_data.midi_msg[2], 0])
        		console.log('bang');
        }, tt - performance.now());
        //mathod 2: native sample based
				// callHandler('MusicDeviceMIDIEvent', [+note_data.midi_msg[0], +note_data.midi_msg[1], +note_data.midi_msg[2], 44.1*(tt - performance.now())]);
    }
}

console.log('SoundModule Activated');
module.exports = SoundModule;