var app;
var step = 0;
var is_notified = false;
var arbox;

document.addEventListener('DOMContentLoaded', function () {
    arbox = document.createElement('div');
    arbox.id = 'arbox';
    document.body.appendChild(arbox);

    // adjustVideoSize();

    app = new Vue({
        el: '#app',
        data: {
            viewPage: localStorage.getItem('viewPage') || 'home',
            slidesData: [
                'assets/images/s1.png',
                'https://thumb.ac-illust.com/30/306837819e76342840641fd1d53fd2f9_t.jpeg',
                'assets/images/s1.png'
            ],
            currentIndex: 0,
            is_viewed: false,
            isDisabled: false
        },
        methods: {
            showSlide(index) {
                this.currentIndex = index;
            },
            prevSlide() {
                this.currentIndex = (this.currentIndex - 1 + this.slidesData.length) % this.slidesData.length;
            },
            nextSlide() {
                this.currentIndex = (this.currentIndex + 1) % this.slidesData.length;
            },
            changeViewPage(page, play) {
                var music = document.getElementById('background-music');
                if (play && music.paused) {
                    music.play();
                }
                console.log(`Changing viewPage to ${page}`);
                this.viewPage = page;
                localStorage.setItem('viewPage', page);
            },
            nextPage() {
                console.log('nextPage called');
                if (this.is_viewed) {
                    console.log('is_viewed is true, changing viewPage to qa01');
                    this.changeViewPage('qa01');
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
                        if (vm.viewPage == 'qa01') {
                            vm.changeViewPage('qa02');
                            window.scrollTo(0, 0);
                        } else if (vm.viewPage == 'qa02') {
                            vm.changeViewPage('qa03');
                            window.scrollTo(0, 0);
                        } else if (vm.viewPage == 'qa03') {
                            vm.changeViewPage('qa04');
                            window.scrollTo(0, 0);
                        } else if (vm.viewPage == 'qa04') {
                            vm.changeViewPage('qa05');
                            window.scrollTo(0, 0);
                        } else if (vm.viewPage == 'qa05') {
                            vm.changeViewPage('results');
                            window.scrollTo(0, 0);
                        }

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
            loadARScripts() {
                if (!document.getElementById('aframe-script')) {
                    var aframeScript = document.createElement('script');
                    aframeScript.id = 'aframe-script';
                    aframeScript.src = 'https://cdn.jsdelivr.net/gh/aframevr/aframe@1c2407b26c61958baa93967b5412487cd94b290b/dist/aframe-master.min.js';
                    document.head.appendChild(aframeScript);
                }

                if (!document.getElementById('arjs-script')) {
                    var arjsScript = document.createElement('script');
                    arjsScript.id = 'arjs-script';
                    arjsScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar-nft.js';
                    document.head.appendChild(arjsScript);
                }
            },
            unloadARScripts() {
                var aframeScript = document.getElementById('aframe-script');
                if (aframeScript) {
                    document.head.removeChild(aframeScript);
                }

                var arjsScript = document.getElementById('arjs-script');
                if (arjsScript) {
                    document.head.removeChild(arjsScript);
                }
            },
            initAR() {
                if (this.viewPage === 'arpage' || this.viewPage === 'arpage02') {
                    AFRAME.registerComponent('image-tracker-1', {
                        init: function () {
                            console.log("image-tracker-1 init");
                        },
                        tick: function () {
                            if (this.el.object3D.visible == true) {
                                console.log("image-tracker-1 detected");
                                step = 2;
                                localStorage.setItem('viewPage', 'poster');
                                location.reload();
                            }
                        }
                    });

                    AFRAME.registerComponent('image-tracker-2', {
                        init: function () {
                            console.log("image-tracker-2 init");
                        },
                        tick: function () {
                            if (this.el.object3D.visible == true) {
                                console.log("image-tracker-2 detected");
                                localStorage.setItem('viewPage', 'video-view');
                                location.reload();
                            }
                        }
                    });
                }
            },
            updateOverflow() {
                if (this.viewPage === 'arpage' || this.viewPage === 'arpage02') {
                    document.documentElement.style.overflow = 'hidden';
                    document.body.style.overflow = 'hidden';
                } else {
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';
                }
            }
        },
        watch: {
            viewPage(newPage) {
                var music = document.getElementById('background-music');
                if(this.viewPage !== 'home') {
                    music.play();
                }
                console.log(`viewPage changed to ${newPage}`);
                window.scrollTo(0, 0);
                this.updateOverflow();
                if (newPage === 'arpage' || newPage === 'arpage02') {
                    this.loadARScripts();
                    this.initAR();                  
                } else {
                    this.unloadARScripts();
                }
            }
        },
        mounted() {
            const validPages = ['arpage', 'arpage02'];
            if (!validPages.includes(this.viewPage)) {
                localStorage.setItem('viewPage', 'home');
            }

            var iframe1 = document.getElementById('youtubeVideo1');
            var iframe2 = document.getElementById('youtubeVideo2');
            var player1, player2;
            var video1Completed = false;
            var video2TimeWatched = false;
            var video2StartTime = null;

            function onYouTubeIframeAPIReady() {
                player1 = new YT.Player(iframe1, {
                    events: {
                        'onStateChange': onPlayerStateChange1
                    }
                });

                player2 = new YT.Player(iframe2, {
                    events: {
                        'onStateChange': onPlayerStateChange2
                    }
                });
            }

            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            function onPlayerStateChange1(event) {
                if (event.data == YT.PlayerState.ENDED) {
                    video1Completed = true;
                    console.log("Video 1 completed");
                    checkBothVideosCompleted(event);
                }
            }

            function onPlayerStateChange2(event) {
                if (event.data == YT.PlayerState.PLAYING) {
                    console.log("Video 2 is playing");
                    if (!video2StartTime) {
                        video2StartTime = new Date().getTime();
                        setTimeout(checkVideo2Time, 30000);
                    }
                }
                if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
                    checkBothVideosCompleted(event);
                }
            }

            function checkVideo2Time() {
                var currentTime = new Date().getTime();
                var elapsedTime = (currentTime - video2StartTime) / 1000;
                if (elapsedTime >= 30) {
                    video2TimeWatched = true;
                    console.log("Video 2 watched for 30 seconds");
                    checkBothVideosCompleted();
                }
            }

            function checkBothVideosCompleted(event) {
                console.log("Checking if both videos completed and 30 seconds watched for Video 2");
                console.log("Video1 Completed: " + video1Completed);
                console.log("Video2 Watched 30s: " + video2TimeWatched);
                if (video1Completed && video2TimeWatched) {
                    app.is_viewed = true;
                    if (event && (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED)) {
                        alert("可繼續前往下一關囉");
                    }
                }
            }

            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

            document.addEventListener('touchend', function (event) {
                var element = event.target;

                if (element.id === 'your-button-id') {
                    app.nextPage();
                }
            }, false);
        }
    });
});

// function adjustVideoSize() {
//     var video = document.querySelector('a-scene').querySelector('video');
//     if (video) {
//         video.style.width = '100vw';
//         video.style.height = '100vh';
//         video.style.position = 'absolute';
//         video.style.top = '0';
//         video.style.left = '0';
//         video.style.transform = 'none';
//         video.style.zIndex = '99999';
//         video.style.border = 'none';
//         video.style.overflow = 'hidden';
//         video.style.objectFit = 'cover';
//     } else {
//         setTimeout(adjustVideoSize, 500);
//     }
// }
