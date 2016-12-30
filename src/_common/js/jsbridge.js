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