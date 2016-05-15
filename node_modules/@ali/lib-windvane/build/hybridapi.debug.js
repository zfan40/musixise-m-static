;(function(win, lib){

var ua = win.navigator.userAgent, matched, appVersion;
if(matched = ua.match(/AliApp\(TB\/([\d\.]+)\)/)) appVersion = matched[1];
else if(matched = ua.match(/@([^_@]+)_(iphone|android|ipad|apad)_([\d\.]+)/)) appVersion = matched[3];
if(!appVersion && !ua.match(/WindVane[\/\s]([\d\.\_]+)/)) return;

var WindVane = lib.windvane,
    doc = document,
    isIOS = /iPhone|iPad|iPod/i.test(ua),
    isAndroid = /Android/i.test(ua),
    wvVersion = ua.match(/WindVane[\/\s](\d+)[._](\d+)[._](\d+)/i),
    wvVersion = wvVersion ? wvVersion.slice(1, 4) : [0, 0, 0],
    env = location.host.match(/waptest|wapa/i),
    env = env && env[0] || 'm',
    returnValues = [
        'HY_SUCCESS',
        'HY_NO_HANDLER',
        'HY_PARAM_ERR',
        'HY_UNKNOWN_ERR', //服务端未实现，根据hybrid api统一定义添加
        'HY_NO_PERMISSION',
        'HY_TIMEOUT', //同上
        'HY_FAILED',
        'HY_CLOSED'
    ],
    uid = 0,
    shakeMaps = {},
    loadingElemId = '_HA_Loading';

function compareWindVaneVersion(targetVersion){
    targetVersion = targetVersion.split('.');
    for(var i = 0, n1, n2; i < wvVersion.length; i++){
        n1 = parseInt(targetVersion[i], 10) || 0;
        n2 = parseInt(wvVersion[i], 10) || 0;
        if(n1 > n2) return 1;
        if(n1 < n2) return -1;
     }
     return 0;
}

function isString(obj){
    return typeof obj === 'string';
}

function isNumber(obj){
    return typeof obj === 'number';
}

function isFunction(obj){
    return typeof obj === 'function';
}

function nativeCall(api, params, success, failure, timeout){
    api = api.split('.');
    var className = api[0], methodName = api[1];
    WindVane && WindVane.call(className, methodName, params, success, failure, timeout);
}

function wrapSuccess(callback, preprocessor){
    return (callback || preprocessor) && function(result){
        result = preprocessor && preprocessor(result) || result;
        callback && callback(wrapResult(result));
    }
}

function wrapFailure(callback){
    return callback && function(error){
        callback(wrapError(error));
    }
}

function wrapResult(result){
    result = result || {};
    result.errorCode = 0;
    result.errorMessage = '';
    return result;
}

function wrapError(error){
    var code = 6, msg = isString(error) ? error : error.ret;
    if(error){
        var index = returnValues.indexOf(msg);
        code = index > 0 ? index : code;
    }
    return {errorCode:code, errorMessage:msg, data:error};
}

var Ali = win.Ali = lib.Ali = {
    /**
     * 应用环境信息。
     */
    appinfo: {
        name: 'taobao',
        ver: appVersion || '0.0.0',
        engine: 'windvane',
        engineVer: wvVersion.join('.')
    },

    /**
     * 通过toast方式显示信息。iOS不支持WVUIToast.toast方法。
     */
    toast: function(options, callback){
        var text = isString(options) ? options : options && options.text;
        nativeCall('TBDeviceInfo.showServiceMsg', {serviceMsg:text}, wrapSuccess(callback), wrapFailure(callback));
    },

    /**
     * 设置页面标题，即改变document.title。
     */
    setTitle: function(options, callback){
        var title = isString(options) ? options : options && options.text,
            params = isAndroid ? {title:title} : title;
        doc.title = title;
        nativeCall('WebAppInterface.setCustomPageTitle', params, wrapSuccess(callback), wrapFailure(callback));
        callback && callback(wrapResult(null));
    },

    /**
     * 显示页面标题(如果页面标题隐藏)，此方法会把document.title作为传参。
     */
    showTitle: function(callback){
        var title = doc.title, params = isAndroid ? {title:title} : title;
        nativeCall('WebAppInterface.setCustomPageTitle', params, wrapSuccess(callback), wrapFailure(callback));
        callback && callback(wrapResult(null));
    },

    /**
     * 隐藏页面标题。使用一个空格字符作为title来`隐藏`。
     */
    hideTitle: function(callback){
        var title = ' ', params = isAndroid ? {title:title} : title;
        nativeCall('WebAppInterface.setCustomPageTitle', params, wrapSuccess(callback), wrapFailure(callback));
        callback && callback(wrapResult(null));
    },

    /**
     * 打开新窗口。
     * @restrict iOS需较新版本的WindVane才支持，且Base.openWindow不会返回`HY_SUCCESS`等结果。故此方法无法确定成功打开窗口。
     */
    pushWindow: function(options, callback){
        var url = isString(options) ? options : options && options.url;
        
        if(isIOS && compareWindVaneVersion('4.5.0') >= 0){
            nativeCall('Base.openWindow', {url:url}, wrapSuccess(callback), wrapFailure(callback));
        }else location.href = url;

        //do callback anyway, but not reliable
        callback && callback(wrapResult(null));
    },

    /**
     * 窗口回退。注意：WVNative.nativeBack是退出整个webview窗口。
     */
    popWindow: function(callback){
        // nativeCall('WVNative.nativeBack', null, wrapSuccess(callback), wrapFailure(callback));
        window.history.back();
        callback && callback(wrapResult(null));
    },

    /**
     * 窗口回退指定步数。
     */
    // popTo: function(step, callback){
    //     //TODO
    // },

    /**
     * 打开用户登陆窗口。
     * @restrict lib.login未实现登陆成功或失败后回调，故callback意义不大。
     */
    login: function(callback){
        if(!lib.login) throw new Error('lib.login required');
        lib.login.goLogin();
        callback && callback(wrapResult(null));
    },

    /**
     * 打开快捷支付。
     * @doc http://confluence.taobao.ali.com/pages/viewpage.action?pageId=220072554
     */
    h5TradePay: function(options, callback){
        var payUrl = 'http://d.' + env + '.taobao.com/goAlipay.htm?simplepay=1&needpop=1';
        for(var p in options) payUrl += '&' + p + '=' + encodeURIComponent(options[p]);
        location.href = payUrl;
        callback && callback(wrapResult({payUrl:payUrl}));
    },

    geolocation: {
        /**
         * 获取当前的地理位置。
         */
        getCurrentPosition: function(options, callback){
            options = options || {enableHighAcuracy:true, address:true};

            nativeCall('WVLocation.getLocation', options, wrapSuccess(callback, function(result){
                var address = result.address, coords = result.coords;
                if(address && typeof address === 'object'){
                    result.city = address.city;
                    result.cityCode = address.cityCode;
                    result.province = address.province;
                    result.address = address.addressLine;
                }

                //fix longitude/latitude string value on iOS
                if(coords){
                    coords.longitude = parseFloat(coords.longitude);
                    coords.latitude = parseFloat(coords.latitude);
                    coords.accuracy = parseFloat(coords.accuracy);
                }
            }), wrapFailure(callback));
        },

        /**
         * 监听用户的地理位置。
         */
        // watchPosition: function(callback){
        //     //TODO
        // },

        /**
         * 关闭监听用户的地理位置。
         */
        // clearWatch: function(callback){
        //     //TODO
        // }
    },

    // orientation: {
    //     /**
    //      * 监听手机的方向。
    //      */
    //     watch: function(options, callback){
    //         //TODO
    //     },

    //     /**
    //      * 关闭监听手机的方向。
    //      */
    //     clearWatch: function(watchId, callback){
    //         //TODO
    //     }
    // },

    shake: {
        /**
         * 监听手机摇动。
         */
        watch: function(options, callback){
            var watchId = ++uid;
            shakeMaps[watchId] = callback;

            nativeCall('WVMotion.listeningShake', {on:true}, wrapSuccess(function(result){
                if(result && result.ret === returnValues[0]){
                    doc.addEventListener('motion.shake', callback, false);
                }else{
                    callback(result);
                }
            }), wrapFailure(callback));

            return watchId;
        },

        /**
         * 关闭监听手机摇动。
         */
        clearWatch: function(watchId, callback){
            var watchCallback = shakeMaps[watchId];
            isFunction(watchCallback) && doc.removeEventListener('motion.shake', watchCallback, false);
            nativeCall('WVMotion.listeningShake', {on:false}, wrapSuccess(callback), wrapFailure(callback));
        }
    },
    
    vibration: {
        /**
         * 震动手机。
         * @restrict 手淘震动时间是固定的，duration参数无效。
         */
        vibrate: function(options, callback){
            options = isNumber(options) ? {duration:options} : options;
            nativeCall('WVMotion.vibrate', options, wrapSuccess(callback), wrapFailure(callback));
        }
    },

    network: {
        /**
         * 获取网络类型。
         * 2G - 移动和联通GPRS或EDGE，电信CDMA
         * 3G - 联通UMTS或HSDPA，电信EVDO
         */
        getType: function(callback){
            nativeCall('TBDeviceInfo.getInfo', '', wrapSuccess(callback, function(result){
                var type = (result.network || ''), data = {
                    type: type,
                    isWifi: false,
                    is2G: false,
                    is3G: false,
                    isOnline: false
                };
                if(/WIFI/i.test(type)){
                    data.isWifi = data.isOnline = true;
                }else if(/GPRS|EDGE|CDMA/i.test(type)){
                    data.is2G = data.isOnline = true;
                }else if(/UMTS|HSDPA|EVDO/i.test(type)){
                    data.is3G = data.isOnline = true;
                }
                data.isE = data.isG = data.isH = false;
                data.networkAvailable = type != null && type != '';
                return data;
            }), wrapFailure(callback));
        }

        //TODO: networkchange event
    },
    
    // motion: {
    //     /**
    //      * 监听手机的运动数据，包括重力加速度等。
    //      */
    //     watch: function(options, callback){
    //         //TODO
    //     },

    //     /**
    //      * 关闭监听手机的运动数据。
    //      */
    //     clearWatch: function(options, callback){
    //         //TODO
    //     }
    // },

    audio: {
        /**
         * 播放音频。
         * @restrict iOS只支持amr格式。
         */
        play: function(options, callback){
            var url = isString(options) ? options : options && options.url;
            nativeCall('H5AudioPlayer.play', {voiceUrl:url}, wrapSuccess(callback), wrapFailure(callback));
        },

        /**
         * 停止播放音频。
         * @restrict 手淘是暂停播放当前音频，url传参无效。
         */
        stop: function(options, callback){
            nativeCall('H5AudioPlayer.stop', null, wrapSuccess(callback), wrapFailure(callback));
        }
    },

    calendar: {
        /**
         * 增加淘日历提醒计划。
         * @doc http://confluence.taobao.ali.com/pages/viewpage.action?pageId=228955245
         * @restirct iOS必需传入eventId参数，否则会导致crash。
         */
        add: function(options, callback){
            options = options || {};
            if(!options.eventId) options.eventId = +new Date();

            //compatiblity: `startTime, endTime` and `startDate, endDate`
            var startDate = options.startDate, endDate = options.endDate, regexp = /[- :]/g;
            if(startDate){
                options.startTime = startDate.replace(regexp, '');
                options.endTime = endDate.replace(regexp, '');
                delete options.startDate;
                delete options.endDate;
            }

            var url = 'http://m.taobao.com/go/CalendarMyPlan', params = '';
            for(var p in options) params += (params ? '&' : '') + p + '=' + options[p];
            url = url + '?' + params;
            location.href = url;
            callback && callback(wrapResult(null));
        }
    },

    /**
     * 拍照并上传。
     * @restrict options参数设置无效。
     */
    photo: function(options, callback){
        options = options || { };
        options.type = '1'; //auto upload
        nativeCall('WVCamera.takePhoto', options, wrapSuccess(callback, function(result){
            result.photo = result.resourceURL;
        }), wrapFailure(callback));
    },
    
    contacts: {
        /**
         * 拉起通讯录列表，选择联系人后并返回所选联系人数据。
         * @restrict 不支持multiple参数。
         * @version WindVane >= 4.5.0
         */
        get: function(options, callback){
            nativeCall('WVContacts.choose', null, wrapSuccess(callback, function(result){
                var data = [{
                    name: result.name,
                    phoneNumber: result.phone,
                    email: result.email
                }];
                result.results = data;
                return result;
            }), wrapFailure(callback));
        }
    },

    /**
     * 显示加载loading。
     * @restrict 不支持文本内容参数text。Android不支持。暂时使用H5方案代替。
     */
    showLoading: function(text, callback){
        // nativeCall('WVUI.showLoadingBox', null, wrapSuccess(callback), wrapFailure(callback));
        var elem = doc.getElementById(loadingElemId);
        if(!elem){
            var div = doc.createElement('div');
            div.id = loadingElemId;
            div.style.cssText = 'position:absolute;width:100%;height:100%;left:0;top:0;background:url(//assets.alicdn.com/mw/base/styles/component/more/images/loading.gif) 50% 50% no-repeat;background-size:40px 16px;pointer-events:none;';
            elem = doc.createDocumentFragment();
            elem.appendChild(div);
        }else{
            elem.style.display = 'block';
        }
        doc.body.appendChild(elem);
        callback && callback(wrapResult(null));
    },

    /**
     * 隐藏加载loading。
     * @restrict Android不支持。暂时使用H5方案代替。
     */
    hideLoading: function(callback){
        // nativeCall('WVUI.hiddenLoadingBox', null, wrapSuccess(callback), wrapFailure(callback));
        var elem = doc.getElementById(loadingElemId);
        if(elem) elem.style.display = 'none';
        callback && callback(wrapResult(null));
    }
};

//兼容w3c规范
var geo = navigator.geolocation || (navigator.geolocation = {});
if(!geo.getCurrentPosition) geo.getCurrentPosition = Ali.geolocation.getCurrentPosition;

})(window, window.lib || (window.lib = {}));