/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	
	
	
	/**
	 * 本地开发时请启用以上代码使用本地的第三方库
	 * 发布到AWP上之前请注释掉以上代码再Build
	 */
	
	
	/**
	 * 启用以下代码使用orbit mtop mock
	 */
	/*
	require('./mock/_orbit-mtop-mock.js');
	*/
	
	var app = __webpack_require__(2);
	app.init();
	


/***/ },
/* 1 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * app
	 * musixiser detail page
	 * author: ziwen
	 */
	
	var d = document;
	var Musixise = __webpack_require__(3);
	var Env = __webpack_require__(4);
	var axios = __webpack_require__(6);
	var Sound = __webpack_require__(32);
	
	var generalData = __webpack_require__(33);
	var workData = __webpack_require__(34);
	var musixiserIntroTpl = __webpack_require__(35);
	var workListTpl = __webpack_require__(38);
	
	var musixiserSection = d.querySelector('#intro-info');
	var workSection = d.querySelector('#work-list');
	
	var musixiserId = location.href.split('/').pop();
	musixiserId = 40; //test
	
	var followStatus = -1; //n种取值，0关注1取消
	var userInfo = {};
	var req_config = {};
	var AllWorks = [];//以后这里还是得native...否则歌多了会崩吧...
	
	var app = {
	    init: function() {
	        var self = this;
	        // axios.get('http://api.musixise.com/api/work-lists/4', req_config)
	        //     .then(function(res) { console.log(res) })
	        //     .catch(function(err) {console.log(err)})
	        Env.getUserInfo(function(res) {
	            userInfo = res;
	            console.log(userInfo);
	            if (userInfo.token) {
	                req_config.headers.Authorization = 'Bearer ' + userInfo.token;
	            }
	            self.renderPage();
	        });
	    },
	    renderPage: function() {
	        var self = this;
	
	        axios.post('//api.musixise.com/api/user/detail/' + musixiserId, '', req_config)
	            .then(function(res) {
	                console.log('musixiser info',res.data.data);
	                followStatus = res.data.data.followStatus //这块还没测试;
	                self.renderMusixiserInfo(res.data.data);
	                self.bindFollowMusixiser();
	                // self.bindCheckMusixiser();
	            })
	            .catch(function(err) {
	
	            });
	
	        axios.post('//api.musixise.com/api/work/getListByUid/' + musixiserId, '', req_config)
	            .then(function(res) {
	                AllWorks = res.data.data;
	                console.log('musixiser work',res.data.data);
	                self.renderWorkList(AllWorks);
	                self.bindPlayWork();
	                self.bindAddFavoriteWork();
	            })
	            .catch(function(err) {
	
	            });
	        // self.renderMusixiserInfo(generalData); //test
	        // self.renderWorkList(workData); //test
	    },
	    renderMusixiserInfo: function(data) {
	        var self = this;
	        var a = data || {};
	        var renderStr = musixiserIntroTpl(a);
	        musixiserSection.innerHTML = renderStr;
	        //if no stage at all, show empty icon
	        if (!data) {
	            d.querySelector('#no-favorite-musixiser').style.display = 'flex';
	        }
	        var loading = d.querySelector('.venus-spinner');
	        loading.style.display = 'none';
	    },
	    renderWorkList: function(data) {
	        var self = this;
	        var a = data || {};
	        var renderStr = workListTpl(a.content);
	        workSection.innerHTML = renderStr;
	        //if no stage at all, show empty icon
	        if (!data) {
	            d.querySelector('#no-favorite-work').style.display = 'flex';
	        }
	    },
	    renderLiveList: function(data) {
	
	    },
	    // bindEvent: function() {
	    //     var self = this;
	    //     // if interchange tabs.
	    //     // musixiserTab.addEventListener('click',function(){
	    //     //     workSection.style.display='none';
	    //     //     musixiserSection.style.display='inherit';
	    //     // });
	    //     // workTab.addEventListener('click',function(){
	    //     //     musixiserSection.style.display='none';
	    //     //     workSection.style.display='inherit';
	    //     // });
	    //     self.bindPlayWork();
	    //     self.bindAddFavoriteWork();
	    //     self.bindFollowMusixiser();
	    //     self.bindCheckMusixiser();
	    // },
	    bindPlayWork: function() {
	        var self = this;
	        d.querySelector('#work-list').addEventListener('click', function(e) {
	            if (e.target.getAttribute('data-id')) {
	                alert('play piece of id ' + e.target.getAttribute('data-id'));
	                // native play
	                // Musixise.callHandler('showToast', '开始播放', function() {});
	                // location.href = "musixise://play/" + e.target.getAttribute('data-id');
	
	                // js play
	                // console.log(AllWorks);
	                var l = AllWorks.length
	                for (var i=0;i<=l-1;i++) {
	                    if (e.target.getAttribute('data-id') == AllWorks[i].id) {
	                        Sound.playPiece(AllWorks[i].content)
	                    }
	                }
	            }
	        });
	    },
	    bindAddFavoriteWork: function() {
	        var self = this;
	        //收藏某作品
	        //onclick...
	
	        d.querySelector('#work-list').addEventListener('click', function(e) {
	            if (e.target.getAttribute('data-likeid')) {
	                axios.post('//api.musixise.com/api/favorite/addWork', JSON.stringify({
	                        workId: e.target.getAttribute('data-likeid'),
	                        status: 0
	                    }), req_config)
	                    .then(function(res) {
	                        console.log('收藏作品成功', res);
	                    })
	                    .catch(function(err) {
	                        console.log(err);
	                    });
	            }
	        });
	    },
	    // bindCheckMusixiser: function() {
	    //     var self = this;
	    //     d.querySelector('.avatar').addEventListener('click', function() {
	    //         Musixise.callHandler('popMusixiserBox', {
	    //             id: musixiserId,
	    //             avatar: '',
	    //             follow: 0,
	    //             name: ''
	    //         }, function() {
	    //             //
	    //         });
	    //     });
	    // },
	    bindFollowMusixiser: function() {//complete
	        var self = this;
	        d.querySelector('.follow-status').addEventListener('click', function(e) {
	            if (!userInfo.token) {
	                alert('未登录');
	                return;
	            }
	            if (followStatus) {
	                //取消关注
	                followStatus = 0;
	                document.querySelector('.follow-status.active').className = 'follow-status inactive'
	            } else {
	                followStatus = 1;
	                document.querySelector('.follow-status.inactive').className = 'follow-status active'
	            }
	            // 关注某人
	            var param = {
	                followId: musixiserId,
	                status: followStatus
	            };
	            axios.post('//api.musixise.com/api/follow/add', JSON.stringify(param), req_config)
	                .then(function(res) {
	                    console.log('关注人成功', res);
	                })
	                .catch(function(err) {
	                    console.log(err);
	                });
	        });
	    }
	};
	module.exports = app;

