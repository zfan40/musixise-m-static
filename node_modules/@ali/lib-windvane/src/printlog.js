;(function(win){
    var doc = win.document;
    var _alert = win.alert;
    var _log = win.console.log;
    var logPannel = doc.createElement('div');
    var logBox = doc.createElement('div');
    var logTitle = doc.createElement('h3');
    var logList = doc.createElement('ul');

    logPannel.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.6);display:none;-webkit-box-pack:center;-webkit-box-align:center;';
    logBox.style.cssText = 'box-sizing:border-box;width:90%;height:340px;padding:15px;background-color:#FFF;box-shadow:0px 1px 1px rgba(0,0,0,0.3);border-radius:4px;'
    logTitle.style.cssText = 'width:100%;margin:0;margin-bottom:10px;padding:0;height:20px;line-height:20px;font-size:14px;'
    logTitle.innerHTML = '<span style="color:#666;">调试面板</span><a id="log-pannel-close" style="color:#666;display:block;float:right;height:20px;line-height:20px;">关闭</a>';
    logList.style.cssText = 'margin:0;padding:0;width:100%;height:280px;overflow:auto;list-style:none;line-height:1.5em;'

    logBox.appendChild(logTitle);
    logBox.appendChild(logList);
    logPannel.appendChild(logBox);

    logTitle.querySelector('#log-pannel-close').addEventListener('touchend', function(e) {
        logPannel.style.display = 'none';
        logList.innerHTML = '';
    }, false);

    var tapTime = 0;
    logList.addEventListener('touchstart', function(e){
        if (e.target.tagName.toUpperCase() === 'A') {
            tapTime = Date.now();
        } else {
            tapTime = 0;
        }
    }, false);

    logList.addEventListener('touchend', function(e) {
        if (tapTime && Date.now() - tapTime < 300) {
            if (e.target.tagName.toUpperCase() === 'A') {
                var str = e.target.innerHTML.replace(/^\[[^\[\]]+\]/, '');
                _log.call(win.console, str);
                _alert(str);
            }
        }
        tapTime = 0;
    }, false);

    win.printlog = function(str, type) {
        if (!logPannel.parentNode) {
            doc.body.appendChild(logPannel);
        }

        logPannel.style.display = '-webkit-box';
        var logItem = doc.createElement('li');
        logItem.style.cssText = 'width:100%;height:1.5em;overflow:hidden;word-wrap:break-word;word-break:break-all;border-bottom:1px solid #CCC;';
        logItem.style.color = type === 'ERROR'?'red':'#333';
        logItem.innerHTML = '<a style="display:block;width:100%;height:100%;text-decoration:none;">[' + new Date().toString().split(' ')[4] + '] ' + str + '</a>';

        if (logList.childNodes.length) {
            logList.insertBefore(logItem, logList.childNodes[0]);
        } else {
            logList.appendChild(logItem);
        }
    }

    win.alert = function(str) {
        printlog(str, 'ALERT');
    }

    win.console.log = function() {
        var str = Array.prototype.join.call(arguments, ',');
        printlog(str, 'LOG');
    }

    win.onerror = function(e) {
        printlog(JSON.stringify(e), 'ERROR');
    }

    win.clearlog = function() {
        logList.innerHTML = '';
}
})(window);