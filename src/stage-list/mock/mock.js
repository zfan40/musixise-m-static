module.exports = function(options) {

  var mockData = {
    "api": "alibaba.music.xiami.api.test.testAdd",
    "v": "5.0",
    "ret": [
      "SUCCESS::调用成功"
    ],
    "data": {
      "header": {
        "version": 1,
        "ttl": 3600
      },
      "datasort": ["headerModule", "rightDescModule","benefitModule","fansRankModule", "songSellInfoModule"],
      "data": {
        "songSellInfoModule": {
          "itemId": 1,
          "title": "标题",
          "list": [{
            "link": "http://www.baidu.com",
            "title": "标题"
          },{
            "link": "http://www.baidu.com",
            "title": "标题"
          },{
            "link": "http://www.baidu.com",
            "title": "标题"
          }],
          "desc": "啦啦啦"
        },
        "sellCountModule": {
          "sellCount": 100,
          "albumId": 1000,
          "showType": 1,
          "text": "售卖中"
        },
        "benefitModule": {
          "benefitItems": [{
            "itemId": 1,
            "subtitle": "这是一个进化",
            "pic": "http://gw.alicdn.com/tps/TB1FBGKJFXXXXcOaXXXXXXXXXXX-411-411.png",
            "title": "电子书进化版",
            "url": "xiami://song/1"
          },{
            "itemId": 2,
            "subtitle": "这是一个进化",
            "pic": "http://gw.alicdn.com/tps/TB1FBGKJFXXXXcOaXXXXXXXXXXX-411-411.png",
            "title": "电子书进化版",
            "url": "xiami://song/1"
          },{
            "itemId": 3,
            "subtitle": "这是一个进化",
            "pic": "http://gw.alicdn.com/tps/TB1FBGKJFXXXXcOaXXXXXXXXXXX-411-411.png",
            "title": "电子书进化版",
            "url": "xiami://song/1"
          }],
          "title": "丁当粉丝权益"
        },
        "videoModule": {
          "mainTitle": "视频标题",
          "videos": [{
            "videoUrl": "http://cloud.video.taobao.com/play/u/213388661/p/2/e/3/t/1/38392387.m3u8",
            "logo": "http://pic.xiami.net/images/album/img69/7169/33322.jpg",
            "videoId": 12,
            "title": "视频标题"
          }]
        },
        "rightDescModule": {
          "activityDescOption": true,
          "selfDefineDesc":["专辑的高品质试听","专辑的高品质试听","专辑的高品质试听"] ,
          "albumId": 1,
          "activityDesc": "专辑的高品质专辑的高品质试听专辑的高品质试听专辑的高品质试听专辑的高品质试听专辑的高品质试听试听"
        },
        "headerModule": {
          "albumLogo": "http://img.xiami.net/images/common/uploadpic/50/14628457505704.jpg",
          "albumName": "当我的好朋友",
          "singer": "丁当",
          "albumId": 1
        },
        "listenSongModule": {
          "listenSongItemsVOList": [{
            "listenFile": "http://img.xiami.net/images/common/uploadpic/50/14628457505704.mp3",
            "albumId": 1,
            "id": 1,
            "time": 30,
            "title": "晴天"
          }],
          "description": "当我的好朋友",
          "title": "当我的好朋友"
        },
        "unlockModule": {
          "mainTitle": "主标题",
          "unlocks": [{
            "unlockId": 12,
            "count": "50",
            "logo": "http://pic.xiami.net/images/album/img69/7169/33322.jpg",
            "title": "视频标题",
            "url": "www.xiami.com"
          }],
          "desc": "说明"
        },
        "fansRankModule": {
          "quantity": 12,
          "subtitle": "副标题",
          "topUsers": [{
            "quantity": 120,
            "nickName": "夜雀",
            "userId": 12,
            "portraitPic": ""
          }],
          "order": 2
        }
      }
    }
  };

  return Promise.resolve(mockData);

};
