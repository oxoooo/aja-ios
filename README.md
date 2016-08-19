# AJA 开源计划

AJA 是一个语音助手，可以通过任何编程语言来开发语音交互的功能，比如说我们经常使用的微信扫一扫，你只需要写几行代码，那么AJA就可以帮你搞定。

```javascript
result = {
	intro: '帮我打开微信扫一扫',
	text: '正在打开微信扫一扫',
    action: {
    	target: 'com.tencent.mm',
    	uri: 'weixin://scanqrcode'
    },
    finish: true
};
```

目前我们正处于内测阶段，有兴趣一起开发的可以通过直接联系我。

