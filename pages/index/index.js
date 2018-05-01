//scale.js
Page({
  data: {
    text: "Page canvas",
    name: 'buttonSound',
    width: 0,
    height: 0,
    arr:[],
    box:[],
    cc:[],
    preview: 0,
    current: 0,
    move: 0,
    speed: 1,
    line: 0,
    p: 10,
    st: 1000,
    a: 0,
    over: 0,
    pass: 0,
    sleep: 1000,
    interval:null,
    b:0,
    d:0,
    settime: null,
    innerAudioContext: null,
    backGroundSound:null,
    psTxt:"■",
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //获取系统信息  
    var that = this;
    that.innerAudioContext=wx.createInnerAudioContext();
    that.innerAudioContext.src = 'pages/index/bullet.mp3';
    that.backGroundSound=wx.createInnerAudioContext();
    that.backGroundSound.src = 'pages/index/bg.mp3';
    that.backGroundSound.autoplay=true;
    that.backGroundSound.loop = true;

    wx.getSystemInfo({
      //获取系统信息成功，将系统窗口的宽高赋给页面的宽高  
      success: function (res) {
        that.width = res.windowWidth
        // console.log(that.width)   375
        that.height = res.windowHeight
        // console.log(that.height)  625
        // 这里的单位是PX，实际的手机屏幕有一个Dpr，这里选择iphone，默认Dpr是2
      }
    })
  },
  onReady: function () {
   
    var arr_Ready = new Array(20);   //表格有20行  
    for (var i = 0; i < 20; i++) {
      arr_Ready[i] = new Array(10);    //每行有10列  
    }  
    for (var i = 0; i < 20; i++)
      for (var j = 0; j < 10; j++) {
        arr_Ready[i][j] = 0;
      }  

    var CC = new Array(4);
    for (var i = 0; i < 4; i++) {
      CC[i] = new Array(2);    //每行有4列  
    }
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 2; j++) {
        CC[i][j] = 0;
      }  

    this.arr = arr_Ready;
    this.cc=CC;
    this.move =0;
    this.st =1000;
    this.sleep =1000;
    this.pass =0;
    this.over =0;
    this.line =0;
    this.p=0;
    this.a=0;
    this.b = 0;
    this.speed =1;
    this.d=0;

    this.generateBlock();
    this.drawGameArea();
    // 每1000ms执行一次drawClock()，人眼看来就是流畅的画面
    this.interval = setInterval(this.play, this.sleep);
    // while(this.over==0){
    //   setTimeout(function () {
    //     this.a = 0;
    //     this.drawGameArea();

    //   }, this.sleep); //延迟时间 这里是1秒  
    // }
  },
  play: function (){
    if(this.b==0){
      this.a=0;

      if(this.d==1){
        this.innerAudioContext.stop();
        this.innerAudioContext.play();
      }

      this.drawGameArea();
    }
  },
  generateBlock: function(){

    var block = new Array(2);
    for (var i = 0; i < 2; i++) {
      block[i] = new Array(4);    //每行有4列  
    }  

    for (var i = 0; i < 2; i++)
      for (var j = 0; j < 4; j++) {
        block[i][j] = 0;
      }  
    
  //  var preView = Math.round(Math.random() * 6)+1;
    var preView = parseInt(Math.random() * 7) + 1;
    this.preview = preView;

    if (preView == 1) {
      block[0][0] = 2;
      block[0][1] = 2;
      block[0][2] = 2;
      block[0][3] = 2;
    }
    else if (preView == 2) {
      block[0][0] = 2;
      block[0][1] = 2;
      block[0][2] = 2;
      block[1][0] = 2;
    }
    else if (preView == 3) {
      block[0][0] = 2;
      block[0][1] = 2;
      block[0][2] = 2;
      block[1][2] = 2;
    }
    else if (preView == 4) {
      block[0][0] = 2;
      block[0][1] = 2;
      block[1][0] = 2;
      block[1][1] = 2;
    }
    else if (preView == 5) {
      block[0][0] = 2;
      block[0][1] = 2;
      block[0][2] = 2;
      block[1][1] = 2;
    }
    else if (preView == 6) {
      block[0][0] = 2;
      block[0][1] = 2;
      block[1][1] = 2;
      block[1][2] = 2;
    }
    else if (preView == 7) {
      block[0][1] = 2;
      block[0][2] = 2;
      block[1][0] = 2;
      block[1][1] = 2;
    }

    this.box = block;

  },

  drawGameArea: function () {
    // 游戏逻辑
    var that = this;
    const ctx = wx.createCanvasContext('tetris');
    var arr = this.arr;
    var block = this.box;
    var move = this.move;
    var Current = this.preview * 10;
   // var p=this.p;
    var Line = this.line;
    var speed = this.speed;
    var sleep = this.sleep;
    var a = this.a;
    var st = this.st;
    var over =this.over;
    var CC=this.cc;

    if(move==1&&a==0)
      for (var i= 0; i < 4;i++){
        if (CC[i][0] == 19 ||(CC[i][0] + 1>=0&& arr[CC[i][0] + 1][CC[i][1]]==1)){
          for (var j= 0; j < 4;j++)
            arr[CC[j][0]][CC[j][1]] = 1;
          sleep = st;
          move = 0;
          a = 0;
          clearInterval(this.interval);
          this.sleep = this.st;
          this.interval = setInterval(this.play, this.sleep);
          break;
        }
      }
    for (var j = 0; j < 10; j++)
      if (arr[0][j] == 1){
        over = 1;break;
      }
    if(over==1){
      this.b=1;

      wx.showModal({
        title: 'Game Over',
        content: '是否重写开始？',
        success: function (res) {
          if (res.confirm) {
            wx.reLaunch({
              url: '../index/index',
            });
          } else {

            wx.navigateBack({
              delta: -1
            });
          }
        }
      });
    }

    check();
    this.line=Line;

    if (Line > this.p) {
      this.speed = parseInt(Line / 10 + 1);
      this.st = Math.round(1000 * Math.pow(0.85, this.speed));
      this.p = this.p + 10;
    }

    if(move == 0) {
      generateCC();
      this.current = this.preview * 10;
      Current = this.current;  
      this.generateBlock();
      block= this.box;
      this.move=1;
      
    }
    if (a == 0) {
      this.cc[0][0]++;
      this.cc[1][0]++;
      this.cc[2][0]++;
      this.cc[3][0]++;
      this.a = 1;
    }

    function check() {
      for(var i=1;i<20;i++){
        var clean = true;
        for(var j=0;j<10;j++)
          if(arr[i][j]!=1){
            clean =false;
            break;
          }
        
        if(clean){
          for (var j = 0; j < 10; j++)
            arr[i][j]=0;
          
          for(var m=i-1;m>=0;m--)
            for(var n=0;n<10;n++)
              if(arr[m][n]==1){
                 arr[m+1][n]=1;
                 arr[m][n]=0;
              }
          Line++;
        }
      }
    };

    function generateCC(){
      if (Current / 10 == 1) {
        CC[0][0] = 0;
        CC[0][1] = 3;
        CC[1][0] = 0;
        CC[1][1] = 4;
        CC[2][0] = 0;
        CC[2][1] = 5;
        CC[3][0] = 0;
        CC[3][1] = 6;
      }
      else if (Current / 10 == 2) {
        CC[0][0] = 0;
        CC[0][1] = 3;
        CC[1][0] = 0;
        CC[1][1] = 4;
        CC[2][0] = 0;
        CC[2][1] = 5;
        CC[3][0] = 1;
        CC[3][1] = 3;
      }
      else if (Current / 10 == 3) {
        CC[0][0] = 0;
        CC[0][1] = 3;
        CC[1][0] = 0;
        CC[1][1] = 4;
        CC[2][0] = 0;
        CC[2][1] = 5;
        CC[3][0] = 1;
        CC[3][1] = 5;
      }
      else if (Current / 10 == 4) {
        CC[0][0] = 0;
        CC[0][1] = 4;
        CC[1][0] = 0;
        CC[1][1] = 5;
        CC[2][0] = 1;
        CC[2][1] = 4;
        CC[3][0] = 1;
        CC[3][1] = 5;
      }
      else if (Current / 10 == 5) {
        CC[0][0] = 0;
        CC[0][1] = 3;
        CC[1][0] = 0;
        CC[1][1] = 4;
        CC[2][0] = 0;
        CC[2][1] = 5;
        CC[3][0] = 1;
        CC[3][1] = 4;
      }
      else if (Current / 10 == 6) {
        CC[0][0] = 0;
        CC[0][1] = 3;
        CC[1][0] = 0;
        CC[1][1] = 4;
        CC[2][0] = 1;
        CC[2][1] = 4;
        CC[3][0] = 1;
        CC[3][1] = 5;
      }
      else if (Current / 10 == 7) {
        CC[0][0] = 0;
        CC[0][1] = 4;
        CC[1][0] = 0;
        CC[1][1] = 5;
        CC[2][0] = 1;
        CC[2][1] = 3;
        CC[3][0] = 1;
        CC[3][1] = 4;
      }

      CC[0][0]--;
      CC[1][0]--;
      CC[2][0]--;
      CC[3][0]--;
      move = 1;
    };

    function drawBackground() {
      // 设置线条的粗细，单位px
      ctx.setLineWidth(1);  
      for(var i=3;i<=253;i=i+25){
        ctx.beginPath();
        ctx.moveTo(i,50);
        ctx.lineTo(i,550);
        ctx.stroke();
        ctx.closePath();
      }
      for (var i = 50; i <= 550; i = i + 25) {
        ctx.beginPath();
        ctx.moveTo(3, i);
        ctx.lineTo(253, i);
        ctx.stroke();
        ctx.closePath();
      }
    
      ctx.setFontSize(15); 
      ctx.fillText("  Lines :  ",  5 , 13 );
      ctx.fillText("Speed :  ",  5, 35);
      ctx.fillText(Line.toString(), 80, 13);
      ctx.fillText(speed.toString(), 80, 35);

      ctx.setStrokeStyle('magenta');

      ctx.strokeRect(25 + 3, 25 * 7 + 50, 75, 75);
      ctx.strokeRect(100 + 3, 25 * 7 + 50, 75, 75);
      ctx.strokeRect(175+3, 25 * 7 + 50, 75, 75);
      ctx.strokeRect(100 + 3, 25 * 10 + 50, 75, 75);

      ctx.stroke();
    };

    function drawBox() {
      ctx.setLineWidth(1);
      for (var i = 0; i < 20; i++)
        for(var j = 0; j < 10; j++) 
          if (arr[i][j]== 1){
            ctx.beginPath();
            ctx.rect(4+25*j, 25*i+51, 23, 23);
            ctx.setFillStyle('blue');
            ctx.fill();
            ctx.closePath();
          }      

      for (var i = 0; i < 2; i++)
        for (var j = 0; j < 4; j++){
          if (block[i][j] == 2) {
            ctx.beginPath();        
            ctx.rect(160 + 20 * j, 20 * i - 1, 18, 18);
            ctx.setFillStyle('blue');
            ctx.fill();           
            ctx.closePath();
          }
        }

      for (var i = 0; i < 4; i++)
        if (CC[i][0]>=0){
          ctx.beginPath();
          ctx.rect(4 + 25 * CC[i][1], 25 * CC[i][0] + 51, 23, 23);
          ctx.setFillStyle('blue');
          ctx.fill();
          ctx.closePath();   
      }
    };

    function GameView() {
      // 依次执行各个方法
      drawBackground();
      drawBox();
      // 微信小程序要多个draw才会画出来，所以在最后画出
      ctx.draw();
    };

    GameView();
    
  },
  leftAction: function(){
    this.innerAudioContext.stop();
    this.innerAudioContext.play();
    var mark1 = true;
    for (var j = 0; j < 4; j++)
     // if (this.cc[j][1]>=0)
      if (this.cc[j][1] == 0 || (this.cc[j][0] > 0&&this.arr[this.cc[j][0]][this.cc[j][1] - 1] == 1)) {
        mark1 = false;
        break;
      }
    if (mark1)
      for (var j = 0; j < 4; j++) {
        this.cc[j][1]--;
      }
    this.drawGameArea();
  },
  bleft: function(e){
    this.leftAction();
  },
  rightAction: function () {
    this.innerAudioContext.stop();
    this.innerAudioContext.play();
    var mark1 = true;
    for (var j = 0; j < 4; j++)
      if (this.cc[j][1] == 9 || this.cc[j][0] > 0&&(this.arr[this.cc[j][0]][this.cc[j][1] + 1] == 1)) {
        mark1 = false;
        break;
      }
    if (mark1)
      for (var j = 0; j < 4; j++) {
        this.cc[j][1]++;
      }
    this.drawGameArea();
  },
  bright: function (e) {
    this.rightAction(); 
  },
  touchStart: function (e) {
    this.innerAudioContext.stop();
    this.innerAudioContext.play();
    this.d = 1;
    clearInterval(this.interval);
    this.st=this.sleep;
    this.sleep = 60; this.settime
    this.interval = setInterval(this.play, this.sleep);

  },
  touchEnd: function (e) {
    this.d = 0;
    clearInterval(this.interval); 
    this.sleep = this.st;
    this.interval = setInterval(this.play, this.sleep);

  },
  bpause: function (e) {
    if(this.b==0){
      this.b = 1;
      this.setData({
        psTxt:"▶" 
      });
    }else{
      this.b=0;
      this.setData({
        psTxt: "■"
      });
    }
  },
  canvasTouchstart: function (e) {
    var touchs = e.touches[0]; 
    var x = touchs.x;
    var y = touchs.y;
    // 左上 x=27，102, 177; y=300
    if(x>27&&x<102&&y>225&&y<300){
      this.leftAction();
    }
    if (x > 102 && x < 177 && y > 225 && y < 300) {
      this.changeAction();
    }
    if (x > 177 && x < 252 && y > 225 && y < 300) {
      this.rightAction();
    }
    if (x > 102 && x < 177 && y > 300 && y < 375&&this.d==0) {
      this.innerAudioContext.stop();
      this.innerAudioContext.play();
      this.d=1;
      clearInterval(this.interval);
      this.st = this.sleep;
      this.sleep = 60; 
      this.interval = setInterval(this.play, this.sleep);
    }
  },
  canvasTouchend: function (e) {
    // var touchs = e.touches[0];
    // var x = touchs.x;
    // var y = touchs.y;
    if (this.d==1) {
      this.d = 0;
      clearInterval(this.interval);
      this.sleep = this.st;
      this.interval = setInterval(this.play, this.sleep);    
    }
  },
  // cte: function (e) {
  //   var touchs = e.touches[0];
  //   var x = touchs.pageX;
  //   var y = touchs.pageY;

  // },
  changeAction: function () {
    this.innerAudioContext.stop();
    this.innerAudioContext.play();
    if (parseInt(this.current / 10) == 1) {
      if (this.current % 10 == 0 && this.cc[1][0] >= 0 && this.cc[1][0] < 19) {
        this.cc[0][0] += 1;
        this.cc[0][1] += 1;
        this.cc[2][0] -= 1;
        this.cc[2][1] -= 1;
        this.cc[3][0] -= 2;
        this.cc[3][1] -= 2;
        this.current = 11;
      }
      else if (this.current % 10 == 1 && this.cc[1][1] > 0 && this.cc[1][1] < 8) {
        this.cc[0][0] -= 1;
        this.cc[0][1] -= 1;
        this.cc[2][0] += 1;
        this.cc[2][1] += 1;
        this.cc[3][0] += 2;
        this.cc[3][1] += 2;
        this.current = 10;
      }
      this.drawGameArea();
    }

    if (parseInt(this.current / 10) == 2) {
      if (this.current % 10 == 0 && this.cc[1][0] >= 0 && this.cc[0][0]<19) {
        this.cc[0][0]++;
        this.cc[1][1] -= 1;
        this.cc[2][0] -= 1;
        this.cc[2][1] -= 2;
        this.cc[3][1]++;
        this.current = 21;
      } else if (this.current % 10 == 1 && this.cc[2][1] > 0 && this.cc[2][0]<18) {
        this.cc[0][1]++;
        this.cc[1][0]++;
        this.cc[2][0] += 2;
        this.cc[2][1] -= 1;
        this.cc[3][0] -= 1;
        this.current = 22;
      } else if (this.current % 10 == 2 && this.cc[2][0]<19) {
        this.cc[0][0]--;
        this.cc[1][1] += 1;
        this.cc[2][0] += 1;
        this.cc[2][1] += 2;
        this.cc[3][1]--;
        this.current = 23;
      } else if (this.current % 10 == 3 && this.cc[0][1] < 9 && this.cc[3][0]<19) {
        this.cc[0][1] -= 1;
        this.cc[1][0] -= 1;
        this.cc[2][0] -= 2;
        this.cc[2][1] += 1;
        this.cc[3][0] += 1;
        this.current = 20;
      }
      this.drawGameArea();
    }

    if (parseInt(this.current / 10) == 3) {
      if (this.current % 10 == 0 && this.cc[1][0] < 19 && this.cc[0][0]<18) {
        this.cc[0][0] += 2;
        this.cc[0][1]++;
        this.cc[1][0]++;
        this.cc[2][1] -= 1;
        this.cc[3][0] -= 1;
        this.current = 31;
      } else if (this.current % 10 == 1 && this.cc[3][1] < 9 && this.cc[2][0]<19) {
        this.cc[0][0] -= 1;
        this.cc[0][1] += 2;
        this.cc[1][1] += 1;
        this.cc[2][0] += 1;
        this.cc[3][1] -= 1;
        this.current = 32;
      } else if (this.current % 10 == 2 && this.cc[3][0] >= 0 && this.cc[3][0]<19) {
        this.cc[0][0] -= 2;
        this.cc[0][1] -= 1;
        this.cc[1][0]--;
        this.cc[2][1] += 1;
        this.cc[3][0] += 1;
        this.current = 33;
      } else if (this.current % 10 == 3 && this.cc[3][1] > 0 && this.cc[0][0]<19) {
        this.cc[0][0]++;
        this.cc[0][1] -= 2;
        this.cc[1][1] -= 1;
        this.cc[2][0] -= 1;
        this.cc[3][1] += 1;
        this.current = 30;
      }
      this.drawGameArea();
    }

    if (parseInt(this.current / 10) == 5) {
      if (this.current % 10 == 0 && this.cc[1][0] >= 0) {
        this.cc[0][0] -= 1;
        this.cc[0][1]++;
        this.current = 51;
      } else if (this.current % 10 == 1 && this.cc[1][1] > 0) {
        this.cc[3][0] -= 1;
        this.cc[3][1] -= 1;
        this.current = 52;
      } else if (this.current % 10 == 2 && this.cc[1][0] < 19) {
        this.cc[2][0] += 1;
        this.cc[2][1] -= 1;
        this.current = 53;
      } else if (this.current % 10 == 3 && this.cc[1][1] < 9) {
        this.cc[0][0]++;
        this.cc[0][1] -= 1;
        this.cc[2][0] -= 1;
        this.cc[2][1] += 1;
        this.cc[3][0] += 1;
        this.cc[3][1] += 1;
        this.current = 50;
      }
      this.drawGameArea();
    }

    if (parseInt(this.current / 10) == 6) {
      if (this.current % 10 == 0 && this.cc[0][0] < 18 && this.cc[1][0]<19) {
        this.cc[0][0] += 2;
        this.cc[1][0]++;
        this.cc[1][1] -= 1;
        this.cc[3][0] -= 1;
        this.cc[3][1] -= 1;
        this.current = 61;
      } else if (this.current % 10 == 1 && this.cc[2][1] < 9 && this.cc[3][0]<19) {
        this.cc[0][0] -= 2;
        this.cc[1][0]--;
        this.cc[1][1] += 1;
        this.cc[3][0] += 1;
        this.cc[3][1] += 1;
        this.current = 60;
      }
      this.drawGameArea();
    }

    if (parseInt(this.current / 10) == 7) {
      if (this.current % 10 == 0 && this.cc[2][0] >= 0 && this.cc[2][0] < 19 && this.cc[0][0]<19) {
        this.cc[0][0] += 1;
        this.cc[0][1] -= 1;
        this.cc[1][1] -= 2;
        this.cc[2][0] += 1;
        this.cc[2][1] += 1;
        this.current = 71;
      } else if (this.current % 10 == 1 && this.cc[2][1] < 9) {
        this.cc[0][0] -= 1;
        this.cc[0][1] += 1;
        this.cc[1][1] += 2;
        this.cc[2][0] -= 1;
        this.cc[2][1] -= 1;
        this.current = 70;
      }
      this.drawGameArea();
    }

  },
  bc: function (e) {
    this.changeAction();
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})