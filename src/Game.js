// var gameLayer = cc.Layer.extend({
//     ctor:function () {
//         this._super();
//         var size = cc.winSize;
//         this.Gap = 5;
//         this.animaList = [];
//         this.cellList = [];       //皮肤数组
//         this.bool = true;
//         this.changeArr= [];
//         this.loadResouce()
//         var backGround = new cc.Sprite(res.backGround);
//         backGround.x = size.width/2;
//         backGround.y = size.height/2;
//         backGround.scaleX = size.width/backGround.width;
//         backGround.scaleY = size.height/backGround.height;
//         this.addChild(backGround);
//         //    添加上方信息栏
//         var info = new cc.Sprite(res.info);
//         info.x = size.width/2;
//         info.scale = 2;
//         info.y = size.height-info.height;
//         this.addChild(info);
//         //添加小方块
//         this.lie = 7,this.line = 7;
//         this.shuijisu = 6 ;
//         this.s = new cc.Sprite(res.gameBackGround).getContentSize();
//         this.rectWid = this.s.width * this.lie+ this.Gap * this.lie-1;   //游戏区域的宽
//         this.rectHei = this.s.height*this.line + this.Gap*this.line-1;
//         var blank = (size.width - this.rectWid) /2
//         this.basePos = cc.p(blank + this.s.width * 0.5,this.Gap * this.lie-1 + this.s.height
//                                 *(this.lie - 0.5 ) + 200 );
//         // cc.log(this.basePos)
//         this.init();
//         this.kuang = new cc.Sprite(res.kuang);
//         this.kuang.visible =false;
//         this.addChild(this.kuang);
//         //上一次点击的事件
//         this.oldCell = null;
//         //接受自定义事件
//         cc.eventManager.addCustomListener('我是一个暗号',this.onClick.bind(this))
//     },
//     onClick:function (event) {
//         // cc.log('222');
//         //获取响应事件的对象
//         var cell = event.getUserData();
//         // cc.log(cell);
//         if(this.oldCell == cell){
//             this.kuang.visible = false;
//             cell.playAni(false);
//             this.oldCell = null;
//         }else{
//             this.kuang.visible = true;
//             this.kuang.setPosition(cell.getPosition());
//             cell.playAni(true);
//             if(this.oldCell){
//                 this.oldCell.playAni(false);
//                 //获取两个方块的下标
//                 var p1 = this.getIndex(cell);
//                 var p2 = this.getIndex(this.oldCell);
//                 //判断两个方块是否相邻
//                 if(this.isNeighbor(p1,p2)){
//                     //判断这两个方块交换了后是否形成了三消
//                     var tempArr = this.exchange(p1,p2,false);
//                     cell.playAni(false);
//                     //判断交换后储存可消除方块位置的数组长度
//                     if(tempArr.length){
//                         this.exchange(p1,p2,true);
//                         //播放交换的动画
//                         this.exchangeAnimation(cell,this.oldCell,true);
//                     }else{
//                         this.exchangeAnimation(cell,this.oldCell,false)
//                     }
//                     this.oldCell = null;
//                     this.kuang.visible = false;
//                 }else{//不相邻的情况
//                     this.oldCell = cell;
//                 }
//             }else{//oldCell为空
//                 this.oldCell = cell;
//             }
//         }
//     },
//     init:function () {
//         for ( var i = 0; i < this.lie ;i++){
//             this.animaList[i] = [];
//             this.cellList[i] = [];
//             for(var j = 0; j < this.line ; j++){
//                 var gamebackground  =  new cc.Sprite(res.gameBackGround)
//                 gamebackground.setPosition(this.basePos.x + j * (this.s.width + this.Gap),this.basePos.y
//                     - i * (this.s.height +this.Gap));
//                 this.addChild(gamebackground);
//                 var ran = (Math.random()*(this.shuijisu))+1 | 0 ;
//                 // var animal = new cc.Sprite(res['icon1_'+ran]);
//                 // animal.setPosition(gamebackground.getPosition());
//                 this.animaList[i][j] = ran;
//                 // this.addChild(animal)
//                 var animal = new Animal(this.animaList[i][j]);
//                 animal.setPosition(this.basePos.x + j * (this.s.width + this.Gap),this.basePos.y
//                     - i * (this.s.height +this.Gap));
//                 this.addChild(animal);
//                 this.cellList[i][j] = animal;
//             }
//         }
//         this.create();
//         this.show();
//
//     },
//
//     create:function () {
//         if(this.find3( this.animaList).length >0){
//             var arr = this.find3(this.animaList)         //保存可以消除的数组
//             for( var i = 0 ; i<arr.length; i++){
//                 this.animaList[arr[i][0]][arr[i][1]] =  (Math.random()*(this.shuijisu)+1) | 0
//             }
//             this.create();
//     }
//         if(this.die()){
//             for(var i = 0;i <this.lie;i++){
//                 for (var j = 0 ; j <this.line ; j++){
//                     // cc.log(123456)
//                     this.animaList[i][j] = (Math.random()*(this.shuijisu)+1) | 0
//                 }
//             }
//             this.create();
//         }
//     },
//     // 判断死局
//     die:function () {
//         var dir = [[1,0],[0,1]]
//         for (var i= 0; i< this.animaList.length; i++){                              //前两次循环 遍历用
//             for ( var j = 0; j< this.animaList[i].length; j++){
//                 for (var k =0 ;k< dir.length ;k++){                                    // 向下和向右交换用
//                     if (i+dir[k][0] <this.lie && j + dir[k][1] < this.line){            //判断越界
//                         var target =   [i+dir[k][0],j+dir[k][1]]  ;                              //目标方块
//                         if(this.exchange([i,j],target,false).length ){
//                             return false;
//                         }
//                     }
//                 }
//             }
//         }
//
//         return true;
//     },
//     // 交换方块
//     exchange:function (index1,index2,boolean) {
//           var temp = boolean ? this.animaList : arrayClone2x2(this.animaList);
//           var temp1 = temp[index1[0]][index1[1]];
//           temp[index1[0]][index1[1]] = temp[index2[0]][index2[1]];
//           temp[index2[0]][index2[1]] =temp1;
//           //改变储存方块的数组
//         if(boolean){
//            var tempcell =  this.cellList[index1[0]][index1[1]]
//             this.cellList[index1[0]][index1[1]] =this.cellList[index2[0]][index2[1]];
//             this.cellList[index2[0]][index2[1]] = tempcell;
//         }
//
//
//           var arr = this.find3(temp);
//           return arr;
//     },
//     // 刷新显示
//     show:function () {
//         for ( var i = 0; i < this.lie ;i++){
//             for(var j = 0; j < this.line ; j++){
//                 // cc.log(this.animaList[i][j])
//                 this.cellList[i][j].setSkin(this.animaList[i][j])
//             }
//         }
//     },
//
//     //    交换完后播放交换的动画
//     exchangeAnimation:function (cell1,cell2,bool) {
//         var p1 = cell1.getPosition();
//         var p2 = cell2.getPosition();
//         var action1 = cc.moveTo(0.3,p2);
//         var action3 = action1.clone();
//         var action2 = cc.moveTo(0.3,p1);
//         var action4 = action2.clone();
//         var  callback = cc.callFunc(this.clean3.bind(this))
//         if(bool){
//             cell1.runAction(
//                 cc.sequence(
//                     action1,
//                     callback
//                 )
//             );
//             cell2.runAction(
//                 cc.sequence(
//                     action2,
//                     callback
//                 )
//             );
//         }else{
//             cell1.runAction(
//                 cc.sequence(
//                     action1,
//                     action4
//                 )
//             );
//             cell2.runAction(
//                 cc.sequence(
//                     action2,
//                     action3
//                 )
//             );
//         }
//         this.waitClear = [];
//     },
//     clean3:function () {
//         for(var i = 0; i < this.waitClear.length;i++){
//             this.cellList[this.waitClear[i][0]][this.waitClear[i][1]].sprite.visible = false;
//             this.cellList[this.waitClear[i][0]][this.waitClear[i][1]].clearAni();
//         }
//         this.waitClear = [];
//     },
//    // 判断2个方块相邻
//     isNeighbor:function (index1,index2) {
//         return  (Math.abs(index1[0] -index2[0])+Math.abs(index1[1]-index2[1])) === 1 ;
//     },
//    // 获取下标
//     getIndex:function (cell) {
//         for (var i = 0; i< this.cellList.length ;i++){
//             for (var j = 0; j < this.cellList[i].length;j++){
//                 if (this.cellList[i][j] === cell){
//                     return [i,j]
//                 }
//             }
//         }
//     },
//    // 寻找三消
//     find3:function (arr) {
//         var delArr = [];
//         for (var i = 0 ;i < this.lie ; i++){
//             for (var j = 0; j <this.line ;j++){
//                 if(i + 2 < this.lie && arr[i][j] === arr[i+1][j] && arr[i][j] === arr[i+2][j]){
//                     delArr.push([i,j],[i+1,j],[i+2,j]);
//                 }
//                 if ( j + 2 < this.line && arr[i][j] === arr[i][j+1] && arr[i][j]  === arr[i][j+2]){
//                     delArr.push([i,j],[i,j+1],[i,j+2]);
//                 }
//             }
//         }
//         this.unRepeat(delArr);
//         this.waitClear = delArr;
//         return delArr;
//     },
//     //去重
//     unRepeat:function (arr) {
//     var obj = {};
//     for (var i = 0 ; i <arr.length ; i++){
//         if(obj.hasOwnProperty(arr[i]+'')){
//             arr.splice(i,1);
//             i--;
//         }else{
//             obj[arr[i]+''] = 0;
//         }
//     }
// },
//     rerfesh:function () {
//         for (var i = 0 ;i < this.lie ; i++){
//             for (var j = 0; j <this.line ;j++){
//                 var pos = this.basePos.x +j*(this.s.width +this.Gap,this.basePos.y+(this.height+this.Gap)*i)
//                 if(this.cellList[i][j].needDrop){
//                     var action1 = cc.moveTo(0.3,pos);
//                     var  action2 = cc.rotateBy(0.3,360);
//                     tihs.cellList[i][j].runAction(
//                         cc.spawn(
//                             action1,
//                             action2
//                         )
//                     )
//                 }
//             }
//         }
//     },
// //    加载图形资源
//     loadResouce:function () {
//         var framCache = cc.spriteFrameCache;
//         framCache.addSpriteFrames(res.bear_plist,res.bear_png);
//         framCache.addSpriteFrames(res.bird_plist,res.bird_png);
//         framCache.addSpriteFrames(res.cat_plist,res.cat_png);
//         framCache.addSpriteFrames(res.chicken_plist,res.chicken_png);
//         framCache.addSpriteFrames(res.fox_plist,res.fox_png);
//         framCache.addSpriteFrames(res.frog_plist,res.frog_png);
//         framCache.addSpriteFrames(res.horse_plist,res.horse_png);
//     }
// })
// var gameScene = cc.Scene.extend({
//     onEnter:function () {
//         this._super();
//         var layer = new gameLayer();
//         this.addChild(layer)
//     }
// })