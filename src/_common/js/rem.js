;(function(){
    var win = window, docElem = document.documentElement, timeoutId;
    setRem();
    docElem.setAttribute('data-dpr', win.devicePixelRatio);
    win.addEventListener('resize', delaySetRem, false);
    win.addEventListener('pageshow', function(e){
        e.persisted && delaySetRem();
    }, false);

    function delaySetRem(){
        clearTimeout(timeoutId);
        timeoutId = setTimeout(setRem, 300);
    }

    function setRem(){
        win.rem = docElem.getBoundingClientRect().width / 10;
        docElem.style.fontSize = win.rem + 'px';
    }
})();