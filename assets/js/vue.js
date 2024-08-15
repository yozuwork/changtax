var app;
var step = 0;
var is_notified = false;
var arbox;
var music;

document.addEventListener('DOMContentLoaded', function () {
    music = document.getElementById('background-music');

    // 获取保存的播放时间
    const savedTime = localStorage.getItem('musicCurrentTime');

    if (savedTime) {
        // 设置音乐播放到保存的时间
        music.currentTime = parseFloat(savedTime);
    }

    app = new Vue({
        el: '#app',
        data: {
            viewPage: 'home',
            KeepPage_name: localStorage.getItem('KeepPage_name') || false,  //主要紀錄要保持的頁面
            keepPage: localStorage.getItem('keepPage') || false, // 此為在ar頁面 切換時的上下頁是否在刷新後保持當前頁面 
           
            slidesData: [
                'assets/images/s1.png',
                'assets/images/s2.png',
                'assets/images/s3.png'
            ],
            currentIndex: 0,
            is_viewed: false,
            isDisabled: false,
            nowStep: false,
        },
        methods: {
            showSlide(index) {
                if (index === this.slidesData.length - 1) {
                    // If the last slide is selected, show the alert and set is_viewed to true /
                    alert('已經可以前往下一關囉');
                    this.is_viewed = true;
                }
                
                if (this.currentIndex === this.slidesData.length - 1) {
                    // If on the last slide, allow the visual change but do not update currentIndex
                    document.querySelectorAll('.slide').forEach((slide, i) => {
                        if (i === index) {
                            slide.classList.add('active'); // Add active class to the clicked slide
                        } else {
                            slide.classList.remove('active'); // Remove active class from other slides
                        }
                    });
                } else {
                    this.currentIndex = index; // Update currentIndex if not on the last slide
                }
            },
            prevSlide() {
                this.currentIndex = (this.currentIndex - 1 + this.slidesData.length) % this.slidesData.length;
            },
            nextSlide() {
                if (this.currentIndex < this.slidesData.length - 1) {
                    this.currentIndex++;
                } else {
                    alert('已經可以前往下一關囉');
                    this.is_viewed = true; // You can also set this to enable the next action.
                }
            },
            changeViewPage(page, act) {
                if (act && music.paused) {
                    music.play();
                }
                if (page == 'instructions02') {
                    if(act == 'back'){
                        localStorage.setItem('KeepPage_name', 'instructions02');
                        localStorage.setItem('keepPage', true);
                        location.reload();
                    } 
                }
                if (page == 'arpage') {
                    localStorage.setItem('KeepPage_name', 'arpage');
                    localStorage.setItem('keepPage', true);
                    location.reload();
                }
                if (page == 'poster') {
                    localStorage.setItem('KeepPage_name', 'poster');
                    localStorage.setItem('keepPage', true);
                    location.reload();
                    
                   
                }
                if (page == 'arpage02' ) { 
                    

                    if (this.currentIndex !== 2 && act == true ) {
                        alert('請看完每張稅務知識圖卡');
                        return;
                    }
                 
                    localStorage.setItem('KeepPage_name', 'arpage02');
                    localStorage.setItem('keepPage', true);
                    location.reload();
                }
                if(page == 'video-view'){
                   
                    localStorage.setItem('KeepPage_name', 'video-view');
                    localStorage.setItem('keepPage', true);
                    location.reload();
                    
                }
                console.log(`Changing viewPage to ${page}`);
                this.viewPage = page;
            },
            nextPage() {
                console.log('nextPage called');
                if (this.is_viewed) {
                    console.log('is_viewed is true, changing viewPage to qa01');
                    this.changeViewPage('qa01');
                    music.play();
                } else {
                    alert('請觀看完影片');
                }
            },
            checkAnswer(isCorrect, event) {
                const vm = this;
                if (this.isDisabled) return;

                this.isDisabled = true;
                document.querySelectorAll('.ansbox').forEach(btn => {
                    btn.disabled = true;
                });

                document.querySelectorAll('.ansbox').forEach(btn => {
                    btn.classList.remove('ansbox-active');
                });

                event.target.classList.add('ansbox-active');

                if (isCorrect) {
                    document.querySelectorAll('.correct').forEach(popup => {
                        popup.style.display = 'block';
                    });
                    setTimeout(() => {
                        document.querySelectorAll('.correct').forEach(popup => {
                            popup.style.display = 'none';
                        });
                        document.querySelectorAll('.ansbox').forEach(btn => {
                            btn.disabled = false;
                        });
                        switch (vm.viewPage) {
                            case 'qa01':
                                vm.changeViewPage('qa02');
                                break;
                            case 'qa02':
                                vm.changeViewPage('qa03');
                                break;
                            case 'qa03':
                                vm.changeViewPage('qa04');
                                break;
                            case 'qa04':
                                vm.changeViewPage('qa05');
                                break;
                            case 'qa05':
                                vm.changeViewPage('results');
                                break;
                        }
                        window.scrollTo(0, 0);
                        document.querySelectorAll('.ansbox').forEach(btn => {
                            btn.classList.remove('ansbox-active');
                        });
                        this.isDisabled = false;
                    }, 1000);
                } else {
                    document.querySelectorAll('.mistake').forEach(popup => {
                        popup.style.display = 'block';
                    });
                    setTimeout(() => {
                        document.querySelectorAll('.mistake').forEach(popup => {
                            popup.style.display = 'none';
                        });
                        document.querySelectorAll('.ansbox').forEach(btn => {
                            btn.disabled = false;
                        });
                        document.querySelectorAll('.ansbox').forEach(btn => {
                            btn.classList.remove('ansbox-active');
                        });
                        this.isDisabled = false;
                    }, 1000);
                }
            },
            initAR() {
                const vm = this;
                AFRAME.registerComponent('image-tracker-1', {
                    init: function () {
                        console.log("image-tracker-1 init");
                    },
                    tick: function () {
                        if (this.el.object3D.visible) {
                            localStorage.setItem('KeepPage_name', '');
                            vm.viewPage = 'poster';
                            music.play(); // Ensure music plays when changing viewPage to 'poster'
                            console.log("image-tracker-1 detected");
                        }
                    }
                });
            },
            initAR02() {
                const vm = this;
                AFRAME.registerComponent('image-tracker-2', {
                    init: function () {
                        console.log("image-tracker-2 init");
                    },
                    tick: function () {
                        if (this.el.object3D.visible) {
                            localStorage.setItem('KeepPage_name', '');
                            vm.changeViewPage('video-view', true);
                            console.log("image-tracker-2 detected");
                        }
                    }
                });
            },
            initYouTubePlayers() {
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady;
            },
            onYouTubeIframeAPIReady() {
                this.player1 = new YT.Player('youtubeVideo1', {
                    events: {
                        'onStateChange': this.onPlayerStateChange1
                    }
                });

                this.player2 = new YT.Player('youtubeVideo2', {
                    events: {
                        'onStateChange': this.onPlayerStateChange2
                    }
                });
            },
            onPlayerStateChange1(event) {
                if (event.data == YT.PlayerState.ENDED) {
                    this.video1Completed = true;
                    console.log("Video 1 completed");
                    this.checkBothVideosCompleted(event);
                }
            },
            onPlayerStateChange2(event) {
                if (event.data == YT.PlayerState.PLAYING) {
                    console.log("Video 2 is playing");
                    if (!this.video2StartTime) {
                        this.video2StartTime = new Date().getTime();
                        setTimeout(this.checkVideo2Time, 30000); // Check after 30 seconds
                    }
                }
                if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
                    this.checkBothVideosCompleted(event);
                }
            },
            checkVideo2Time() {
                var currentTime = new Date().getTime();
                var elapsedTime = (currentTime - this.video2StartTime) / 1000;
                if (elapsedTime >= 30) {
                    this.video2TimeWatched = true;
                    console.log("Video 2 watched for 30 seconds");
                    this.checkBothVideosCompleted();
                }
            },
            checkBothVideosCompleted(event) {
                console.log("Checking if both videos completed and 30 seconds watched for Video 2");
                console.log("Video1 Completed: " + this.video1Completed);
                console.log("Video2 Watched 30s: " + this.video2TimeWatched);
                if (this.video1Completed && this.video2TimeWatched) {
                    this.is_viewed = true;
                    if (event && (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED)) {
                        alert("可繼續前往下一關囉");
                    }
                }
            },
        },
        watch: {
            viewPage(newPage) {
                setTimeout(() => {
                    window.scroll({ top: -1, left: 0, behavior: "smooth" });
                }, 10); 
                if (this.viewPage !== 'home') {
                    music.play();
                }
                console.log(`viewPage changed to ${newPage}`);
                if (newPage === 'video-view') {
                    this.initYouTubePlayers();
                }
            }
        },
        mounted() {
            if(this.keepPage == 'true'){
                if(this.KeepPage_name == 'arpage'){
                   localStorage.setItem('keepPage', false);
                   this.viewPage = 'arpage';  
                   const arpage01 = document.querySelector('.arpage01');
                   arpage01.innerHTML = `
                    <a-scene
                        v-if="viewPage == 'arpage' "
                        class="arbox"
                        vr-mode-ui="enabled: false;"
                        renderer="logarithmicDepthBuffer: true;"
                        embedded
                        device-orientation-permission-ui="enabled: false"
                        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;">

                        <a-nft
                            type="nft"
                            url="https://yozuwork.github.io/WEBARImageTracking2.0/assets/tracking_target/marker"
                            smooth="true"
                            smoothCount="10"
                            smoothTolerance="0.01"
                            smoothThreshold="5"
                            image-tracker-1>
                            <a-entity
                                gltf-model="https://yozuwork.github.io/WEBARImageTracking2.0/assets/scene.gltf"
                                scale="5 5 5"
                                position="50 150 0">
                            </a-entity>
                        </a-nft>


                        <a-entity camera></a-entity>
                        </a-scene>
                   `;
                   this.initAR();
                   music.play();
                } 
                else if(this.KeepPage_name == 'arpage02'){
                    localStorage.setItem('keepPage', false);
                    this.viewPage = 'arpage02';
                    const arpage02 = document.querySelector('.arpage02');
                    arpage02.innerHTML = `
                         <a-scene
                        v-if="viewPage == 'arpage02' "
                        class="arbox02"
                        vr-mode-ui="enabled: false;"
                        renderer="logarithmicDepthBuffer: true;"
                        embedded
                        device-orientation-permission-ui="enabled: false"
                        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;">

                        <a-nft
                            type="nft"
                            url="https://yozuwork.github.io/WEBARImageTracking2.0/assets/tracking_target/home"
                            smooth="true"
                            smoothCount="10"
                            smoothTolerance="0.01"
                            smoothThreshold="5"
                            image-tracker-2>
                            <a-entity
                                gltf-model="https://yozuwork.github.io/WEBARImageTracking2.0/assets/scene.gltf"
                                scale="5 5 5"
                                position="50 150 0">
                            </a-entity>
                        </a-nft>


                        <a-entity camera></a-entity>
                        </a-scene>
                    `;
                    this.initAR02();
                    music.play();
                }
                else if(this.KeepPage_name == 'instructions02'){
                    localStorage.setItem('keepPage', false);
                    this.viewPage = 'instructions02';
                    music.play();
                }
                else if(this.KeepPage_name == 'poster'){
                    localStorage.setItem('keepPage', false);
                    this.viewPage = 'poster';
                    music.play();
                }
                else if(this.KeepPage_name == 'video-view'){
                    localStorage.setItem('keepPage', false);
                    this.viewPage = 'video-view';
                    music.play();
                }
            }
            // Automatically play music if viewPage is not 'home'
            if (this.viewPage !== 'home') {
                music.play();
            }
            // 当窗口或页面刷新时，保存当前播放时间
            window.addEventListener('beforeunload', function () {
                localStorage.setItem('musicCurrentTime', music.currentTime);
            });
            // 添加触摸事件监听器
            document.addEventListener('touchend', (event) => {
                var element = event.target;
                if (element.id === 'your-button-id') {
                    this.nextPage();
                }
            }, false);

            // 當視窗不在頁面的時候 音樂會暫停播放
            // Adding blur and focus event listeners to pause and play music
            window.addEventListener('blur', function() {
                if (!music.paused) {
                    music.pause();
                }
            });

            window.addEventListener('focus', function() {
                if (app.viewPage !== 'home') {
                    music.play();
                }
            });

            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'hidden') {
                    if (!music.paused) {
                        music.pause();
                    }
                }
                if (document.visibilityState === 'visible') {
                    if (app.viewPage !== 'home') {
                        music.play();
                    }
                }
            });
        }
    });
});