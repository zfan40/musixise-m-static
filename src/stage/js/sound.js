
	// var $ = require('../../_common/js/zepto.min.js');


	var hisname = location.href.match(/.*?stage\/(.*)/)[1];

	// timing params
	var timeDiff = 0; //performer start time vs. audience enter 
	var latency = 1500; //5000 milliseconds
	var tt = 0; // total time, from the first two params
	var hasFirstNoteArrived = false; //use first Note to set late 

	var SoundModule = {
	    sendMidi: function(note_data) {
	        if (!hasFirstNoteArrived && note_data.midi_msg) {
	            hasFirstNoteArrived = true;
	            timeDiff = note_data.time - performance.now();
	            console.log('two side timeDiff: ' + timeDiff);
	        }
	        console.log('note time from musixiser: ' + note_data.time);
	        tt = note_data.time - timeDiff + latency;

	        //第一种synth方案,不传入时间信息，setTimeout控制synth时间
	        // setTimeout(function() {
	        //     // Synth.handleMidiMsg(note_data.midi_msg, note_data.timbre);
	        //     // if (note_data.midi_msg[0]==144)
	        //     // {letThereBeLight()}
	        // }, tt - performance.now());
	        // Synth.handleMidiMsg(note_data.midi_msg, note_data.timbre)    //这行复原啊！！！！！！
	        //第二种synth方案,传入时间信息，synth自己管理时间
	        // Synth.handleMidiMsg(note_data.midi_msg, note_data.timbre, tt / 1000.0);
	    }
	}

	console.log('SoundModule Activated');
	module.exports = SoundModule;