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