// 定义全局函数 configureCameraStream
function configureCameraStream() {
    navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment", // 使用后置摄像头
            focusMode: "continuous"    // 尝试启用连续自动对焦（视设备支持情况）
        }
    }).then(function(stream) {
        const video = document.getElementById('arjs-video');
        video.srcObject = stream;
        video.play();
    }).catch(function(err) {
        console.error("Error accessing camera: ", err);
    });
}


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
            viewPage: 'home', // 默认显示  的页面
            KeepPage_name: localStorage.getItem('KeepPage_name') || false,  //主要紀錄要保持的頁面
            keepPage: localStorage.getItem('keepPage') || false, // 此為在ar頁面 切換時的上下頁是否在刷新後保持當前頁面 
            phone_number: '',
            serial_number:'',
            slidesData: [
                'assets/images/s1.png',
                'assets/images/s2.png',
                'assets/images/s3.png'
            ],
            currentIndex: 0,
            is_viewed: false,
            isDisabled: false,
            nowStep: false,
            is_text: false, // 控制是否顯示相機掃描文字
        },
        methods: {
            showSlide(index) {
                if (index === this.slidesData.length - 1) {
                    // If the last slide is selected, show the alert and set is_viewed to true /
                    if(this.currentIndex >= 1){
                        alert('已經可以前往下一關囉');
                    }else{
                        alert('第二張圖卡尚未觀看喔');
                        return;
                    }
                    
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
                if(this.currentIndex == this.slidesData.length - 1){
                    alert(`已經可以前往下一關囉,可點選數字的部分查看已看過的圖卡`);
                    
                    return;
                }
                if(this.currentIndex > 0){
                    this.currentIndex -- ;
                }
                
            },
            nextSlide() {
                
                if (this.currentIndex < this.slidesData.length - 1) {
                    if(this.currentIndex >= 1){
                        alert('已經可以前往下一關囉');
                    }
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
            getLotteryResults(){
                const vm = this;
                if(this.phone_number.length < 5){
                    alert('請輸入末五碼');
                    return;

                }
                alert(`你的末五碼是: ${this.phone_number}`);
                fetch('https://changtax-postcard.netmet.tech/serial_number.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ lastFiveDigits: this.phone_number })
                })
                .then(response => response.json())
                .then(data => {
                    vm.serial_number = data.serialNumber;
                    console.log('流水號:', data.serialNumber);
                    vm.viewPage = 'fina-page';
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            },
            initAR() {
                const vm = this;
                var detected_times = 0;
                var is_stop = false;
                AFRAME.registerComponent('image-tracker-1', {
                    init: function () {
                        configureCameraStream();  // 调用全局函数以配置摄像头
                        console.log("image-tracker-1 init");
                        // 使用 MutationObserver 監測 #arjs-video 的生成
                        const observer = new MutationObserver((mutationsList, observer) => {
                            const video = document.getElementById('arjs-video');
                            if (video) {
                                observer.disconnect(); // 停止監聽
                
                                video.addEventListener('play', () => {
                                    const referenceImage = document.getElementById('referenceImage-1');
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                
                                    // 加載參考圖像作為基準
                                    let referenceMat = cv.imread(referenceImage);
                
                                    // 轉為灰階
                                    cv.cvtColor(referenceMat, referenceMat, cv.COLOR_RGBA2GRAY);
                
                                    // 使用 ORB 特徵檢測器
                                    let orb = new cv.ORB();
                
                                    // 提取參考圖像的關鍵點和描述符
                                    let referenceKeypoints = new cv.KeyPointVector();
                                    let referenceDescriptors = new cv.Mat();
                                    orb.detectAndCompute(referenceMat, new cv.Mat(), referenceKeypoints, referenceDescriptors);
                                    // 記錄開始時間
                                    let startTime = Date.now();
                                  
                                    function processFrame() {
                                        try {
                                            const elapsedTime = Date.now() - startTime;
                                            //超過5秒後顯示提示文字
                                            if(elapsedTime >= 3000){
                                                vm.is_text = true;
                                                
                                            }
                                            if(elapsedTime >= 6000){
                                                vm.is_text = false;
                                                
                                            }
                                            if(elapsedTime >= 10000){
                                                vm.is_text = true;
                                            }
                                             // 超過15秒後自動跳轉   
                                            if (elapsedTime >= 15000) {
                                                if (detected_times < 2) {
                                                    alert('尚未成功辨識到圖片');
                                                    vm.is_text = false;
                                                    console.log("Number of detected times: ", detected_times);
                                                    is_stop = true;
                                                    localStorage.setItem('KeepPage_name', '');
                                                    vm.changeViewPage('poster', true);
                                                    console.log("image-tracker-1 detected");
                                                }
                                                return; // 結束處理
                                            }
                                            // 從視頻中截取畫面
                                            canvas.width = video.videoWidth;
                                            canvas.height = video.videoHeight;
                                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                    
                                            // 將截取的畫面轉為 OpenCV Mat 格式
                                            let frameMat = cv.imread(canvas);
                                            if (frameMat.empty()) {
                                                throw new Error('Frame Mat is empty!');
                                            }
                                            cv.cvtColor(frameMat, frameMat, cv.COLOR_RGBA2GRAY);
                                    
                                            // 檢測視頻畫面的關鍵點和描述符
                                            let frameKeypoints = new cv.KeyPointVector();
                                            let frameDescriptors = new cv.Mat();
                                            orb.detectAndCompute(frameMat, new cv.Mat(), frameKeypoints, frameDescriptors);
                                    
                                            // 確保描述符不為空
                                            if (frameDescriptors.empty()) {
                                                throw new Error('Frame Descriptors are empty!');
                                            }
                                    
                                            // 特徵點匹配
                                            let bf = new cv.BFMatcher(cv.NORM_HAMMING, true);
                                            let matches = new cv.DMatchVector();
                                            bf.match(referenceDescriptors, frameDescriptors, matches);
                                    
                                            // 計算匹配的數量
                                            const matchCount = matches.size();
                                    

                                            // 設定一個匹配數量的閾值來判斷是否有成功辨識到目標
                                            if (matchCount >= 100) {
                                                console.log(`Number of matches: ${matchCount}`);
                                                detected_times++;
                                                console.log("Target detected!======================================");
                                            }
                                    
                                            // 清理內存
                                            frameMat.delete();
                                            frameKeypoints.delete();
                                            frameDescriptors.delete();
                                            matches.delete();
                                        } catch (error) {
                                            console.error("Error during frame processing:", error);
                                        } finally {
                                            // 確保每次處理後內存都被釋放
                                            if (!is_stop) {
                                                requestAnimationFrame(processFrame);
                                            }
                                        }
                                        

                                        if (detected_times >= 2) {
                                            is_stop = true;
                                            vm.is_text = false;
                                            localStorage.setItem('KeepPage_name', '');
                                            vm.changeViewPage('poster', true);
                                            music.play(); // Ensure music plays when changing viewPage to 'poster'
                                            console.log("image-tracker-1 detected");
                                        }
                                    }
                
                                    // 開始處理每一幀
                                    if (!is_stop) {
                                        requestAnimationFrame(processFrame);
                                    }
                                });
                            }
                        });
                
                        // 開始監測 DOM 中是否出現了 #arjs-video
                        observer.observe(document.body, { childList: true, subtree: true });
                    },
                    tick: function () {
                        if (this.el.object3D.visible && !is_stop) {
                            is_stop = true;
                            localStorage.setItem('KeepPage_name', '');
                            vm.changeViewPage('poster', true);
                            music.play(); // Ensure music plays when changing viewPage to 'poster'
                            console.log("image-tracker-1 detected");
                        }
                    }
                });
            },
            initAR02() {
                const vm = this;
                var detected_times = 0;
                var is_stop = false;
                AFRAME.registerComponent('image-tracker-2', {
                    init: function () {
                        console.log("image-tracker-2 init");
                        configureCameraStream();  // 调用全局函数以配置摄像头
                        // 使用 MutationObserver 監測 #arjs-video 的生成
                        const observer = new MutationObserver((mutationsList, observer) => {
                            const video = document.getElementById('arjs-video');
                            if (video) {
                                observer.disconnect(); // 停止監聽
                
                                video.addEventListener('play', () => {
                                    const referenceImage = document.getElementById('referenceImage-2');
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                
                                    // 加載參考圖像作為基準
                                    let referenceMat = cv.imread(referenceImage);
                
                                    // 轉為灰階
                                    cv.cvtColor(referenceMat, referenceMat, cv.COLOR_RGBA2GRAY);
                
                                    // 使用 ORB 特徵檢測器
                                    let orb = new cv.ORB();
                
                                    // 提取參考圖像的關鍵點和描述符
                                    let referenceKeypoints = new cv.KeyPointVector();
                                    let referenceDescriptors = new cv.Mat();
                                    orb.detectAndCompute(referenceMat, new cv.Mat(), referenceKeypoints, referenceDescriptors);
                                    
                                    // 記錄開始時間
                                    const startTime = Date.now();

                                    function processFrame() {
                                        try {
                                             // 檢查是否超過15秒
                                            const elapsedTime = Date.now() - startTime;
                                            //超過5秒後顯示提示文字
                                            if(elapsedTime >= 3000){
                                                vm.is_text = true;
                                                
                                            }
                                            if(elapsedTime >= 6000){
                                                vm.is_text = false;
                                                
                                            }
                                            if(elapsedTime >= 10000){
                                                vm.is_text = true;
                                            }


                                            if (elapsedTime >= 15000) {
                                                if (detected_times < 2) {
                                                    alert('尚未成功辨識到圖片');
                                                    console.log("Number of detected times: ", detected_times);
                                                    is_stop = true;
                                                    vm.is_text = false;
                                                    localStorage.setItem('KeepPage_name', '');
                                                    vm.changeViewPage('video-view', true);
                                                    console.log("image-tracker-2 detected");
                                                }
                                                return; // 結束處理
                                            }
                                            // 從視頻中截取畫面
                                            canvas.width = video.videoWidth;
                                            canvas.height = video.videoHeight;
                                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                    
                                            // 將截取的畫面轉為 OpenCV Mat 格式
                                            let frameMat = cv.imread(canvas);
                                            if (frameMat.empty()) {
                                                throw new Error('Frame Mat is empty!');
                                            }
                                            cv.cvtColor(frameMat, frameMat, cv.COLOR_RGBA2GRAY);
                                    
                                            // 檢測視頻畫面的關鍵點和描述符
                                            let frameKeypoints = new cv.KeyPointVector();
                                            let frameDescriptors = new cv.Mat();
                                            orb.detectAndCompute(frameMat, new cv.Mat(), frameKeypoints, frameDescriptors);
                                    
                                            // 確保描述符不為空
                                            if (frameDescriptors.empty()) {
                                                throw new Error('Frame Descriptors are empty!');
                                            }
                                    
                                            // 特徵點匹配
                                            let bf = new cv.BFMatcher(cv.NORM_HAMMING, true);
                                            let matches = new cv.DMatchVector();
                                            bf.match(referenceDescriptors, frameDescriptors, matches);
                                    
                                            // 計算匹配的數量
                                            const matchCount = matches.size();
                                    
                                            // 設定一個匹配數量的閾值來判斷是否有成功辨識到目標
                                            if (matchCount >= 135) {
                                                console.log(`Number of matches: ${matchCount}`);
                                                detected_times++;
                                                console.log("Target detected!======================================");
                                            } else {
                                                detected_times = 0;
                                            }
                                    
                                            // 清理內存
                                            frameMat.delete();
                                            frameKeypoints.delete();
                                            frameDescriptors.delete();
                                            matches.delete();
                                        } catch (error) {
                                            console.error("Error during frame processing:", error);
                                        } finally {
                                            // 確保每次處理後內存都被釋放
                                            if (!is_stop) {
                                                requestAnimationFrame(processFrame);
                                            }
                                        }
                                        

                                        if (detected_times >= 2) {
                                            console.log("Number of detected times: ", detected_times);
                                            is_stop = true;
                                            localStorage.setItem('KeepPage_name', '');
                                            vm.changeViewPage('video-view', true);
                                            console.log("image-tracker-2 detected");
                                        }
                                    }
                
                                    // 開始處理每一幀
                                    if (!is_stop) {
                                        requestAnimationFrame(processFrame);
                                    }
                                });
                            }
                        });
                
                        // 開始監測 DOM 中是否出現了 #arjs-video
                        observer.observe(document.body, { childList: true, subtree: true });
                    },
                    tick: function () {
                        if (this.el.object3D.visible && !is_stop) {
                            is_stop = true;
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
            showModal() {
                if (this.viewPage === 'poster') {
                    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
                    myModal.show();
                }
            },
        },
        watch: {
            viewPage(newPage) {
                setTimeout(() => {
                    window.scroll({ top: -1, left: 0, behavior: "smooth" });
                }, 10); 
                if (newPage === 'home') {
                    // 如果切换到 home 页面，重置音乐并停止播放
                    music.currentTime = 0;
                    music.pause();
                } else {
                    // 切换到其他页面时，继续播放音乐
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
                        class="arbox01"
                        vr-mode-ui="enabled: false;"
                        renderer="logarithmicDepthBuffer: true;"
                        embedded
                        device-orientation-permission-ui="enabled: false"
                        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;detectionMode: mono_and_matrix;">

                        <a-nft
                            type="nft"
                            url="https://yozuwork.github.io/WEBARImageTracking2.0/assets/markers/marker-1"
                            smooth="true"
                            smoothCount="10"
                            smoothTolerance="0.01"
                            smoothThreshold="5"
                            image-tracker-1>
                        </a-nft>


                        <a-entity camera="zoom: 3"></a-entity>
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
                        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;detectionMode: mono_and_matrix;">

                        <a-nft
                            type="nft"
                            url="https://yozuwork.github.io/WEBARImageTracking2.0/assets/markers/marker-2"
                            smooth="true"
                            smoothCount="10"
                            smoothTolerance="0.01"
                            smoothThreshold="5"
                            image-tracker-2>
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
                    this.showModal();
                   
                   
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
        },
       
    });
});