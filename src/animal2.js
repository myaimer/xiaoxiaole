var oneAnimal = cc.Node.extend({
    ctor:function(index){
        this._super();
        this.click(this.bool);
        this.typeList = ["chicken","fox","cat","bear","frog","horse"]
        this.bool = false;
        this.index = index;
        this.skill = null;     //消除时用，避免刚获得技能时就被使用
        this.sx_skill =null;
        this.needDrop = false;    //获取冰块的尺寸
        var size = (new cc.Sprite(res.gameBackGround)).getContentSize();
        //设置这个node的尺寸
        this.setContentSize(size);
        //设置节点的锚点
        this.setAnchorPoint(0.5,0.5);

        //最开始是一张空图
        this.sprite = new cc.Sprite();
        this.sprite.x = this.width / 2;
        this.sprite.y = this.height / 2
        this.addChild(this.sprite,5);

        this.bird = new cc.Sprite(res.bird);
        this.bird.x = this.width / 2;
        this.bird.y = this.height / 2;
        this.bird.visible =false;
        this.addChild(this.bird,5);

        //把清除所用的如偏加入场景
        this.xiaochu = new cc.Sprite(res.xiaochu);
        this.xiaochu.x = this.width / 2;
        this.xiaochu.y = this.height / 2;
        this.xiaochu.visible = false;
        this.addChild(this.xiaochu);
    },
    click:function(bool){                                 //添一个点击事件
        if (bool){
            return;
        }
        var that = this;
        var listener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowtouches:true,
            onTouchBegan:function(touch,event){
                var pos = touch.getLocation();
                pos = that.convertToNodeSpace(pos);
                var rect = cc.rect(0,0,that.width,that.height);
                if(cc.rectContainsPoint(rect,pos)){
                    cc.log('1111');
                    //发送自定义事件
                    cc.eventManager.dispatchCustomEvent('天王盖地虎',that)
                }
            }
        })
        cc.eventManager.addListener(listener,that);
        setTimeout(function () {
            that.isrun =false;
        },270)
    },

    //创建动画
    createAnimation:function(type,state){
        //待改动
        var aniFrames = [];
        for(var i = 0; i < 40; i++){
            if(state){
                if(state == 'bird'){
                    var fileName = state +'_effect00' + (i < 10 ? '0' + i : i);
                    this.bird.vasible = true;

                }else{

                    var fileName = type + '_'+state +'_' + (i < 10 ? '0' + i : i) + '.png'
                }
            }else {
                var fileName = type + '_click_' + (i < 10 ? '0' + i : i) + '.png'
            }
            var frame = cc.spriteFrameCache.getSpriteFrame(fileName);
            if(frame){
                aniFrames.push(frame);
            }
        }
        var animation = new cc.Animation(aniFrames,0.02);
        return new cc.Animate(animation);
    },



    //播放 / 停止动画
    playAni:function(animation,bool){
        //设置为循环播放
        //改动
        if(bool){
            var action = cc.repeatForever(animation)
            if(this.sx_skill){
                action.setTag(111);
            }else{
                action.setTag(123);
            }
            this.sprite.runAction(action);
        }else{
            //停止播放动画
            this.sprite.stopActionByTag(123);
            //还原皮肤
            this.setSkin(this.index);
        }

    },

    //设置动物皮肤
    setSkin:function(index){
        this.animate = this.createAnimation(this.typeList[this.index - 1]);
        this.sprite.setSpriteFrame(this.typeList[index - 1] + '_click_01.png');   // setSpriteFrame  =设置一个精灵帧
    },

    //清除动画
    clearAni:function () {
        this.xiaochu.scale = 0.5;
        this.xiaochu.opacity = 255
        this.xiaochu.visible = true;
        var action1 = cc.scaleTo(0.3,1,1);
        var action2 = cc.tintTo(0.3,255,255,120);
        var action3 = cc.fadeOut(0.3);
        var callback = cc.callFunc(this.parent.bullet.bind(this.parent))
        this.xiaochu.runAction(
            cc.sequence(
                cc.spawn(action1,action2),
                action3,
                callback
            )
        )
    }
})