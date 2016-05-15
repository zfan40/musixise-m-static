function base_isWindVaneSDK() {
    var p = {
    }

    window.WindVane.call('Base', 'isWindVaneSDK', p, function(e){
        printlog('success:' + JSON.stringify(e))
    }, function(e){
        printlog('failure:' + JSON.stringify(e))
    })
}

function base_isWindVaneSDK_promise() {
    var p = {
    }

    var promise = lib.promise.resolve(lib.windvane.call('Base', 'isWindVaneSDK', p));

    promise.then(function(e){
        printlog('success:' + JSON.stringify(e))
    }, function(e){
        printlog('failure:' + JSON.stringify(e))
    });
}

function base_plusUT() {
    var p = {
        eid: '9199',
        a1: 'windvane_test',
        a2: 'plusut',
        a3: 'click'
    }

    window.WindVane.call('Base', 'plusUT', p, function(e){
        printlog('success:' + JSON.stringify(e))
    }, function(e){
        printlog('failure:' + JSON.stringify(e))
    })
}

function base_plusUT_promise() {
    var p = {
        eid: '9199',
        a1: 'windvane_test',
        a2: 'plusut',
        a3: 'click'
    }

    var promise = lib.promise.resolve(lib.windvane.call('Base', 'plusUT', p));

    promise.then(function(e){
        printlog('success:' + JSON.stringify(e))
    }, function(e){
        printlog('failure:' + JSON.stringify(e))
    })
}
var shake_isWatching = false;

function shake_watchHandler() {
	printlog('shaking');
}

function shake_startWatch() {
	if (!shake_isWatching) {
		shake_isWatching = true;
        document.addEventListener('motion.shake', shake_watchHandler, false);

	    var p = {
	    	on: true
	    }

	    window.WindVane.call('WVMotion', 'listeningShake', p, function(e){
	        printlog('success:' + JSON.stringify(e))
	    }, function(e){
	        printlog('failure:' + JSON.stringify(e))
	    })
	}
}

function shake_stopWatch() {
	if (shake_isWatching) {
		shake_isWatching = false;
        document.removeEventListener('motion.shake', shake_watchHandler);
        
	    var p = {
	    	on: false
	    }

	    window.WindVane.call('WVMotion', 'listeningShake', p, function(e){
	        printlog('success:' + JSON.stringify(e))
	    }, function(e){
	        printlog('failure:' + JSON.stringify(e))
	    })
	}

}

var blow_isWatching = false;

function blow_watchHandler(e) {
	printlog('blowing:' + JSON.stringify(e.param));
}

function blow_startWatch() {
	if (!blow_isWatching) {
		blow_isWatching = true;

        document.addEventListener('motion.blow', blow_watchHandler, false);

	    window.WindVane.call('WVMotion', 'listenBlow', {}, function(e){
	        printlog('success:' + JSON.stringify(e))
	    }, function(e){
	        printlog('failure:' + JSON.stringify(e))
	    })
	}
}

function blow_stopWatch() {
	if (blow_isWatching) {
		blow_isWatching = false;

        document.removeEventListener('motion.blow', blow_watchHandler);
      
	    window.WindVane.call('WVMotion', 'stopListenBlow', {}, function(e){
	        printlog('success:' + JSON.stringify(e))
	    }, function(e){
	        printlog('failure:' + JSON.stringify(e))
	    })
	}

}

function geo_getLocation() {
	var p = {
		enableHighAcuracy: true,
		address: true
	}

    window.WindVane.call('WVLocation', 'getLocation', p, function(e){
        printlog('success:' + JSON.stringify(e));
    }, function(e) {
    	printlog('failure:' + JSON.stringify(e));
    });
}

function geo_getLocation_promise() {
    var p = {
        enableHighAcuracy: true,
        address: true
    }

    var promise = lib.promise.resolve(lib.windvane.call('WVLocation', 'getLocation', p, 5000));

    promise.then(function(e){
        printlog('success:' + JSON.stringify(e))
    }, function(e){
        printlog('failure:' + JSON.stringify(e))
    });
}

function geo_searchLocation() {
	var p = {
		addrs: '中国浙江省杭州市余杭区文一西路969号'
	}

    window.WindVane.call('WVLocation', 'searchLocation', p, function(e){
        printlog('success:' + JSON.stringify(e));
    }, function(e) {
    	printlog('failure:' + JSON.stringify(e));
    });

}
function cookie_read() {
    var p = {
        url: 'http://m.taobao.com'
    };
    window.WindVane.call('WVCookie', 'readCookies', p, function(e){
        printlog('success:' + JSON.stringify(e));
    }, function(e) {
    	printlog('failure:' + JSON.stringify(e));
    });
}

