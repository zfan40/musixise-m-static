// var tpl = require('../template/app.ejs');
var Swiper = require('swiper');

/**
 * Musixise m site index page
 */
var logoCountObj = {
    count:0,
    angle:-45,
    color1:'#ff8100',
    color2:'#ffcc33'
}

var app = {
    init: function() {
        var self = this;
        FullSwiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            speed: 400,
            spaceBetween: 0
        });
        // SwiperPage3 = new Swiper('#page3', {
        //     speed: 400,
        //     spaceBetween: 0,
        //     slidesPerView: 3,
        //     pagination: '.swiper-pagination'
        // });
        var logoBackgroundDom = document.querySelector('.m-logo-background');
        var timer = setInterval(function(){
            logoBackgroundDom.style.background = 'linear-gradient('+logoCountObj.angle+'deg, '+logoCountObj.color1+','+logoCountObj.color2+')';
            logoCountObj.count ++;
            logoCountObj.angle +=2;
            if (logoCountObj.count==178) {
                logoCountObj = {
                    count:0,
                    angle:-45,
                    color1:'#ff8100',
                    color2:'#ffcc33'
                }
                clearInterval(timer);
                var yellowCoverage = 100;
                var timer2 = setInterval(function(){
                    yellowCoverage-=1;
                    if (yellowCoverage<0){
                        clearInterval(timer2);
                    }
                    logoBackgroundDom.style.background = 'linear-gradient(-45deg,#ff8100,#ffcc33 '+yellowCoverage+'%)';

                },20)
            }         
        },2);

        setTimeout(function(){
            self.popLetters();
        },5500);

    },
    popLetters: function(){

        var letterUnits = document.querySelectorAll('#byzq span');
        var letterLength = letterUnits.length;
        var count = 0;
        for (var i = 0; i<=letterLength-1;i++) {
            // letterUnits[i].style.tranform='translate('+(500-1000*(Math.random()))+'%,'+(500-1000*(Math.random()))+'%)';
            letterUnits[i].style.top = Math.random()*10+'rem';//一列20字，每个字0.5rem高
            letterUnits[i].style.left = Math.random()*10+'rem';//整体8rem,一列20字，每个字1.6rem宽
            letterUnits[i].style.display = 'block';
        }
        var timer = setInterval(function(){
            
            if(count>=letterLength-1) {
                clearInterval(timer);
            }
            letterUnits[count].style.top = (count%20)*0.5+'rem';//一列20字，每个字0.5rem高
            letterUnits[count].style.left = (6.4-Math.floor(count/20)*1.6)+'rem';//整体8rem,一列20字，每个字1.6rem宽
            count++;
        },20);
    }
};
module.exports = app;