/***/ },
/* 3 */
/***/ function(module, exports) {

	var MUSIXISE = undefined;
	var JSBridge = {
	    connectWebViewJavascriptBridge: function(callback) {
	        if (window.WebViewJavascriptBridge) {
	            callback(WebViewJavascriptBridge);
	        } else {
	            document.addEventListener('WebViewJavascriptBridgeReady', function() {
	                callback(WebViewJavascriptBridge);
	            }, false)
	        }
	    },
	    callHandler: function(evt, data, callback) {
	        if (!MUSIXISE) {
	            this.connectWebViewJavascriptBridge(function(bridge) {
	                bridge.init(function(message,responseCallback){
	                    responseCallback(data);
	                })
	                MUSIXISE = bridge;
	                bridge.callHandler(evt, data, callback)
	            })
	        } else {
	            MUSIXISE.callHandler(evt, data, callback)
	        }
	    }
	}
	console.log('JSBridge Activated');
	module.exports = JSBridge;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var MusixiseBridge = __webpack_require__(3);
	var Util = __webpack_require__(5);
	
	// alert(navigator.userAgent);
	var env = {
	    inApp: !!(navigator.userAgent.indexOf('Musixise')>0),
	    appVersion: '0.0.1',
	    getUserInfo: function(cb) {
	        var self = this;
	        if (!self.inApp) { //app外
	        	var username = '';
	            if (!Util.getCookie("a_username")) {
	                username = '游客' + parseInt(Math.random() * 10000);
	                Util.setCookie("a_username", username, 240);
	            } else {
	                username = Util.getCookie("a_username");
	            }
	            self.userInfo = {username:username,realname:username}
	            cb(self.userInfo);
	        } else { //app内
	            MusixiseBridge.callHandler('GetUserInfo', {}, function(res) {
	              self.userInfo = res;
	              cb(res);
	            });
	        }
	    },
	    uploadImage: function(cb){
	        var self= this;
	        if (!self.inApp) { //app外
	            location.href='musixise://open';
	        } else { //app内
	            MusixiseBridge.callHandler('UploadImage', {}, function(res) {
	              cb(res);
	            });
	        }
	    },
	    userInfo:{}
	}
	
	console.log('Env Activated');
	module.exports = env;
	


/***/ },
/* 5 */
/***/ function(module, exports) {

	var UtilsModule = {
	    getiOSVersion: function() {
	        var UA = window.navigator.userAgent;
	        var IOS_VERSION_RE = /OS\s+(\d+)_(\d+)/;
	        var arr = UA.match(IOS_VERSION_RE);
	        if (arr && arr.length > 2) {
	            return parseInt(arr[1], 10) + parseInt(arr[2], 10) / 10;
	        } else {
	            return 0;
	        }
	    },
	    milleSecToMinuteSec: function(mS) {
	        var minute = Math.floor(mS / 60000);
	        var second = Math.floor(mS / 1000 - minute * 60);
	        if (minute < 10) {
	            minute = '0' + minute;
	        } else {
	            minute = '' + minute;
	        }
	        if (second < 10) {
	            second = '0' + second;
	        } else {
	            second = '' + second;
	        }
	        console.log(minute, second);
	        return [minute, second];
	    },
	    runTimer: function(minuteDom, secondDom) {
	        setInterval(function() {
	            var min = +document.querySelector(minuteDom).innerHTML;
	            var sec = +document.querySelector(secondDom).innerHTML;
	            sec += 1;
	            if (sec >= 60) {
	                sec = '00';
	                min += 1;
	                if (min == 0) {
	                    min = '00';
	                } else if (min < 10) {
	                    min = '0' + min;
	                } else {
	                    min = '' + min;
	                }
	            } else if (sec < 10) {
	                sec = '0' + sec;
	                if (min == 0) {
	                    min = '00';
	                } else if (min < 10) {
	                    min = '0' + min;
	                } else {
	                    min = '' + min;
	                }
	            } else {
	                sec = '' + sec;
	                if (min == 0) {
	                    min = '00';
	                } else if (min < 10) {
	                    min = '0' + min;
	                } else {
	                    min = '' + min;
	                }
	            }
	            document.querySelector(minuteDom).innerHTML = min;
	            document.querySelector(secondDom).innerHTML = sec;
	        }, 1000);
	    },
	    getCookie: function(name) {
	        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	        if (arr = document.cookie.match(reg)) {
	            return unescape(arr[2]);
	        } else {
	            return null;
	        }
	    },
	
	    setCookie: function(name, value, expiresHours) {
	        var cookieString = name + "=" + escape(value);
	        if (expiresHours > 0) {
	            var date = new Date();
	            date.setTime(date.getTime() + expiresHours * 3600 * 1000);
	            cookieString = cookieString + "; expires=" + date.toGMTString() + ';domain=.musixise.com;path=/';
	        }
	        document.cookie = cookieString;
	    },
	
	    //Convert Time
	    getLocalTime: function(mS) {
	        var date1 = new Date(parseInt(mS) * 1000);
	        date1 = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
	        return date1;
	    },
	    // DECODE HTML
	    decodeHtml: function(str) {
	        var s = "";
	        if (str.length == 0) return "";
	        s = str.replace(/&lt;/g, "<");
	        s = s.replace(/&gt;/g, ">");
	        s = s.replace(/&nbsp;/g, " ");
	        s = s.replace(/&#39;/g, "\'");
	        s = s.replace(/&#039;/g, "\'");
	        s = s.replace(/&quot;/g, "\"");
	        s = s.replace(/&amp;/g, "&");
	        s = s.replace(/<br>/g, "\n");
	        return s;
	    },
	
	    // 过滤 HTML
	    filterHtml: function(str) {
	        var s = '';
	        if (str.length == 0) return "";
	        s = str.replace(/style="([\s\S]*?)"/ig, "");
	        s = s.replace(/<div(.*?)>/ig, '');
	        s = s.replace(/<\/div(.*?)>(<br(.*?)>)*/ig, '<br>');
	        s = s.replace(/<\/?p(.*?)>/ig, '<br>');
	        s = s.replace(/<object(.*?)>.*?<\/object>/ig, '');
	        s = s.replace(/<\/?(a|span)(.*?)>/ig, '');
	        s = s.replace(/<\/?[font|embed](.*?)>/ig, '<br>');
	        s = s.replace(/(<br\s*\/?>\s*(&nbsp;)*){2,}/ig, '<hr/>');
	        //s = s.replace(/<br>/i, '');
	        return s;
	    },
	    getTime: function(time) {
	        var that = this;
	        var curtime = (new Date()).getTime();
	        var gosecond = Math.round(curtime / 1000) - time;
	        if (gosecond < 5) {
	            r = "刚刚";
	        } else if (gosecond >= 0 && gosecond < 60) {
	            r = gosecond + "秒前";
	        } else if (gosecond >= 60 && gosecond < 3600) {
	            r = Math.ceil(gosecond / 60) + "分钟前";
	        } else if (gosecond >= 3600 && gosecond < 86400) {
	            r = Math.ceil(gosecond / 3600) + "小时前";
	        } else if (gosecond > 86400 && gosecond < 3 * 86400) {
	            r = Math.floor(gosecond / (3600 * 24)) + "天前";
	        } else {
	            r = that.getLocalTime(time);
	        }
	        return r;
	    }
	
	}
	module.exports = UtilsModule;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(7);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	var bind = __webpack_require__(9);
	var Axios = __webpack_require__(10);
	var defaults = __webpack_require__(11);
	
	/**
	 * Create an instance of Axios
	 *
	 * @param {Object} defaultConfig The default config for the instance
	 * @return {Axios} A new instance of Axios
	 */
	function createInstance(defaultConfig) {
	  var context = new Axios(defaultConfig);
	  var instance = bind(Axios.prototype.request, context);
	
	  // Copy axios.prototype to instance
	  utils.extend(instance, Axios.prototype, context);
	
	  // Copy context to instance
	  utils.extend(instance, context);
	
	  return instance;
	}
	
	// Create the default instance to be exported
	var axios = createInstance(defaults);
	
	// Expose Axios class to allow class inheritance
	axios.Axios = Axios;
	
	// Factory for creating new instances
	axios.create = function create(instanceConfig) {
	  return createInstance(utils.merge(defaults, instanceConfig));
	};
	
	// Expose Cancel & CancelToken
	axios.Cancel = __webpack_require__(29);
	axios.CancelToken = __webpack_require__(30);
	axios.isCancel = __webpack_require__(26);
	
	// Expose all/spread
	axios.all = function all(promises) {
	  return Promise.all(promises);
	};
	axios.spread = __webpack_require__(31);
	
	module.exports = axios;
	
	// Allow use of default import syntax in TypeScript
	module.exports.default = axios;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var bind = __webpack_require__(9);
	
	/*global toString:true*/
	
	// utils is a library of generic helper functions non-specific to axios
	
	var toString = Object.prototype.toString;
	
	/**
	 * Determine if a value is an Array
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Array, otherwise false
	 */
	function isArray(val) {
	  return toString.call(val) === '[object Array]';
	}
	
	/**
	 * Determine if a value is an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
	 */
	function isArrayBuffer(val) {
	  return toString.call(val) === '[object ArrayBuffer]';
	}
	
	/**
	 * Determine if a value is a FormData
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an FormData, otherwise false
	 */
	function isFormData(val) {
	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
	}
	
	/**
	 * Determine if a value is a view on an ArrayBuffer
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
	 */
	function isArrayBufferView(val) {
	  var result;
	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
	    result = ArrayBuffer.isView(val);
	  } else {
	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
	  }
	  return result;
	}
	
	/**
	 * Determine if a value is a String
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a String, otherwise false
	 */
	function isString(val) {
	  return typeof val === 'string';
	}
	
	/**
	 * Determine if a value is a Number
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Number, otherwise false
	 */
	function isNumber(val) {
	  return typeof val === 'number';
	}
	
	/**
	 * Determine if a value is undefined
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if the value is undefined, otherwise false
	 */
	function isUndefined(val) {
	  return typeof val === 'undefined';
	}
	
	/**
	 * Determine if a value is an Object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is an Object, otherwise false
	 */
	function isObject(val) {
	  return val !== null && typeof val === 'object';
	}
	
	/**
	 * Determine if a value is a Date
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Date, otherwise false
	 */
	function isDate(val) {
	  return toString.call(val) === '[object Date]';
	}
	
	/**
	 * Determine if a value is a File
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a File, otherwise false
	 */
	function isFile(val) {
	  return toString.call(val) === '[object File]';
	}
	
	/**
	 * Determine if a value is a Blob
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Blob, otherwise false
	 */
	function isBlob(val) {
	  return toString.call(val) === '[object Blob]';
	}
	
	/**
	 * Determine if a value is a Function
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Function, otherwise false
	 */
	function isFunction(val) {
	  return toString.call(val) === '[object Function]';
	}
	
	/**
	 * Determine if a value is a Stream
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a Stream, otherwise false
	 */
	function isStream(val) {
	  return isObject(val) && isFunction(val.pipe);
	}
	
	/**
	 * Determine if a value is a URLSearchParams object
	 *
	 * @param {Object} val The value to test
	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
	 */
	function isURLSearchParams(val) {
	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	}
	
	/**
	 * Trim excess whitespace off the beginning and end of a string
	 *
	 * @param {String} str The String to trim
	 * @returns {String} The String freed of excess whitespace
	 */
	function trim(str) {
	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}
	
	/**
	 * Determine if we're running in a standard browser environment
	 *
	 * This allows axios to run in a web worker, and react-native.
	 * Both environments support XMLHttpRequest, but not fully standard globals.
	 *
	 * web workers:
	 *  typeof window -> undefined
	 *  typeof document -> undefined
	 *
	 * react-native:
	 *  typeof document.createElement -> undefined
	 */
	function isStandardBrowserEnv() {
	  return (
	    typeof window !== 'undefined' &&
	    typeof document !== 'undefined' &&
	    typeof document.createElement === 'function'
	  );
	}
	
	/**
	 * Iterate over an Array or an Object invoking a function for each item.
	 *
	 * If `obj` is an Array callback will be called passing
	 * the value, index, and complete array for each item.
	 *
	 * If 'obj' is an Object callback will be called passing
	 * the value, key, and complete object for each property.
	 *
	 * @param {Object|Array} obj The object to iterate
	 * @param {Function} fn The callback to invoke for each item
	 */
	function forEach(obj, fn) {
	  // Don't bother if no value provided
	  if (obj === null || typeof obj === 'undefined') {
	    return;
	  }
	
	  // Force an array if not already something iterable
	  if (typeof obj !== 'object' && !isArray(obj)) {
	    /*eslint no-param-reassign:0*/
	    obj = [obj];
	  }
	
	  if (isArray(obj)) {
	    // Iterate over array values
	    for (var i = 0, l = obj.length; i < l; i++) {
	      fn.call(null, obj[i], i, obj);
	    }
	  } else {
	    // Iterate over object keys
	    for (var key in obj) {
	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
	        fn.call(null, obj[key], key, obj);
	      }
	    }
	  }
	}
	
	/**
	 * Accepts varargs expecting each argument to be an object, then
	 * immutably merges the properties of each object and returns result.
	 *
	 * When multiple objects contain the same key the later object in
	 * the arguments list will take precedence.
	 *
	 * Example:
	 *
	 * ```js
	 * var result = merge({foo: 123}, {foo: 456});
	 * console.log(result.foo); // outputs 456
	 * ```
	 *
	 * @param {Object} obj1 Object to merge
	 * @returns {Object} Result of all merge properties
	 */
	function merge(/* obj1, obj2, obj3, ... */) {
	  var result = {};
	  function assignValue(val, key) {
	    if (typeof result[key] === 'object' && typeof val === 'object') {
	      result[key] = merge(result[key], val);
	    } else {
	      result[key] = val;
	    }
	  }
	
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    forEach(arguments[i], assignValue);
	  }
	  return result;
	}
	
	/**
	 * Extends object a by mutably adding to it the properties of object b.
	 *
	 * @param {Object} a The object to be extended
	 * @param {Object} b The object to copy properties from
	 * @param {Object} thisArg The object to bind function to
	 * @return {Object} The resulting value of object a
	 */
	function extend(a, b, thisArg) {
	  forEach(b, function assignValue(val, key) {
	    if (thisArg && typeof val === 'function') {
	      a[key] = bind(val, thisArg);
	    } else {
	      a[key] = val;
	    }
	  });
	  return a;
	}
	
	module.exports = {
	  isArray: isArray,
	  isArrayBuffer: isArrayBuffer,
	  isFormData: isFormData,
	  isArrayBufferView: isArrayBufferView,
	  isString: isString,
	  isNumber: isNumber,
	  isObject: isObject,
	  isUndefined: isUndefined,
	  isDate: isDate,
	  isFile: isFile,
	  isBlob: isBlob,
	  isFunction: isFunction,
	  isStream: isStream,
	  isURLSearchParams: isURLSearchParams,
	  isStandardBrowserEnv: isStandardBrowserEnv,
	  forEach: forEach,
	  merge: merge,
	  extend: extend,
	  trim: trim
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function bind(fn, thisArg) {
	  return function wrap() {
	    var args = new Array(arguments.length);
	    for (var i = 0; i < args.length; i++) {
	      args[i] = arguments[i];
	    }
	    return fn.apply(thisArg, args);
	  };
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var defaults = __webpack_require__(11);
	var utils = __webpack_require__(8);
	var InterceptorManager = __webpack_require__(23);
	var dispatchRequest = __webpack_require__(24);
	var isAbsoluteURL = __webpack_require__(27);
	var combineURLs = __webpack_require__(28);
	
	/**
	 * Create a new instance of Axios
	 *
	 * @param {Object} instanceConfig The default config for the instance
	 */
	function Axios(instanceConfig) {
	  this.defaults = instanceConfig;
	  this.interceptors = {
	    request: new InterceptorManager(),
	    response: new InterceptorManager()
	  };
	}
	
	/**
	 * Dispatch a request
	 *
	 * @param {Object} config The config specific for this request (merged with this.defaults)
	 */
	Axios.prototype.request = function request(config) {
	  /*eslint no-param-reassign:0*/
	  // Allow for axios('example/url'[, config]) a la fetch API
	  if (typeof config === 'string') {
	    config = utils.merge({
	      url: arguments[0]
	    }, arguments[1]);
	  }
	
	  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
	
	  // Support baseURL config
	  if (config.baseURL && !isAbsoluteURL(config.url)) {
	    config.url = combineURLs(config.baseURL, config.url);
	  }
	
	  // Hook up interceptors middleware
	  var chain = [dispatchRequest, undefined];
	  var promise = Promise.resolve(config);
	
	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
	    chain.push(interceptor.fulfilled, interceptor.rejected);
	  });
	
	  while (chain.length) {
	    promise = promise.then(chain.shift(), chain.shift());
	  }
	
	  return promise;
	};
	
	// Provide aliases for supported request methods
	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url
	    }));
	  };
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  /*eslint func-names:0*/
	  Axios.prototype[method] = function(url, data, config) {
	    return this.request(utils.merge(config || {}, {
	      method: method,
	      url: url,
	      data: data
	    }));
	  };
	});
	
	module.exports = Axios;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(8);
	var normalizeHeaderName = __webpack_require__(13);
	
	var PROTECTION_PREFIX = /^\)\]\}',?\n/;
	var DEFAULT_CONTENT_TYPE = {
	  'Content-Type': 'application/x-www-form-urlencoded'
	};
	
	function setContentTypeIfUnset(headers, value) {
	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
	    headers['Content-Type'] = value;
	  }
	}
	
	function getDefaultAdapter() {
	  var adapter;
	  if (typeof XMLHttpRequest !== 'undefined') {
	    // For browsers use XHR adapter
	    adapter = __webpack_require__(14);
	  } else if (typeof process !== 'undefined') {
	    // For node use HTTP adapter
	    adapter = __webpack_require__(14);
	  }
	  return adapter;
	}
	
	var defaults = {
	  adapter: getDefaultAdapter(),
	
	  transformRequest: [function transformRequest(data, headers) {
	    normalizeHeaderName(headers, 'Content-Type');
	    if (utils.isFormData(data) ||
	      utils.isArrayBuffer(data) ||
	      utils.isStream(data) ||
	      utils.isFile(data) ||
	      utils.isBlob(data)
	    ) {
	      return data;
	    }
	    if (utils.isArrayBufferView(data)) {
	      return data.buffer;
	    }
	    if (utils.isURLSearchParams(data)) {
	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
	      return data.toString();
	    }
	    if (utils.isObject(data)) {
	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
	      return JSON.stringify(data);
	    }
	    return data;
	  }],
	
	  transformResponse: [function transformResponse(data) {
	    /*eslint no-param-reassign:0*/
	    if (typeof data === 'string') {
	      data = data.replace(PROTECTION_PREFIX, '');
	      try {
	        data = JSON.parse(data);
	      } catch (e) { /* Ignore */ }
	    }
	    return data;
	  }],
	
	  timeout: 0,
	
	  xsrfCookieName: 'XSRF-TOKEN',
	  xsrfHeaderName: 'X-XSRF-TOKEN',
	
	  maxContentLength: -1,
	
	  validateStatus: function validateStatus(status) {
	    return status >= 200 && status < 300;
	  }
	};
	
	defaults.headers = {
	  common: {
	    'Accept': 'application/json, text/plain, */*'
	  }
	};
	
	utils.forEach(['delete', 'get', 'head'], function forEachMehtodNoData(method) {
	  defaults.headers[method] = {};
	});
	
	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
	});
	
	module.exports = defaults;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 12 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	
	module.exports = function normalizeHeaderName(headers, normalizedName) {
	  utils.forEach(headers, function processHeader(value, name) {
	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
	      headers[normalizedName] = value;
	      delete headers[name];
	    }
	  });
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	var utils = __webpack_require__(8);
	var settle = __webpack_require__(15);
	var buildURL = __webpack_require__(18);
	var parseHeaders = __webpack_require__(19);
	var isURLSameOrigin = __webpack_require__(20);
	var createError = __webpack_require__(16);
	var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(21);
	
	module.exports = function xhrAdapter(config) {
	  return new Promise(function dispatchXhrRequest(resolve, reject) {
	    var requestData = config.data;
	    var requestHeaders = config.headers;
	
	    if (utils.isFormData(requestData)) {
	      delete requestHeaders['Content-Type']; // Let the browser set it
	    }
	
	    var request = new XMLHttpRequest();
	    var loadEvent = 'onreadystatechange';
	    var xDomain = false;
	
	    // For IE 8/9 CORS support
	    // Only supports POST and GET calls and doesn't returns the response headers.
	    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
	    if (process.env.NODE_ENV !== 'test' &&
	        typeof window !== 'undefined' &&
	        window.XDomainRequest && !('withCredentials' in request) &&
	        !isURLSameOrigin(config.url)) {
	      request = new window.XDomainRequest();
	      loadEvent = 'onload';
	      xDomain = true;
	      request.onprogress = function handleProgress() {};
	      request.ontimeout = function handleTimeout() {};
	    }
	
	    // HTTP basic authentication
	    if (config.auth) {
	      var username = config.auth.username || '';
	      var password = config.auth.password || '';
	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
	    }
	
	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
	
	    // Set the request timeout in MS
	    request.timeout = config.timeout;
	
	    // Listen for ready state
	    request[loadEvent] = function handleLoad() {
	      if (!request || (request.readyState !== 4 && !xDomain)) {
	        return;
	      }
	
	      // The request errored out and we didn't get a response, this will be
	      // handled by onerror instead
	      // With one exception: request that using file: protocol, most browsers
	      // will return status as 0 even though it's a successful request
	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
	        return;
	      }
	
	      // Prepare the response
	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
	      var response = {
	        data: responseData,
	        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
	        status: request.status === 1223 ? 204 : request.status,
	        statusText: request.status === 1223 ? 'No Content' : request.statusText,
	        headers: responseHeaders,
	        config: config,
	        request: request
	      };
	
	      settle(resolve, reject, response);
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle low level network errors
	    request.onerror = function handleError() {
	      // Real errors are hidden from us by the browser
	      // onerror should only fire if it's a network error
	      reject(createError('Network Error', config));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Handle timeout
	    request.ontimeout = function handleTimeout() {
	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED'));
	
	      // Clean up request
	      request = null;
	    };
	
	    // Add xsrf header
	    // This is only done if running in a standard browser environment.
	    // Specifically not if we're in a web worker, or react-native.
	    if (utils.isStandardBrowserEnv()) {
	      var cookies = __webpack_require__(22);
	
	      // Add xsrf header
	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
	          cookies.read(config.xsrfCookieName) :
	          undefined;
	
	      if (xsrfValue) {
	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
	      }
	    }
	
	    // Add headers to the request
	    if ('setRequestHeader' in request) {
	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
	          // Remove Content-Type if data is undefined
	          delete requestHeaders[key];
	        } else {
	          // Otherwise add header to the request
	          request.setRequestHeader(key, val);
	        }
	      });
	    }
	
	    // Add withCredentials to request if needed
	    if (config.withCredentials) {
	      request.withCredentials = true;
	    }
	
	    // Add responseType to request if needed
	    if (config.responseType) {
	      try {
	        request.responseType = config.responseType;
	      } catch (e) {
	        if (request.responseType !== 'json') {
	          throw e;
	        }
	      }
	    }
	
	    // Handle progress if needed
	    if (typeof config.onDownloadProgress === 'function') {
	      request.addEventListener('progress', config.onDownloadProgress);
	    }
	
	    // Not all browsers support upload events
	    if (typeof config.onUploadProgress === 'function' && request.upload) {
	      request.upload.addEventListener('progress', config.onUploadProgress);
	    }
	
	    if (config.cancelToken) {
	      // Handle cancellation
	      config.cancelToken.promise.then(function onCanceled(cancel) {
	        if (!request) {
	          return;
	        }
	
	        request.abort();
	        reject(cancel);
	        // Clean up request
	        request = null;
	      });
	    }
	
	    if (requestData === undefined) {
	      requestData = null;
	    }
	
	    // Send the request
	    request.send(requestData);
	  });
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var createError = __webpack_require__(16);
	
	/**
	 * Resolve or reject a Promise based on response status.
	 *
	 * @param {Function} resolve A function that resolves the promise.
	 * @param {Function} reject A function that rejects the promise.
	 * @param {object} response The response.
	 */
	module.exports = function settle(resolve, reject, response) {
	  var validateStatus = response.config.validateStatus;
	  // Note: status is not exposed by XDomainRequest
	  if (!response.status || !validateStatus || validateStatus(response.status)) {
	    resolve(response);
	  } else {
	    reject(createError(
	      'Request failed with status code ' + response.status,
	      response.config,
	      null,
	      response
	    ));
	  }
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var enhanceError = __webpack_require__(17);
	
	/**
	 * Create an Error with the specified message, config, error code, and response.
	 *
	 * @param {string} message The error message.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 @ @param {Object} [response] The response.
	 * @returns {Error} The created error.
	 */
	module.exports = function createError(message, config, code, response) {
	  var error = new Error(message);
	  return enhanceError(error, config, code, response);
	};


/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Update an Error with the specified config, error code, and response.
	 *
	 * @param {Error} error The error to update.
	 * @param {Object} config The config.
	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
	 @ @param {Object} [response] The response.
	 * @returns {Error} The error.
	 */
	module.exports = function enhanceError(error, config, code, response) {
	  error.config = config;
	  if (code) {
	    error.code = code;
	  }
	  error.response = response;
	  return error;
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	
	function encode(val) {
	  return encodeURIComponent(val).
	    replace(/%40/gi, '@').
	    replace(/%3A/gi, ':').
	    replace(/%24/g, '$').
	    replace(/%2C/gi, ',').
	    replace(/%20/g, '+').
	    replace(/%5B/gi, '[').
	    replace(/%5D/gi, ']');
	}
	
	/**
	 * Build a URL by appending params to the end
	 *
	 * @param {string} url The base of the url (e.g., http://www.google.com)
	 * @param {object} [params] The params to be appended
	 * @returns {string} The formatted url
	 */
	module.exports = function buildURL(url, params, paramsSerializer) {
	  /*eslint no-param-reassign:0*/
	  if (!params) {
	    return url;
	  }
	
	  var serializedParams;
	  if (paramsSerializer) {
	    serializedParams = paramsSerializer(params);
	  } else if (utils.isURLSearchParams(params)) {
	    serializedParams = params.toString();
	  } else {
	    var parts = [];
	
	    utils.forEach(params, function serialize(val, key) {
	      if (val === null || typeof val === 'undefined') {
	        return;
	      }
	
	      if (utils.isArray(val)) {
	        key = key + '[]';
	      }
	
	      if (!utils.isArray(val)) {
	        val = [val];
	      }
	
	      utils.forEach(val, function parseValue(v) {
	        if (utils.isDate(v)) {
	          v = v.toISOString();
	        } else if (utils.isObject(v)) {
	          v = JSON.stringify(v);
	        }
	        parts.push(encode(key) + '=' + encode(v));
	      });
	    });
	
	    serializedParams = parts.join('&');
	  }
	
	  if (serializedParams) {
	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
	  }
	
	  return url;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	
	/**
	 * Parse headers into an object
	 *
	 * ```
	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
	 * Content-Type: application/json
	 * Connection: keep-alive
	 * Transfer-Encoding: chunked
	 * ```
	 *
	 * @param {String} headers Headers needing to be parsed
	 * @returns {Object} Headers parsed into an object
	 */
	module.exports = function parseHeaders(headers) {
	  var parsed = {};
	  var key;
	  var val;
	  var i;
	
	  if (!headers) { return parsed; }
	
	  utils.forEach(headers.split('\n'), function parser(line) {
	    i = line.indexOf(':');
	    key = utils.trim(line.substr(0, i)).toLowerCase();
	    val = utils.trim(line.substr(i + 1));
	
	    if (key) {
	      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	    }
	  });
	
	  return parsed;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs have full support of the APIs needed to test
	  // whether the request URL is of the same origin as current location.
	  (function standardBrowserEnv() {
	    var msie = /(msie|trident)/i.test(navigator.userAgent);
	    var urlParsingNode = document.createElement('a');
	    var originURL;
	
	    /**
	    * Parse a URL to discover it's components
	    *
	    * @param {String} url The URL to be parsed
	    * @returns {Object}
	    */
	    function resolveURL(url) {
	      var href = url;
	
	      if (msie) {
	        // IE needs attribute set twice to normalize properties
	        urlParsingNode.setAttribute('href', href);
	        href = urlParsingNode.href;
	      }
	
	      urlParsingNode.setAttribute('href', href);
	
	      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
	      return {
	        href: urlParsingNode.href,
	        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
	        host: urlParsingNode.host,
	        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
	        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
	        hostname: urlParsingNode.hostname,
	        port: urlParsingNode.port,
	        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
	                  urlParsingNode.pathname :
	                  '/' + urlParsingNode.pathname
	      };
	    }
	
	    originURL = resolveURL(window.location.href);
	
	    /**
	    * Determine if a URL shares the same origin as the current location
	    *
	    * @param {String} requestURL The URL to test
	    * @returns {boolean} True if URL shares the same origin, otherwise false
	    */
	    return function isURLSameOrigin(requestURL) {
	      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
	      return (parsed.protocol === originURL.protocol &&
	            parsed.host === originURL.host);
	    };
	  })() :
	
	  // Non standard browser envs (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return function isURLSameOrigin() {
	      return true;
	    };
	  })()
	);


