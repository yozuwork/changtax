(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerPolicy&&(s.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?s.credentials="include":t.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function o(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}})();var l,i;document.addEventListener("DOMContentLoaded",function(){i=document.getElementById("background-music");const r=localStorage.getItem("musicCurrentTime");r&&(i.currentTime=parseFloat(r)),l=new Vue({el:"#app",data:{viewPage:"arpage",KeepPage_name:localStorage.getItem("KeepPage_name")||!1,keepPage:localStorage.getItem("keepPage")||!1,phone_number:"",serial_number:"",slidesData:["assets/images/s1.png","assets/images/s2.png","assets/images/s3.png"],currentIndex:0,is_viewed:!1,isDisabled:!1,nowStep:!1,isTargetDetected:!0},methods:{showSlide(e){e===this.slidesData.length-1&&(alert("已經可以前往下一關囉"),this.is_viewed=!0),this.currentIndex===this.slidesData.length-1?document.querySelectorAll(".slide").forEach((a,o)=>{o===e?a.classList.add("active"):a.classList.remove("active")}):this.currentIndex=e},prevSlide(){this.currentIndex=(this.currentIndex-1+this.slidesData.length)%this.slidesData.length},nextSlide(){this.currentIndex<this.slidesData.length-1?this.currentIndex++:(alert("已經可以前往下一關囉"),this.is_viewed=!0)},changeViewPage(e,a){if(a&&i.paused&&i.play(),e=="instructions02"&&a=="back"&&(localStorage.setItem("KeepPage_name","instructions02"),localStorage.setItem("keepPage",!0),location.reload()),e=="arpage"&&(localStorage.setItem("KeepPage_name","arpage"),localStorage.setItem("keepPage",!0),location.reload()),e=="poster"&&(localStorage.setItem("KeepPage_name","poster"),localStorage.setItem("keepPage",!0),location.reload()),e=="arpage02"){if(this.currentIndex!==2&&a==!0){alert("請看完每張稅務知識圖卡");return}localStorage.setItem("KeepPage_name","arpage02"),localStorage.setItem("keepPage",!0),location.reload()}e=="video-view"&&(localStorage.setItem("KeepPage_name","video-view"),localStorage.setItem("keepPage",!0),location.reload()),console.log(`Changing viewPage to ${e}`),this.viewPage=e},nextPage(){console.log("nextPage called"),this.is_viewed?(console.log("is_viewed is true, changing viewPage to qa01"),this.changeViewPage("qa01"),i.play()):alert("請觀看完影片")},checkAnswer(e,a){const o=this;this.isDisabled||(this.isDisabled=!0,document.querySelectorAll(".ansbox").forEach(t=>{t.disabled=!0}),document.querySelectorAll(".ansbox").forEach(t=>{t.classList.remove("ansbox-active")}),a.target.classList.add("ansbox-active"),e?(document.querySelectorAll(".correct").forEach(t=>{t.style.display="block"}),setTimeout(()=>{switch(document.querySelectorAll(".correct").forEach(t=>{t.style.display="none"}),document.querySelectorAll(".ansbox").forEach(t=>{t.disabled=!1}),o.viewPage){case"qa01":o.changeViewPage("qa02");break;case"qa02":o.changeViewPage("qa03");break;case"qa03":o.changeViewPage("qa04");break;case"qa04":o.changeViewPage("qa05");break;case"qa05":o.changeViewPage("results");break}window.scrollTo(0,0),document.querySelectorAll(".ansbox").forEach(t=>{t.classList.remove("ansbox-active")}),this.isDisabled=!1},1e3)):(document.querySelectorAll(".mistake").forEach(t=>{t.style.display="block"}),setTimeout(()=>{document.querySelectorAll(".mistake").forEach(t=>{t.style.display="none"}),document.querySelectorAll(".ansbox").forEach(t=>{t.disabled=!1}),document.querySelectorAll(".ansbox").forEach(t=>{t.classList.remove("ansbox-active")}),this.isDisabled=!1},1e3)))},getLotteryResults(){const e=this;alert(`你的末五碼是: ${this.phone_number}`),fetch("https://changtax-postcard.netmet.tech/serial_number.php",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lastFiveDigits:this.phone_number})}).then(a=>a.json()).then(a=>{e.serial_number=a.serialNumber,console.log("流水號:",a.serialNumber),e.viewPage="fina-page"}).catch(a=>{console.error("Error:",a)})},initAR(){const e=this;AFRAME.registerComponent("image-tracker-1",{init:function(){console.log("image-tracker-1 init")},tick:function(){this.el.object3D.visible&&(localStorage.setItem("KeepPage_name",""),e.viewPage="poster",i.play(),console.log("image-tracker-1 detected"))}})},initAR02(){const e=this;AFRAME.registerComponent("image-tracker-2",{init:function(){console.log("image-tracker-2 init")},tick:function(){this.el.object3D.visible&&(localStorage.setItem("KeepPage_name",""),e.changeViewPage("video-view",!0),console.log("image-tracker-2 detected"))}})},initYouTubePlayers(){var e=document.createElement("script");e.src="https://www.youtube.com/iframe_api";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(e,a),window.onYouTubeIframeAPIReady=this.onYouTubeIframeAPIReady},onYouTubeIframeAPIReady(){this.player1=new YT.Player("youtubeVideo1",{events:{onStateChange:this.onPlayerStateChange1}}),this.player2=new YT.Player("youtubeVideo2",{events:{onStateChange:this.onPlayerStateChange2}})},onPlayerStateChange1(e){e.data==YT.PlayerState.ENDED&&(this.video1Completed=!0,console.log("Video 1 completed"),this.checkBothVideosCompleted(e))},onPlayerStateChange2(e){e.data==YT.PlayerState.PLAYING&&(console.log("Video 2 is playing"),this.video2StartTime||(this.video2StartTime=new Date().getTime(),setTimeout(this.checkVideo2Time,3e4))),(e.data==YT.PlayerState.PAUSED||e.data==YT.PlayerState.ENDED)&&this.checkBothVideosCompleted(e)},checkVideo2Time(){var e=new Date().getTime(),a=(e-this.video2StartTime)/1e3;a>=30&&(this.video2TimeWatched=!0,console.log("Video 2 watched for 30 seconds"),this.checkBothVideosCompleted())},checkBothVideosCompleted(e){console.log("Checking if both videos completed and 30 seconds watched for Video 2"),console.log("Video1 Completed: "+this.video1Completed),console.log("Video2 Watched 30s: "+this.video2TimeWatched),this.video1Completed&&this.video2TimeWatched&&(this.is_viewed=!0,e&&(e.data==YT.PlayerState.PAUSED||e.data==YT.PlayerState.ENDED)&&alert("可繼續前往下一關囉"))},handleFocus(){const e=document.querySelector("video");if(e&&"srcObject"in e){const a=e.srcObject.getVideoTracks()[0];a.getCapabilities().focusDistance?(a.getSettings(),a.applyConstraints({advanced:[{focusMode:"continuous"}]}).then(()=>{console.log("自動對焦已啟用")}).catch(t=>{console.error("無法設置自動對焦:",t)})):console.log("該設備不支持對焦控制")}else console.log("無法獲取相機流或相機不支持")},handleMarkerFound(){this.isTargetDetected=!0},handleMarkerLost(){this.isTargetDetected=!1}},watch:{viewPage(e){setTimeout(()=>{window.scroll({top:-1,left:0,behavior:"smooth"})},10),e==="home"?(i.currentTime=0,i.pause()):i.play(),console.log(`viewPage changed to ${e}`),e==="video-view"&&this.initYouTubePlayers()}},mounted(){if(this.keepPage=="true")if(this.KeepPage_name=="arpage"){localStorage.setItem("keepPage",!1),this.viewPage="arpage";const e=document.querySelector(".arpage01");e.innerHTML=`
                  <a-scene
                    v-if="viewPage == 'arpage'"
                    class="arbox"
                    vr-mode-ui="enabled: false;"
                    renderer="logarithmicDepthBuffer: true;"
                    embedded
                    device-orientation-permission-ui="enabled: false"
                    arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_color; maxDetectionRate: 60;"
                    @touchstart="handleFocus">
                     <!-- 提示文字 -->
                    <div v-if="!isTargetDetected" class="scan-hint">
                        請對準掃描點
                    </div>
                    <a-nft
                        type="nft"
                        url="https://yozuwork.github.io/WEBARImageTracking2.0/assets/tracking_target/marker"
                        smooth="true"
                        smoothCount="2"
                        smoothTolerance="0.01"
                        smoothThreshold="0.5"
                        @markerFound="handleMarkerFound"
                        @markerLost="handleMarkerLost"
                        image-tracker-1>
                        <a-entity
                        gltf-model="https://yozuwork.github.io/WEBARImageTracking2.0/assets/scene.gltf"
                        scale="5 5 5"
                        position="50 150 0">
                        </a-entity>
                    </a-nft>

                    <a-entity camera></a-entity>
                    </a-scene>

                   `,this.initAR(),i.play()}else if(this.KeepPage_name=="arpage02"){localStorage.setItem("keepPage",!1),this.viewPage="arpage02";const e=document.querySelector(".arpage02");e.innerHTML=`
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
                    `,this.initAR02(),i.play()}else this.KeepPage_name=="instructions02"?(localStorage.setItem("keepPage",!1),this.viewPage="instructions02",i.play()):this.KeepPage_name=="poster"?(localStorage.setItem("keepPage",!1),this.viewPage="poster",i.play()):this.KeepPage_name=="video-view"&&(localStorage.setItem("keepPage",!1),this.viewPage="video-view",i.play());this.viewPage!=="home"&&i.play(),window.addEventListener("beforeunload",function(){localStorage.setItem("musicCurrentTime",i.currentTime)}),document.addEventListener("touchend",e=>{var a=e.target;a.id==="your-button-id"&&this.nextPage()},!1),window.addEventListener("blur",function(){i.paused||i.pause()}),window.addEventListener("focus",function(){l.viewPage!=="home"&&i.play()}),document.addEventListener("visibilitychange",function(){document.visibilityState==="hidden"&&(i.paused||i.pause()),document.visibilityState==="visible"&&l.viewPage!=="home"&&i.play()})}})});console.log("Hello world!");
