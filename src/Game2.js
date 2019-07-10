var gameLayer = cc.Layer.extend({
    //在对象创建时执行
    ctor:function(){
        this._super();
        var size = cc.winSize;
        this.Gap = 5;
        this.loadResouce();
        //皮肤数组和方块数组
        this.animalList = [];
        this.animalCellList = [];
        this.row = 8;
        this.line = 8;
        //添加背景，并且给背景做适配
        var backGround = new cc.Sprite(res.backGround);
        backGround.x = size.width / 2;
        backGround.y = size.height / 2;
        //背景的适配
        backGround.scaleX = size.width / backGround.width;
        backGround.scaleY = size.height / backGround.height;
        cc.log(backGround._texture.url);
        this.addChild(backGround);

        //添加信息栏
        var info = new cc.Sprite(res.info);
        info.x = size.width / 2;
        info.y = size.height - info.height;
        info.scale = 2;
        this.addChild(info);

        this.s = new cc.Sprite(res.gameBackGround).getContentSize();    //获取小冰块的尺寸
        //计算游戏区域的宽
        this.rectWid = this.s.width * this.line + this.Gap *(this.line - 1);
        var blank = (size.width - this.rectWid) / 2;                   //游戏区域两边预留的宽度
        this.basePos = cc.p(blank + this.s.width * 0.5,this.Gap * (this.row - 1) + this.s.height * (this.row - 0.5) + 200)
        // this.basePos 游戏的基准点
        this.init();
        //框
        this.kuang = new cc.Sprite(res.kuang);
        this.kuang.visible = false;
        this.addChild(this.kuang);
        //上一次点击的方块
        this.oldCell = null;
        //接收自定义事件
        cc.eventManager.addCustomListener('天王盖地虎',this.isOnClick.bind(this));
    },

    isOnClick:function(event){
        // cc.log('222');
        //获取响应事件的对象
        var cell = event.getUserData();
        // cc.log(cell);
        if(this.oldCell == cell){
            this.kuang.visible = false;
            cell.playAni(cell.animate,false);
            this.oldCell = null;
        }else{
            this.kuang.setPosition(cell.getPosition());
            this.kuang.visible = true;
            if(!cell.skill){
                cell.playAni(cell.animate, true);
            }
            if(this.oldCell){                 //判断oldcell是否为空
                this.oldCell.playAni(cell.animate,false);
                this.islock = true ;
                //获取两个方块的下标
                var p1 = this.getIndex(cell);
                var p2 = this.getIndex(this.oldCell);
                //判断两个方块是否相邻
                if(this.isNeighbor(p1,p2)){
                    //判断这两个方块交换了后是否形成了三消
                    var tempArr = this.exchange(p1,p2,false);
                    cell.playAni(cell.animate,false);
                    //判断交换后储存可消除方块位置的数组长度
                    if(tempArr.length){
                        this.exchange(p1,p2,true);
                        //播放交换的动画
                        this.addSkill(p1);
                        this.addSkill(p2);
                        this.exchangeAnimation(cell,this.oldCell,true);
                    }else{
                        this.exchangeAnimation(cell,this.oldCell,false)
                    }
                    this.oldCell = null;
                    this.kuang.visible = false;
                }else{//不相邻的情况
                    this.oldCell = cell;
                }
            }else{//oldCell为空  执行下面的逻辑
                this.oldCell = cell;
            }
        }
    },
    //技能方块
    addSkill:function (index) {
        var count = 1;
        for(var i = index[0] + 1; i < this.row; i++){
            if(this.animalList[index[0]][index[1]] === this.animalList[i][index[1]]){
                count++;
            }else{
                break;
            }
        }
        for(var i = index[0] - 1; i >= 0; i--){
            if(this.animalList[index[0]][index[1]] === this.animalList[i][index[1]]){
                count++;
            }else{
                break;
            }
        }
        if(count == 4){
            this.animalCellList[index[0]][index[1]].skill = 'line';
            this.animalCellList[index[0]][index[1]].sx_skill =  'line';
        }else if(count == 5){
            this.animalCellList[index[0]][index[1]].skill = 'bird';
            this.animalCellList[index[0]][index[1]].sx_skill =  'bird';
        }
        //判断横向是否能形成技能方块
        count = 1;
        for(var i = index[1] + 1; i < this.line; i++){
            if(this.animalList[index[0]][index[1]] === this.animalList[index[0]][i]){
                count++;
            }else{
                break;
            }
        }
        for(var i = index[1] - 1; i >= 0; i--){
            if(this.animalList[index[0]][index[1]] === this.animalList[index[0]][i]){
                count++;
            }else{
                break;
            }
        }
        if(count == 4){
            this.animalCellList[index[0]][index[1]].skill = 'column';
            this.animalCellList[index[0]][index[1]].sx_skill =  'column';
        }else if(count == 5){
            this.animalCellList[index[0]][index[1]].skill = 'bird';
            this.animalCellList[index[0]][index[1]].sx_skill =  'bird';
        }
        count = 1;
    },


    //交换动画
    exchangeAnimation:function(cell1,cell2,bool){
        var p1 = cell1.getPosition();
        var p2 = cell2.getPosition();
        var action1 = cc.moveTo(0.3,p2);
        var action3 = action1.clone();
        var action2 = cc.moveTo(0.3,p1);
        var action4 = action2.clone();
        var  callback = cc.callFunc(this.clean3.bind(this));

        if(bool){
            cell1.runAction(
                cc.sequence(
                    action1,
                    callback
                )
            );
            cell2.runAction(
                cc.sequence(
                    action2,
                    callback
                )
            );
        }else{
            cell1.runAction(
                cc.sequence(
                    action1,
                    action4
                )
            );
            cell2.runAction(
                cc.sequence(
                    action2,
                    action3
                )
            );
        }
    },

    //清除三消
    clean3:function () {
        for(var i = 0; i < this.waitClear.length;i++){
            var cell = this.animalCellList[this.waitClear[i][0]][this.waitClear[i][1]];
            if(cell.skill ){
              var animetion =   cell.createAnimation(cell.typeList[cell.index - 1],cell.skill);
                cell.playAni(animetion,false);
                cell.skill = null ;
            }else{
                if(cell.sx_skill){
                    this.useskill(cell.sx_skill,this.waitClear[i]);
                    this.deduplication(this.waitClear);
                    cell.sprite.stopActionByTag(111);
                    cell.sx_skill = null;
                }
                cell.sprite.visible = false;         //方块的动物头像设置为不可见
                cell.clearAni();
                //清除之后的皮肤变为-1；
                this.animalList[this.waitClear[i][0]][this.waitClear[i][1]] = -1;
            }
        }
        this.waitClear = [];
    },
    useskill:function (skill,index) {
        if(skill == 'line'){          //技能行杀
            for( var i = 0 ;i <this.line ;i++){
                this.waitClear.push([index[0],i]);
            }
        }else  if(skill == 'column'){
            for( var i = 0 ;i <this.row ;i++){
                this.waitClear.push([i,index[1]]);
            }
        }
    },

    //获取对应方块的下标
    getIndex:function (cell) {
        for(var i = 0; i < this.animalCellList.length; i++){
            for(var j = 0; j < this.animalCellList[i].length;j++){
                if(this.animalCellList[i][j] === cell){
                    return [i,j];
                }
            }
        }
    },

    //判断两个方块是否相邻
    isNeighbor:function(index1,index2){
        return (Math.abs(index1[0] - index2[0]) + Math.abs(index1[1] - index2[1])) === 1;
    },

    init:function(){
        //添加小方块
        for(var i = 0; i < this.line; i++){
            this.animalList[i] = [];
            this.animalCellList[i] = [];                                    //皮肤节点
            for(var j = 0; j < this.row; j++){
                // 创建小冰块精灵
                var cell = new cc.Sprite(res.gameBackGround);
                cell.setPosition(this.basePos.x + j * (this.s.width + this.Gap),this.basePos.y - i * (this.s.height + this.Gap));
                // cc.log(cell.getPosition());
                this.addChild(cell,0);
                //-------------------------------------------------------------------------
                var ran = (1 + (Math.random() * 6)) | 0;
                this.animalList[i][j] = ran;
                var animal1 = new oneAnimal(this.animalList[i][j]);
                animal1.setPosition(this.basePos.x + j * (this.s.width + this.Gap),this.basePos.y - i * (this.s.height + this.Gap));
                // cc.log(cell.getPosition());
                this.addChild(animal1,5);
                this.animalCellList[i][j] = animal1;
            }
        }
        this.create();
        this.show();
    },

    //创建一个既没有三消也不是死局的开局
    create:function(){
        if(this.find3(this.animalList).length > 0){
            //保存返回的可以消除的数组
            var arr = this.find3(this.animalList);
            for(var i = 0; i < arr.length;i++){
                this.animalList[arr[i][0]][arr[i][1]] = (1 + (Math.random() * 6)) | 0;
                this.animalCellList[arr[i][0]][arr[i][1]].index = this.animalList[arr[i][0]][arr[i][1]]
            }
            this.create();
        }
        if(this.isGameOver()){
            // cc.log('死球了');
            for(var i = 0; i < this.row; i++){
                for(var j = 0; j < this.line; j++){
                    this.animalList[i][j] = (1 + (Math.random() * 6)) | 0;
                    this.animalCellList[i][j].index = this.animalList[arr[i][0]][arr[i][1]]
                }
            }
            this.create();
        }
    },
    //寻找三消
    find3:function(arr){
        var temp = [];
        for(var i = 0; i < this.row;i++){
            for(var j = 0; j < this.line; j++){
                if(i + 2 < this.row && arr[i][j] === arr[i+1][j] && arr[i][j] === arr[i + 2][j]){
                    temp.push([i,j],[i + 1,j],[i + 2,j]);
                }
                if(j + 2 < this.line && arr[i][j] === arr[i][j+1] && arr[i][j] === arr[i][j + 2]){
                    temp.push([i,j],[i,j + 1],[i, j + 2]);
                }
            }
        }
        this.deduplication(temp);
        this.waitClear = temp;
        return temp;
    },

    //判断死局
    isGameOver:function(){
        //定义交换的方向
        var dir = [[1,0],[0,1]]
        //前两次for循环遍历用
        for(var i = 0; i < this.animalList.length; i++){
            for(var j = 0; j < this.animalList[i].length; j++){
                //向下和向右交换用
                for(var k = 0; k < dir.length; k++){
                    //判断是否越界了
                    if(i + dir[k][0] < this.row && j + dir[k][1] < this.line){
                        //目标方块
                        var target = [i + dir[k][0],j + dir[k][1]]
                        if((this.exchange([i,j],target,false)).length){
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    },

    //交换方块
    exchange:function(index1,index2,bool){
        //根据bool来判断使用原始数组还是克隆的数组
        var temp = bool ? this.animalList : arrayClone2x2(this.animalList);
        var temp1 = temp[index1[0]][index1[1]];
        temp[index1[0]][index1[1]] = temp[index2[0]][index2[1]];
        temp[index2[0]][index2[1]] = temp1;

        //改变储存方块的数组
        if(bool){
            var tempcell = this.animalCellList[index1[0]][index1[1]]
            this.animalCellList[index1[0]][index1[1]] = this.animalCellList[index2[0]][index2[1]]
            this.animalCellList[index2[0]][index2[1]] = tempcell
        }
        var arr = this.find3(temp);
        return arr;
    },


    //刷新显示
    show:function(){
        for(var i = 0; i < this.row; i++){
            for(var j = 0; j < this.line; j++){
                this.animalCellList[i][j].setSkin(this.animalList[i][j])
            }
        }
    },
    //刷新出新方块以及方块的下落
    refresh:function(){
        //当动画播放完毕后出发的连输反应
        var callback = cc.callFunc(function () {
            this.islock = true ;
            this.find3(this.animalList);
            this.clean3();
        }.bind(this))
        for(var i = 0; i < this.row; i++){
            for(var j = 0; j < this.line; j++){
                var pos = cc.p(this.basePos.x + j * (this.s.width + this.Gap),this.basePos.y - i * (this.s.height + this.Gap))
                //判断当前方块是否需要下降
                if(this.animalCellList[i][j].needDrop){
                    if(this.animalList[i][j] === -1){//空白快
                        //空白块设置为可见
                        this.animalCellList[i][j].sprite.visible = true;
                        this.animalList[i][j] = (1 + Math.random() * 6) | 0;
                        this.animalCellList[i][j].index = this.animalList[i][j];
                        this.animalCellList[i][j].setSkin(this.animalList[i][j]);
                    }else{
                        //不是空白块的情况
                        this.animalCellList[i][j].needDrop = false;
                        var action1 = cc.moveTo(0.3,pos);
                        var action2 = cc.rotateBy(0.3,360);
                        this.animalCellList[i][j].runAction(
                           cc.sequence(
                               cc.spawn(action1,action2),
                               callback
                           )
                        )
                    }
                }
            }
        }
    },

    //去重
    deduplication:function(arr){
        var obj = {};
        for(var i = 0; i < arr.length; i++){
            if(obj.hasOwnProperty(arr[i] + '')){        //判断对象中是否存在某个属性
                arr.splice(i,1);
                i--;
            }else{
                obj[arr[i] + ''] = 0;
            }
        }
    },

    //空白冒泡
    bullet:function () {
        //上面两层循环用来遍历
        for(var j = 0; j < this.line; j++){
            for(var i = this.row - 1; i >= 0; i--){
                var count = 0;
                //只有不是空白块才需要下落
                if(this.animalList[i][j] !== -1){
                    //寻找当前方块下面的空白块
                    for(var k =  i + 1; k < this.row; k++){
                        if(this.animalList[k][j] === -1){
                            count++;
                        }
                    }
                    if(count != 0){
                        this.animalCellList[i][j].needDrop = true;
                        this.exchange([i,j],[i + count,j],true);
                    }
                }else{
                    this.animalCellList[i][j].needDrop = true;
                    this.animalCellList[i][j].y = this.animalCellList[0][j].y + (this.s.height + this.Gap) * 3
                }
            }
        }
        this.refresh();
    },

    //加载图集资源
    loadResouce:function(){
        var frameCache = cc.spriteFrameCache;                        //精灵帧缓存
        frameCache.addSpriteFrames(res.bear_plist,res.bear_png);        //将图片添加至精灵帧缓存中
        frameCache.addSpriteFrames(res.bird_plist,res.bird_png);
        frameCache.addSpriteFrames(res.cat_plist,res.cat_png);
        frameCache.addSpriteFrames(res.chicken_plist,res.chicken_png);
        frameCache.addSpriteFrames(res.fox_plist,res.fox_png);
        frameCache.addSpriteFrames(res.frog_plist,res.frog_png);
        frameCache.addSpriteFrames(res.horse_plist,res.horse_png);
    }
})

var gameScene = cc.Scene.extend({
    //节点被加载，完成渲染时运行
    onEnter:function(){
        this._super();
        var layer = new gameLayer();
        this.addChild(layer)
    }

})
// onEnter 、进入 onExit . 退出   onTransitionDidFinish  声明周期函数
//显示 数据