/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js
	
	var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	
	function E() {
	  this.message = 'String contains an invalid character';
	}
	E.prototype = new Error;
	E.prototype.code = 5;
	E.prototype.name = 'InvalidCharacterError';
	
	function btoa(input) {
	  var str = String(input);
	  var output = '';
	  for (
	    // initialize result and counter
	    var block, charCode, idx = 0, map = chars;
	    // if the next str index does not exist:
	    //   change the mapping table to "="
	    //   check if d has no fractional digits
	    str.charAt(idx | 0) || (map = '=', idx % 1);
	    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	  ) {
	    charCode = str.charCodeAt(idx += 3 / 4);
	    if (charCode > 0xFF) {
	      throw new E();
	    }
	    block = block << 8 | charCode;
	  }
	  return output;
	}
	
	module.exports = btoa;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	
	module.exports = (
	  utils.isStandardBrowserEnv() ?
	
	  // Standard browser envs support document.cookie
	  (function standardBrowserEnv() {
	    return {
	      write: function write(name, value, expires, path, domain, secure) {
	        var cookie = [];
	        cookie.push(name + '=' + encodeURIComponent(value));
	
	        if (utils.isNumber(expires)) {
	          cookie.push('expires=' + new Date(expires).toGMTString());
	        }
	
	        if (utils.isString(path)) {
	          cookie.push('path=' + path);
	        }
	
	        if (utils.isString(domain)) {
	          cookie.push('domain=' + domain);
	        }
	
	        if (secure === true) {
	          cookie.push('secure');
	        }
	
	        document.cookie = cookie.join('; ');
	      },
	
	      read: function read(name) {
	        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
	        return (match ? decodeURIComponent(match[3]) : null);
	      },
	
	      remove: function remove(name) {
	        this.write(name, '', Date.now() - 86400000);
	      }
	    };
	  })() :
	
	  // Non standard browser env (web workers, react-native) lack needed support.
	  (function nonStandardBrowserEnv() {
	    return {
	      write: function write() {},
	      read: function read() { return null; },
	      remove: function remove() {}
	    };
	  })()
	);


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	
	function InterceptorManager() {
	  this.handlers = [];
	}
	
	/**
	 * Add a new interceptor to the stack
	 *
	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
	 * @param {Function} rejected The function to handle `reject` for a `Promise`
	 *
	 * @return {Number} An ID used to remove interceptor later
	 */
	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
	  this.handlers.push({
	    fulfilled: fulfilled,
	    rejected: rejected
	  });
	  return this.handlers.length - 1;
	};
	
	/**
	 * Remove an interceptor from the stack
	 *
	 * @param {Number} id The ID that was returned by `use`
	 */
	InterceptorManager.prototype.eject = function eject(id) {
	  if (this.handlers[id]) {
	    this.handlers[id] = null;
	  }
	};
	
	/**
	 * Iterate over all the registered interceptors
	 *
	 * This method is particularly useful for skipping over any
	 * interceptors that may have become `null` calling `eject`.
	 *
	 * @param {Function} fn The function to call for each interceptor
	 */
	InterceptorManager.prototype.forEach = function forEach(fn) {
	  utils.forEach(this.handlers, function forEachHandler(h) {
	    if (h !== null) {
	      fn(h);
	    }
	  });
	};
	
	module.exports = InterceptorManager;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	var transformData = __webpack_require__(25);
	var isCancel = __webpack_require__(26);
	var defaults = __webpack_require__(11);
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	function throwIfCancellationRequested(config) {
	  if (config.cancelToken) {
	    config.cancelToken.throwIfRequested();
	  }
	}
	
	/**
	 * Dispatch a request to the server using the configured adapter.
	 *
	 * @param {object} config The config that is to be used for the request
	 * @returns {Promise} The Promise to be fulfilled
	 */
	module.exports = function dispatchRequest(config) {
	  throwIfCancellationRequested(config);
	
	  // Ensure headers exist
	  config.headers = config.headers || {};
	
	  // Transform request data
	  config.data = transformData(
	    config.data,
	    config.headers,
	    config.transformRequest
	  );
	
	  // Flatten headers
	  config.headers = utils.merge(
	    config.headers.common || {},
	    config.headers[config.method] || {},
	    config.headers || {}
	  );
	
	  utils.forEach(
	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
	    function cleanHeaderConfig(method) {
	      delete config.headers[method];
	    }
	  );
	
	  var adapter = config.adapter || defaults.adapter;
	
	  return adapter(config).then(function onAdapterResolution(response) {
	    throwIfCancellationRequested(config);
	
	    // Transform response data
	    response.data = transformData(
	      response.data,
	      response.headers,
	      config.transformResponse
	    );
	
	    return response;
	  }, function onAdapterRejection(reason) {
	    if (!isCancel(reason)) {
	      throwIfCancellationRequested(config);
	
	      // Transform response data
	      if (reason && reason.response) {
	        reason.response.data = transformData(
	          reason.response.data,
	          reason.response.headers,
	          config.transformResponse
	        );
	      }
	    }
	
	    return Promise.reject(reason);
	  });
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(8);
	
	/**
	 * Transform the data for a request or a response
	 *
	 * @param {Object|String} data The data to be transformed
	 * @param {Array} headers The headers for the request or response
	 * @param {Array|Function} fns A single function or Array of functions
	 * @returns {*} The resulting transformed data
	 */
	module.exports = function transformData(data, headers, fns) {
	  /*eslint no-param-reassign:0*/
	  utils.forEach(fns, function transform(fn) {
	    data = fn(data, headers);
	  });
	
	  return data;
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function isCancel(value) {
	  return !!(value && value.__CANCEL__);
	};


/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Determines whether the specified URL is absolute
	 *
	 * @param {string} url The URL to test
	 * @returns {boolean} True if the specified URL is absolute, otherwise false
	 */
	module.exports = function isAbsoluteURL(url) {
	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
	  // by any combination of letters, digits, plus, period, or hyphen.
	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
	};


/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Creates a new URL by combining the specified URLs
	 *
	 * @param {string} baseURL The base URL
	 * @param {string} relativeURL The relative URL
	 * @returns {string} The combined URL
	 */
	module.exports = function combineURLs(baseURL, relativeURL) {
	  return baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '');
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * A `Cancel` is an object that is thrown when an operation is canceled.
	 *
	 * @class
	 * @param {string=} message The message.
	 */
	function Cancel(message) {
	  this.message = message;
	}
	
	Cancel.prototype.toString = function toString() {
	  return 'Cancel' + (this.message ? ': ' + this.message : '');
	};
	
	Cancel.prototype.__CANCEL__ = true;
	
	module.exports = Cancel;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Cancel = __webpack_require__(29);
	
	/**
	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
	 *
	 * @class
	 * @param {Function} executor The executor function.
	 */
	function CancelToken(executor) {
	  if (typeof executor !== 'function') {
	    throw new TypeError('executor must be a function.');
	  }
	
	  var resolvePromise;
	  this.promise = new Promise(function promiseExecutor(resolve) {
	    resolvePromise = resolve;
	  });
	
	  var token = this;
	  executor(function cancel(message) {
	    if (token.reason) {
	      // Cancellation has already been requested
	      return;
	    }
	
	    token.reason = new Cancel(message);
	    resolvePromise(token.reason);
	  });
	}
	
	/**
	 * Throws a `Cancel` if cancellation has been requested.
	 */
	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
	  if (this.reason) {
	    throw this.reason;
	  }
	};
	
	/**
	 * Returns an object that contains a new `CancelToken` and a function that, when called,
	 * cancels the `CancelToken`.
	 */
	CancelToken.source = function source() {
	  var cancel;
	  var token = new CancelToken(function executor(c) {
	    cancel = c;
	  });
	  return {
	    token: token,
	    cancel: cancel
	  };
	};
	
	module.exports = CancelToken;


/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Syntactic sugar for invoking a function and expanding an array for arguments.
	 *
	 * Common use case would be to use `Function.prototype.apply`.
	 *
	 *  ```js
	 *  function f(x, y, z) {}
	 *  var args = [1, 2, 3];
	 *  f.apply(null, args);
	 *  ```
	 *
	 * With `spread` this example can be re-written.
	 *
	 *  ```js
	 *  spread(function(x, y, z) {})([1, 2, 3]);
	 *  ```
	 *
	 * @param {Function} callback
	 * @returns {Function}
	 */
	module.exports = function spread(callback) {
	  return function wrap(arr) {
	    return callback.apply(null, arr);
	  };
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// var Visual = require('./visual.js');
	var Musixise = __webpack_require__(3)
	
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

/***/ },
/* 33 */
/***/ function(module, exports) {

	module.exports = {
	    realname: '小野妹子',
	    userId: '103554',
	    largeAvatar: './assets/1.gif',
	    followerNum: '1314',
	    online: true,
	}

/***/ },
/* 34 */
/***/ function(module, exports) {

	 module.exports = [{
	     name: '半岛铁盒',
	     author: 'jay',
	     workId: '5',
	     description: '哪里有卖',
	     createTime: '1314',
	     likes: '1002',
	     mp3: ''
	 }, {
	     name: '她的睫毛',
	     author: 'f',
	     workId: '24',
	     description: '睫毛弯弯，眼睛眨呀眨呀眨',
	     createTime: '10000',
	     likes: '10',
	     mp3: ''
	 }, {
	     name: '最后的战役',
	     author: 'princess',
	     workId: '1',
	     description: '我留着陪你，强忍着泪滴',
	     createTime: '100',
	     likes: '924',
	     mp3: ''
	 }, {
	     name: '飞啊飞啊我的骄傲放纵',
	     author: 'princess',
	     workId: '1',
	     description: '我留着陪你，强忍着泪滴',
	     createTime: '100',
	     likes: '924',
	     mp3: ''
	 }];

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var _ = { escape: __webpack_require__(36) };module.exports = function (data) {
	var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
	function print() { __p += __j.call(arguments, '') }
	__p += '\n';
	 if(data.followStatus) { ;
	__p += '<div class="follow-status active"></div>';
	 } else { ;
	__p += '<div class="follow-status inactive"></div>';
	 };
	__p += '<div class="avatar"><img src="' +
	__e(data.largeAvatar) +
	'"><div class="gradient-mask"></div><p class="realname">' +
	__e(data.realname) +
	'</p><div id="relation-tab"><div id="watchhim"><span class="superscript">' +
	__e(data.fansNum) +
	'</span></div><div id="hewatch"><span class="superscript">' +
	__e(data.followNum) +
	'</span></div></div></div><div class="intro">';
	 if(data.introduction) { ;
	__p +=
	__e(data.introduction);
	} else { ;
	__p += '\n  此处应有个人介绍\n  ';
	 };
	__p += '</div><div class="section-spliter"></div><div class="tab-container"><div class="active tab" id="work-tab">作品</div><div class="tab" id="live-tab">直播</div></div><div class="work-list"></div><div class="live-list"></div>\n';
	return __p
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;
	
	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';
	
	/** Used to match HTML entities and HTML characters. */
	var reUnescapedHtml = /[&<>"'`]/g,
	    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
	
	/** Used to map characters to HTML entities. */
	var htmlEscapes = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#39;',
	  '`': '&#96;'
	};
	
	/** Used to determine if values are of the language type `Object`. */
	var objectTypes = {
	  'function': true,
	  'object': true
	};
	
	/** Detect free variable `exports`. */
	var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType) ? exports : null;
	
	/** Detect free variable `module`. */
	var freeModule = (objectTypes[typeof module] && module && !module.nodeType) ? module : null;
	
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);
	
	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	
	/** Detect free variable `window`. */
	var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	
	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
	
	/**
	 * Used as a reference to the global object.
	 *
	 * The `this` value is used if it's the global object to avoid Greasemonkey's
	 * restricted `window` object, otherwise the `window` object is used.
	 */
	var root = freeGlobal || ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) || freeSelf || thisGlobal || Function('return this')();
	
	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return (value && value.Object === Object) ? value : null;
	}
	
	/**
	 * Used by `_.escape` to convert characters to HTML entities.
	 *
	 * @private
	 * @param {string} chr The matched character to escape.
	 * @returns {string} Returns the escaped character.
	 */
	function escapeHtmlChar(chr) {
	  return htmlEscapes[chr];
	}
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Built-in value references. */
	var Symbol = root.Symbol;
	
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = Symbol ? symbolProto.toString : undefined;
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}
	
	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (value == null) {
	    return '';
	  }
	  if (isSymbol(value)) {
	    return Symbol ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}
	
	/**
	 * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
	 * their corresponding HTML entities.
	 *
	 * **Note:** No other characters are escaped. To escape additional
	 * characters use a third-party library like [_he_](https://mths.be/he).
	 *
	 * Though the ">" character is escaped for symmetry, characters like
	 * ">" and "/" don't need escaping in HTML and have no special meaning
	 * unless they're part of a tag or unquoted attribute value.
	 * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
	 * (under "semi-related fun fact") for more details.
	 *
	 * Backticks are escaped because in IE < 9, they can break out of
	 * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
	 * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
	 * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
	 * for more details.
	 *
	 * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
	 * to reduce XSS vectors.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escape('fred, barney, & pebbles');
	 * // => 'fred, barney, &amp; pebbles'
	 */
	function escape(string) {
	  string = toString(string);
	  return (string && reHasUnescapedHtml.test(string))
	    ? string.replace(reUnescapedHtml, escapeHtmlChar)
	    : string;
	}
	
	module.exports = escape;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(37)(module), (function() { return this; }())))

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var _ = { escape: __webpack_require__(36) };module.exports = function (data) {
	var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
	function print() { __p += __j.call(arguments, '') }
	
	 if(data.length) { ;
	__p += '<ul>';
	 for(var i = 0, len = data.length; i <len; i++) { ;
	
	 var l = data[i]; ;
	__p += '<li data-id="' +
	__e(l.id) +
	'"><div class="info" data-id="' +
	__e(l.id) +
	'"><span data-id="' +
	__e(l.id) +
	'">' +
	__e(new Date(l.createdDate)) +
	'</span><span data-id="' +
	__e(l.id) +
	'">' +
	__e(l.title) +
	'</span><span data-id="' +
	__e(l.id) +
	'">' +
	__e(l.content) +
	'</span>';
	 if (data.followStatus){;
	__p += '<span data-likeid="' +
	__e(l.id) +
	'">like</span>';
	}else{;
	__p += '<span data-likeid="' +
	__e(l.id) +
	'">like not</span>';
	};
	__p += '</div></li>';
	 } ;
	__p += '</ul>';
	 } ;
	__p += '\n';
	return __p
	};


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map