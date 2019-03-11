window.onload = function () {
    //获取对象
    var oLeft = document.getElementById("left");
    var oPs = oLeft.getElementsByTagName("p");
    var oUls = oLeft.getElementsByTagName("ul");
    var flag = new Array(); //判断是否开启
    for (var i = 0; i < oPs.length; i++) {
        flag[i] = 1;
    }
    for (var i = 0; i < oPs.length; i++) {
        oPs[i].index = i;
        oPs[i].onclick = function () {
            if (flag[this.index] == 1) {
                oUls[this.index].style.display = "none";//改变状态
                flag[this.index] = 0;
                oPs[this.index].innerHTML = "&nbsp;+&nbsp;洗发步骤";//p标签内容的改变
            }
            else {
                oUls[this.index].style.display = "block";//改变状态
                flag[this.index] = 1;//改变标志
                oPs[this.index].innerHTML = "&nbsp;-&nbsp;洗发步骤"//p标签内容的改变
            }
        }
    }//p标签的点击事件
    //轮播
    //获取对象
    var banner = document.getElementById("banner");
    var Imgs = banner.getElementsByTagName("img");
    var Lis = banner.getElementsByTagName("li");
    var len = Imgs.length;
    var imgsWidth = Imgs[0].offsetWidth;

    //位置初始化
    function imgPose(i) {
        for (var n = 0; n < i; n++) {
            Imgs[n].style.left = -imgsWidth + "px";
        }//之前
        for (var n = i + 1; n < len; n++) {
            Imgs[n].style.left = imgsWidth + "px";
        }//之后
        Imgs[i].style.left = 0 + "px";//我

    }

    imgPose(0);
    //绑定事件
    for (var i = 0; i < len; i++) {
        Lis[i].index = i;
        Lis[i].onclick = function () {
            //放置位置
            imgPose(this.index);
            for (var n = 0; n < len; n++) {
                Lis[n].className = "";
            }
            this.className = "on"; //列表项的高亮位置
        }
    }
    // //自动轮播，从右往左
    // setInterval(function () {
    //     var n;
    //     for (var i = 0; i < len; i++) {
    //         if (Imgs[i].offsetleft===0) {
    //             n = i;
    //             break;
    //         }
    //     }
    //     //获取当前位置图片的编号
    //     imgPose(n + 1);//放置位置
    //     Lis[n + 1].className = "on";//改变高亮位置
    // }, 1000);
}
