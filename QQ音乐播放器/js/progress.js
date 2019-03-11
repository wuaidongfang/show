(function (window) {
    function Progress($progressBar, $progressLine, $progressDot) {
        return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        musicList: [],
        init: function ($progressBar, $progressLine, $progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove: false,
        progressClick: function (callBack) {
            var $this = this; //此时的this指向的是progress
            //监听背景的点击
            this.$progressBar.click(function (event) {
                //获取背景窗口默认的位置
                var normalLeft = $(this).offset().left;
                //获取点击的位置距离窗口的位置
                var eventLeft = event.pageX;
                //设置前景的宽度
                $this.$progressLine.css("width", eventLeft - normalLeft);
                $this.$progressDot.css("left", eventLeft - normalLeft);
                //计算进度条的比例
                var value = (eventLeft - normalLeft) / $(this).width();
                callBack(value);
            });
        },
        progerssMove: function (callBack) {
            var $this = this;
            //获取背景距离窗口默认的位置
            var normalLeft = this.$progressBar.offset().left;
            // console.log(normalLeft);
            var barWidth = this.$progressBar.width();
            var eventLeft;
            //1.监听鼠标的按下事件
            this.$progressBar.mousedown(function () {
                $this.isMove = true;
                //2.监听鼠标的移动事件
                $(document).mousemove(function (event) {
                    //获取点击的位置距离窗口的位置
                    var eventLeft = event.pageX;
                    var offset = eventLeft - normalLeft;
                    //解决进度条超出的BUG
                    if (offset >= 0 && offset <= barWidth) {
                        //设置前景的宽度
                        $this.$progressLine.css("width", eventLeft - normalLeft);
                        $this.$progressDot.css("left", eventLeft - normalLeft);
                    }
                })
            })
            //3.监听鼠标的抬起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
                //计算进度条的比例
                var value = (eventLeft - normalLeft) / $this.$progressBar.width();
                callBack(value);
            });
        },
        setProgress: function (value) {
            if (this.isMove) return;
            if (value < 0 || value > 100) return;
            this.$progressLine.css({
                width: value + "%"
            });
            this.$progressDot.css({
                left: value + "%"
            })
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);