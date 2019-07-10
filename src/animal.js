// var Animal = cc.Node.extend({
//     ctor :function (index) {
//         this._super();
//         this.click();
//         this.typeList =["chicken","fox","cat","bear","frog","horse"];
//         this.animate = this.createAnimation(this.typeList[index-1]);
//         this.index = index;
//
//         var size = (new cc.Sprite(res.gameBackGround)).getContentSize()
//         this.setContentSize(size);
//         this.setAnchorPoint(0.5,0.5)
//         this.sprite = new cc.Sprite();
//         this.addChild(this.sprite);
//         this.setSkin(index);
//
//         this.xiaochu = new cc.Sprite(res.xiaochu);
//         this.xiaochu.x = this.width/2 ;
//         this.xiaochu.y = this.height/2;
//         this.xiaochu.visible =false;
//         this.addChild(this.xiaochu);
//     },
//     click:function () {
//         var that = this;
//         var listener = cc.EventListener.create({
//             event : cc.EventListener.TOUCH_ONE_BY_ONE,
//             swallowtouches :true,
//             onTouchBegan:function (touch,event) {
//                 // cc.log(touch.getLocation());
//                 var pos =touch.getLocation();
//                 var rect = cc.rect(0,0,that.width,that.height);
//                 pos = that.convertToNodeSpace(pos);
//                 // cc.log(pos)
//                 if (cc.rectContainsPoint(rect,pos)){
//                     // cc.log(123)
//                     cc.eventManager.dispatchCustomEvent('我是一个暗号',that)  //发送一个自定义事件
//                 }
//             }
//         })
//         cc.eventManager.addListener(listener,that)
//     },
// //    创建动画
//     createAnimation:function(type){
//         var aniFrames = [];
//         for(var i=0;i<40;i++){
//             var fileName = type+'_click_'+(i<10?'0'+i:i)+'.png'
//             var frame = cc.spriteFrameCache.getSpriteFrame(fileName);
//             // cc.log('nihao'+frame)
//             if(frame){
//                 aniFrames.push(frame);
//             }
//         }
//         var animation = new cc.Animation(aniFrames,0.02);
//         return new cc.Animate(animation);
//     },
//     // 播放动画
//     playAni:function (bool) {
//         if(bool){
//             var action = cc.repeatForever(this.animate)
//             action.setTag(123);
//             this.runAction(action);
//         }else{
//             //停止播放动画
//             this.stopActionByTag(123);
//             //还原皮肤
//             this.setSkin(this.index);
//         }
//
//     },
//     setSkin:function(index){
//          var name =  this.typeList[index - 1] + '_click_01.png'
//         this.sprite.setSpriteFrame(name);
//  },
//     clearAni:function () {
//         this.xiaochu.scale = 0.5;
//         this.xiaochu.visible =true;
//          var action1 =   cc.scaleTo(0.3,1,1);
//          var action2 =  cc.tintTo(0.3,255,255,120);
//          var action3 = cc.fadeOut(0.3);
//          this.xiaochu.runAction(
//              cc.sequence(
//                  cc.spawn(action1,action2),
//                  action3
//              )
//
//          )
//     }
// })