$(function () {
    //1.监听游戏规则事件点击
    $(".rules").click(function () {
        $(".rule").stop().fadeIn(100);
    });
    //2.监听游戏规则关闭事件点击
    $(".close").click(function () {
        $(".rule").stop().fadeOut(100);
    });
    //3.监听开始游戏事件点击
    $(".start").click(function () {
        //开始游戏按钮消失
        $(this).stop().fadeOut(100);
        //执行进度条方法
        progressHandler();
        //执行灰太狼动画
        startWolfAnimation();
    });
    //4.监听重新开始游戏事件点击
    $(".reStart").click(function () {
        //重新开始界面消失
        $(".mask").stop().fadeOut();
        //重新执行进度条方法
        progressHandler();
        //重新执行灰太狼动画效果
        startWolfAnimation();
        //重新开始的时候分数要归零
        $(".score").text(0);
    });
    //定义一个专门处理进度条的方法
    function progressHandler() {
        $(".progress").css({
            width:180
        })
 
        //开启定时器，进度条长度逐渐减短
        var timer=setInterval(function () {
            /*
            （1）.当这个进度条的长度放在定时器里面的时候，下面有个进度条的长度随分数变化的代码，要写成如下所示的那个样子，
            （2）若进度条的长度放在定时器外面，即window.$progressWidth，那么下面的代码只需写成
                if(flag){window.$progressWidth+=10}else{window.$progressWidth-=10}即可。
            因为（1）情况下，是先开启了定时器，然后再拿到定时器的长度，即定时器的长度是不断更新的。如果下面的代码不变，
            而将var $progressWidth=$(".progress").width();放在定时器上面的话，就是说先拿到定时器的长度，然后开启定时器，
            下面的代码 $(".progress").css({ width: $(".progress").width()+10})是改变定时器的值，而不是$progressWidth
            的值，所以会出现视觉上猛的一增长，但也会瞬间恢复原长的视觉效果，在根本上不起作用。
            * */
            //拿到进度条的长度
            var $progressWidth=$(".progress").width();
            $progressWidth-=1;
            $(".progress").css({
                width:$progressWidth
            })
            //如果进度条的长度小于等于0，那么关闭定时器，并将重新开始界面显示出来,并停止狼的动画效果
            if($progressWidth<=0){
                clearInterval(timer);
                $(".mask").stop().fadeIn(100);
                stopWolfAnimation();
            }
        },100)
    }
    //定义一个专门处理灰太狼动画的方法
    var wolfTimer;
    function startWolfAnimation() {
        //定义两个数组保存所有灰太狼和小灰灰的图片
        var wolf_1=['./images/h0.png','./images/h1.png','./images/h2.png', './images/h3.png','./images/h4.png',
            './images/h5.png','./images/h5.png','./images/h7.png','./images/h8.png','./images/h9.png',]
        var wolf_2=['./images/x0.png','./images/x1.png','./images/x2.png', './images/x3.png','./images/x4.png',
            './images/x5.png','./images/x5.png','./images/x7.png','./images/x8.png','./images/x9.png',]
        //定义一个数组用来保存图片出现的位置
        var arrPos=[
            {left:"100px",top:"115px"},
            {left:"20px",top:"160px"},
            {left:"190px",top:"142px"},
            {left:"105px",top:"193px"},
            {left:"19px",top:"221px"},
            {left:"202px",top:"212px"},
            {left:"120px",top:"275px"},
            {left:"30px",top:"295px"},
            {left:"209px",top:"297px"}
        ];
 
        /*
       Math.random()是随机生成0-1的数， Math.round()是四舍五入
       扩展：
       parseInt(5.1234) //5 只保留整数部分
       Math.floor(5.1234)//5 向下取整，和parseInt一样
       Math.ceil(5.1234) //6向上取整（有小数，就+1）
       Math.round(5.1234)//四舍五入
       Math.abs(-1)//取绝对值
       Math.max(1,2)//2 返回两者中较大值
       Math.min(1,2)//1 返回两者中较小者
       Math.random()//随机生成0-1的数
       */
        //生成随机位置
        var wolfPosIndex=Math.round(Math.random()*8);
        $wolfImage=$("<image src='' class='wolfImage'>")
        $wolfImage.css({
            position:"absolute",
            left:arrPos[wolfPosIndex].left,
            top:arrPos[wolfPosIndex].top
        })
        //随机获取狼的类型
        var wolfType=Math.round(Math.random())==0?wolf_1:wolf_2
        //实现灰太狼和小灰灰的动画效果
        /*
        此处将两个索引定义为在内部的全局变量，是为了再点击狼后，无论何时，这个狼逐渐出现的动画就要停止，而改为拍打的动画
         */
        window.wolfStartIndex=0;
        window.wolfEndIndex=5;
        wolfTimer=setInterval(function () {
            if(wolfStartIndex<wolfEndIndex) {
                $wolfImage.attr("src",wolfType[wolfStartIndex])
                wolfStartIndex++;
            }
            else {
                $wolfImage.remove();
                /*这个定时器记得一定要关，否则不关闭这个定时器而在调用startWolfAnimation方法时，就会有多个定时器
                同时打开，就会出现万狼出洞的效果
                * */
                 clearInterval(wolfTimer);
                startWolfAnimation();
            }
 
        },200)
        $(".container").append($wolfImage)
        gameRules($wolfImage);
    }
    //定义一个专门处理游戏规则的方法
    function gameRules($wolfImage) {
        $wolfImage.one("click",function () {
            //点击，改变索引，即停止当前动画，改为拍打动画
            window.wolfStartIndex=5;
            window.wolfEndIndex=9;
            //获取图片的地址
            var $src=$(this).attr("src");
            //    根据图片判断是否是灰太狼
            var flag=$src.indexOf("h")>-1;
            if (flag){
                //如果是灰太狼，那么分数+10，并且进度条的长度就+10
                $(".score").text(parseInt( $(".score").text())+10);
                $(".progress").css({
                    width: $(".progress").width()+10
                })
            }
            else {
                //如果是小灰灰，那么分数-10，并且进度条的长度-10
                $(".score").text(parseInt( $(".score").text())-10);
                $(".progress").css({
                    width: $(".progress").width()-10
                })
            }
        })
    }
    //定义一个灰太狼动画结束的方法
    function stopWolfAnimation() {
        /*
        在停止动画的时候，首先要把最后的图片给移除了，如何得到这个图片呢？方法有三
        1.将这个图片在外部定义为全局变量 即var $wolfImage
        2.将这个图片在内部定义为全局变量 即window.$wolfImage
        3.在创建这个图片的时候给这个图片加个class
        */
        $(".wolfImage").remove();
        /*
        停止动画的时候也要关闭定时器，不然狼的动画效果会持续进行，获取这个wolfTimer方法有二
        1.在外部定义全局变量 即var wolfTimer
        2.在内部定义全局变量 即window.wolfTimer
        */
        clearInterval(wolfTimer);
    }
})