function cookie_write() {
    var p = {
        name: 'cookie_write',
        value: 'test',
        domain: 'm.taobao.com'
    };
    window.WindVane.call('WVCookie', 'writeCookies', p, function(e){
        printlog('success:' + JSON.stringify(e));
    }, function(e) {
    	printlog('failure:' + JSON.stringify(e));
    });

}
function weburl_intercept() {
    var p = {
        url: 'http://m.taobao.com'
    }
    window.WindVane.call('WVWebUrl', 'intercept', p, function(e){
        printlog('success:' + JSON.stringify(e));
    }, function(e) {
    	printlog('failure:' + JSON.stringify(e));
    });
}


function server_send() {
    var p = {
        api: 'mtop.taobao.homepage.loadPageContent',
        v: '1.0',
        post: '1',
        ecode: '1',
        isSec: '0',
        param: {
			isFirstUse: 0,
			nick: '123',
			platform: 'h5',
			ttid: '123@taobao_iphone_3.4.5',
			uv: ''      	
        }
     }
    window.WindVane.call('WVServer', 'send', p, function(e){
        printlog('success:' + JSON.stringify(e));
    }, function(e) {
    	printlog('failure:' + JSON.stringify(e));
    });
}


function camera_previewAndUploadPhoto() {
    var p = {
        'type' : '0'
    };

    window.WindVane.call('WVCamera', 'takePhoto', p, function(e){
        printlog('takePhoto.success:' + JSON.stringify(e));
        var p = {
            path: e.localPath
        }
        window.WindVane.call('WVCamera', 'confirmUploadPhoto', p, function(e){
            printlog('confirmUploadPhoto.success:' + JSON.stringify(e));
        }, function(e){
            printlog('confirmUploadPhoto.failue:' + JSON.stringify(e));
        })

    }, function(e){
        printlog('takePhone.failed:' + JSON.stringify(e));
    });

	document.addEventListener('WVPhoto.Event.takePhotoSuccess', function (e) {
	    printlog('Event.takePhotoSuccess');
	    document.removeEventListener('WVPhoto.Event.takePhotoSuccess', arguments.callee);
	}, false);

	document.addEventListener('WVPhoto.Event.prepareUploadPhotoSuccess', function (e) {
	    printlog('Event.prepareUploadPhotoSuccess');
	    document.removeEventListener('WVPhoto.Event.prepareUploadPhotoSuccess', arguments.callee);
	}, false);
}

function camera_takeAndUploadPhoto() {
    var p = {
        'type' : '1'
    };

    window.WindVane.call('WVCamera', 'takePhoto', p, function(e){
        printlog('takePhoto.success:' + JSON.stringify(e));
    }, function(e){
        printlog('takePhone.failed:' + JSON.stringify(e));
    });

    document.addEventListener('WVPhoto.Event.takePhotoSuccess', function (e) {
        printlog('Event.takePhotoSuccess');
        document.removeEventListener('WVPhoto.Event.takePhotoSuccess', arguments.callee);
    }, false);

    document.addEventListener('WVPhoto.Event.prepareUploadPhotoSuccess', function (e) {
        printlog('Event.prepareUploadPhotoSuccess');
        document.removeEventListener('WVPhoto.Event.prepareUploadPhotoSuccess', arguments.callee);
    }, false);
}
function media_playaudio() {
    lib.audio.play('http://g.tbcdn.cn/mtb/app-scratchcard/0.1.16/shake_match.mp3', function(){
        //TODO
    });
}

function media_stopaudio() {
    lib.audio.pause();
}
function other_usertrack() {
	var p = {
		listparam: 'xxxx,1_12975_2812_8月超值扫货季'
	}
	window.WindVane.call('TBUserTrackHelper', 'doEffectUsertrack', p, function(e){
		printlog('success:' + JSON.stringify(e))
	}, function(e){
		printlog('failure:' + JSON.stringify(e))
	});
}

function other_share() {
    lib.share.openTaobaoAPPNativeShare({
        title: 'WindVane测试',
        text: '测试测试测试',
        url: 'http://wapp.waptest.taobao.com/src/windvane.html',
        image: 'http://gtms01.alicdn.com/tps/i1/T1q0jwFllXXXcYQUzS-267-277.png',
        from: 'h5'
    }, function(e) {
        printlog('success:' + JSON.stringify(e))
    }, function(e) {
        printlog('failure:' + JSON.stringify(e))
    })
}

function other_deviceInfo() {
    var p = {
    }

    window.WindVane.call('TBDeviceInfo', 'getInfo', p, function(e){
        printlog('success:' + JSON.stringify(e))
    }, function(e){
        printlog('failure:' + JSON.stringify(e))
    })
}

function other_modelInfo() {
    var p = {
    }

    window.WindVane.call('TBDeviceInfo', 'getModelInfo', p, function(e){
        printlog('success:' + JSON.stringify(e))
    }, function(e){
        printlog('failure:' + JSON.stringify(e))
    })
}

