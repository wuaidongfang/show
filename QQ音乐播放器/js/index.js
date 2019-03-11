$(function () {
    //0.自定义滚动条
    $(".content_list").mCustomScrollbar();

    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voiceprogress;
    var lyric;

    //1.加载歌曲列表
    getPlayerList();
    function getPlayerList() {
        $.ajax({
            url: "D:/show/QQ音乐播放器/source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;
                //3.1遍历获取到的数据，创建每一条音乐
                var $musicList = $(".content_list ul");
                $.each(data, function (index, ele) {
                    var $item = createMusicItem(index, ele);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
                // console.log(data)
                // console.log("成功")
            },
            error: function (e) {
                // console.log(e)
                // console.log("失败")
            }
        });
    }

    //2.初始化歌曲信息
    function initMusicInfo(music) {
        var $musicImage = $(".song_info_pic img");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAlbum = $(".song_info_album a");
        var $musicProgressName = $(".music_progress_name");
        var $musicProgressTime = $(".music_progress_time");
        var $musicBg = $(".mask_bg");

        //给获取到的元素赋值
        $musicImage.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAlbum.text(music.album);
        $musicProgressName.text(music.name + ' / ' + music.singer);
        $musicProgressTime.text('00:00 / ' + music.time);
        $musicBg.css("background", "url('" + music.cover + "')");
    }

    //3.初始化歌词信息
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc);
        var $lyricContainer = $(".song_lyric");
        //清空上一首音乐的信息
        $lyricContainer.html("");
        lyric.loadLyric(function () {
            //创建歌词列表
            $.each(lyric.lyrics, function (index, ele) {
                var $item = $("<li>" + ele + "</li>");
                $lyricContainer.append($item);
            });
        });
    }

    //3.初始化进度条
    initProgress();
    function initProgress() {
        //歌曲进度条
        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");
        progress = new Progress($progressBar, $progressLine, $progressDot);

        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progerssMove(function (value) {
            player.musicSeekTo(value);
        });

        //声音进度条
        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        voiceprogress = new Progress($voiceBar, $voiceLine, $voiceDot);

        voiceprogress.progressClick(function (value) {
            player.musicVoiceSeekTo(value);
        });
        voiceprogress.progerssMove(function (value) {
            player.musicVoiceSeekTo(value);
        });
    }

    //4.初始化事件的监听
    initEvents();
    function initEvents() {
        //1.监听歌曲的移入移出事件
        $(".content_list").delegate(".list_music", "mouseenter", function () {
            //显示子菜单
            $(this).find('.list_menu').stop().fadeIn(100);
            $(this).find('.list_time a').stop().fadeIn(100);
            //隐藏时长
            $(this).find('.list_time span').stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_music", "mouseleave", function () {
            //隐藏子菜单
            $(this).find('.list_menu').stop().fadeOut(100);
            $(this).find('.list_time a').stop().fadeOut(100);
            //显示时长
            $(this).find('.list_time span').stop().fadeIn(100);
        });
        //2.监听复选框的点击事件
        $(".content_list").delegate(".list_check", "click", function () {
            $(this).toggleClass("list_checked");
        });
        //3.添加子菜单播放按钮的监听
        var $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play", "click", function () {
            var $item = $(this).parents(".list_music"); //优化代码

            // console.log($item.get(0).index);
            // console.log($item.get(0).music);            

            //3.1切换播放图标
            $(this).toggleClass("list_menu_play2");
            //3.2复原其他的播放图标
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //3.3同步底部播放按钮
            if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
                //当前子菜单的播放按钮是播放状态
                $musicPlay.addClass("music_play2");
                // $item.find(".list_number").addClass("list_number2");
                //让文字高亮
                $item.find("div").css("color", "#fff")
                $item.siblings().find("div").css("color", "rgba(255, 255, 255, 0.5)")
            } else {
                //当前子菜单的播放按钮不是播放状态
                $musicPlay.removeClass("music_play2");
                // $item.find(".list_number").removeClass("list_number2");
                //让文字不高亮
                $item.find("div").css("color", "rgba(255, 255, 255, 0.5)");
            }
            //3.4切换序号的状态
            $item.find(".list_number").toggleClass("list_number2");
            $item.siblings().find(".list_number").removeClass("list_number2");

            //3.5播放音乐
            player.playMusic($item.get(0).index, $item.get(0).music);
            //3.6切换歌曲信息
            initMusicInfo($item.get(0).music);
            //3.7切换歌词信息
            initMusicLyric($item.get(0).music);
        });

        //4.监听底部控制区域播放按钮的点击
        $musicPlay.click(function () {
            if (player.currentIndex == -1) {
                //没有播放过音乐
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            } else {
                //已经播放过音乐
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
        //5.监听底部控制区域上一首按钮的点击
        $(".music_pre").click(function () {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        });
        //6.监听底部控制区域下一首按钮的点击
        $(".music_next").click(function () {
            $(".list_music").eq(player.netxIndex()).find(".list_menu_play").trigger("click");
        });
        //7.监听删除按钮的点击
        $(".content_list").delegate(".list_menu_del", "click", function () {
            //找到被点击的音乐
            var $item = $(this).parents(".list_music");

            //判断当前删除的是否是正在播放的
            if ($item.get(0).index == player.currentIndex) {
                $(".music_next").trigger("click");
            }
            //移除删除的歌曲(前后台数据)
            $item.remove();
            player.changeMusic($item.get(0).index);
            //重新排序
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            });
        });
        //8.监听播放的进度
        player.musicTimeUpdate(function (currentTime, duration, timeStr) {
            //同步时间
            $(".music_progress_time").text(timeStr);
            //同步进度条
            //计算播放比例
            var value = currentTime / duration * 100;
            progress.setProgress(value);
            //实现歌词同步
            var index = lyric.currentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            if (index <= 0) return;
            $(".song_lyric").css({
                marginTop: (-index + 2) * 30
            })
        });
        //9.监听声音按钮的点击
        $(".music_voice_icon").click(function () {
            //图标切换
            $(this).toggleClass("music_voice_icon2");
            //声音切换
            if ($(this).attr("class").indexOf("music_voice_icon2") != -1) {
                //变为没有声音
                player.musicVoiceSeekTo(0);
            } else {
                //变为有声音
                player.musicVoiceSeekTo(1);
            }
        })
    }

    //定义一个方法创建一条音乐
    function createMusicItem(index, music) {
        var $item = $(`<li class="list_music">
        <div class="list_check"><i></i></div>
        <div class="list_number">` + (index + 1) + `</div>
        <div class="list_name">` + music.name + `
            <div class="list_menu">
                <a href="javascript:;" title="播放" class="list_menu_play"></a>
                <a href="javascript:;" title="添加"></a>
                <a href="javascript:;" title="下载"></a>
                <a href="javascript:;" title="分享"></a>
            </div>
        </div>
        <div class="list_singer">` + music.singer + `</div>
        <div class="list_time">
            <span>` + music.time + `</span>
                <a href="javascript:;" title="删除" class="list_menu_del"></a>
        </div>
    </li>`);
        $item.get(0).index = index;
        $item.get(0).music = music;

        return $item;
    }

});