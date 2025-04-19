<!-- Copyright © C&L -->
<template>
  <!-- Copyright © C&L -->
  <div class="music-player">
    <div class="visualizer-container">
      <div class="music-visualizer">
        <div class="bar" v-for="n in 16" :key="n" :style="{ height: isPlaying ? `${Math.random() * 70 + 20}%` : '20%' }"></div>
      </div>
    </div>
    
    <div class="player-controls">
      <button @click="prev" :disabled="!hasPrev" class="control-btn prev-btn" aria-label="上一首">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 11.333l10.223-6.815a.5.5 0 0 1 .777.416v14.132a.5.5 0 0 1-.777.416L8 12.667V19a1 1 0 0 1-2 0V5a1 1 0 1 1 2 0v6.333z" fill="currentColor"/></svg>
      </button>
      <button @click="togglePlay" class="control-btn play-btn" aria-label="播放/暂停">
        <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M19.376 12.416L8.777 19.457A.5.5 0 0 1 8 19.07V4.93a.5.5 0 0 1 .777-.386l10.599 7.042a.5.5 0 0 1 0 .83z" fill="currentColor"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M6 5h2v14H6V5zm10 0h2v14h-2V5z" fill="currentColor"/></svg>
      </button>
      <button @click="next" :disabled="!hasNext" class="control-btn next-btn" aria-label="下一首">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M16 12.667L5.777 19.482A.5.5 0 0 1 5 19.066V4.934a.5.5 0 0 1 .777-.416L16 11.333V5a1 1 0 0 1 2 0v14a1 1 0 0 1-2 0v-6.333z" fill="currentColor"/></svg>
      </button>
    </div>
    
    <audio ref="audio" :src="src" @ended="onEnded" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @error="onError" preload="auto"></audio>
    
    <div class="progress-container">
      <span class="time">{{ formatTime(currentTime) }}</span>
      <div class="progress-bar-wrapper">
        <div class="progress-bg"></div>
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        <input 
          type="range" 
          class="progress-input"
          min="0" 
          :max="duration" 
          step="0.1" 
          v-model.number="currentTime" 
          @input="onSeek" 
        />
      </div>
      <span class="time">{{ formatTime(duration) }}</span>
    </div>
    
    <div class="info" v-if="errorMsg">
      <div class="error-message">{{ errorMsg }}</div>
    </div>
  </div>
</template>

<script setup>
// Copyright © C&L
import { ref, watch, onMounted, nextTick, computed } from 'vue'

// Copyright © C&L - 组件属性定义
const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, default: '未知歌曲' },
  onNext: { type: Function },
  onPrev: { type: Function },
  onEnded: { type: Function },
  hasPrev: { type: Boolean, default: true },
  hasNext: { type: Boolean, default: true }
})

// Copyright © C&L - 状态变量
const audio = ref(null)
const isPlaying = ref(false)
const duration = ref(0)
const currentTime = ref(0)
const volume = ref(0.8)
const errorMsg = ref('')
const seeking = ref(false)
const lastSrc = ref('')

// Copyright © C&L - 计算属性
const progressPercentage = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

// Copyright © C&L - 监听音频源变化
watch(() => props.src, async (newSrc) => {
  errorMsg.value = ''
  currentTime.value = 0
  isPlaying.value = false
  duration.value = 0
  seeking.value = false
  await nextTick()
  if (audio.value) {
    audio.value.load()
    try {
      await audio.value.play()
      isPlaying.value = true
    } catch (e) {
      isPlaying.value = false
    }
  }
  lastSrc.value = newSrc
})

onMounted(() => {
  if (audio.value) {
    audio.value.volume = volume.value
  }
})

// 监听 currentTime 外部变化（如切歌），同步到 audio
watch(currentTime, (val) => {
  if (audio.value && !seeking.value && Math.abs(audio.value.currentTime - val) > 0.5) {
    audio.value.currentTime = val
  }
})

// Copyright © C&L - 播放控制函数
function togglePlay() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
    isPlaying.value = false
  } else {
    audio.value.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      isPlaying.value = false
    })
  }
}

function onEnded() {
  isPlaying.value = false
  if (props.onEnded) {
    props.onEnded()
  } else if (props.onNext) {
    props.onNext()
  }
}

function onTimeUpdate() {
  if (audio.value && !seeking.value) {
    currentTime.value = audio.value.currentTime
    duration.value = audio.value.duration || 0
  }
}

function onLoadedMetadata() {
  if (audio.value) {
    duration.value = audio.value.duration || 0
    if (audio.value.currentTime !== currentTime.value) {
      audio.value.currentTime = currentTime.value
    }
  }
}

function onSeek(e) {
  seeking.value = true
  currentTime.value = Number(e.target.value)
  if (audio.value) {
    audio.value.currentTime = currentTime.value
  }
  setTimeout(() => { seeking.value = false }, 100)
}

function formatTime(sec) {
  if (sec == null || isNaN(sec)) return '00:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function next() {
  if (props.onNext) props.onNext()
}

function prev() {
  if (props.onPrev) props.onPrev()
}

function onError() {
  errorMsg.value = '音频加载失败，请检查文件或格式。'
  isPlaying.value = false
}
</script>

<style scoped>
/* Copyright © C&L - 播放器样式 */
.music-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 30px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-sizing: border-box; /* 确保padding不会增加宽度 */
}

/* 为侧边栏中的播放器添加紧凑样式 */
.now-playing-sidebar .music-player {
  padding: 20px 15px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.now-playing-sidebar .visualizer-container {
  height: 60px;
  margin-bottom: 20px;
}

.now-playing-sidebar .player-controls {
  gap: 15px;
  margin-bottom: 15px;
}

.now-playing-sidebar .play-btn {
  width: 45px;
  height: 45px;
}

.now-playing-sidebar .prev-btn, 
.now-playing-sidebar .next-btn, 
.now-playing-sidebar .mode-btn {
  width: 35px;
  height: 35px;
}

.now-playing-sidebar .progress-container,
.now-playing-sidebar .volume-container {
  gap: 8px;
  margin: 12px 0;
}

.now-playing-sidebar .time {
  min-width: 40px;
  font-size: 12px;
}

.visualizer-container {
  width: 100%;
  height: 100px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-visualizer {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 5px;
}

.bar {
  width: calc(100% / 20);
  background: linear-gradient(to top, #667eea, #764ba2);
  border-radius: 3px 3px 0 0;
  transition: height 0.2s ease;
}

.player-controls {
  display: flex;
  gap: 25px;
  margin-bottom: 30px;
  align-items: center;
}

.control-btn {
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #764ba2;
  padding: 0;
  transition: all 0.2s ease;
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.play-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 10px 20px rgba(118, 75, 162, 0.2);
}

.prev-btn, .next-btn {
  width: 45px;
  height: 45px;
  color: #764ba2;
  font-size: 1.2rem;
}

.control-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

.progress-container {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 15px;
  margin: 20px 0;
}

.progress-bar-wrapper {
  flex: 1;
  height: 8px;
  position: relative;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.05);
}

.progress-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.progress-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(to right, #667eea, #764ba2);
  border-radius: 4px;
  pointer-events: none;
  transition: width 0.1s linear;
}

.progress-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
  padding: 0;
}

.time {
  font-size: 14px;
  color: #764ba2;
  min-width: 45px;
  text-align: center;
}

.error-message {
  color: #e53935;
  margin-top: 15px;
  padding: 10px 20px;
  background: rgba(229, 57, 53, 0.1);
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
}

/* 改进移动端样式 */
@media (max-width: 768px) {
  .music-player {
    padding: 15px 10px;
    width: 100%;
    border-radius: 16px;
    margin-bottom: 10px;
  }
  
  /* 控制按钮响应式布局 */
  .player-controls {
    display: flex;
    justify-content: center;
    flex-wrap: wrap; /* 允许在超小屏幕上按钮换行 */
    gap: 10px;
    margin-bottom: 10px;
    width: 100%;
  }
  
  /* 可视化效果响应式设计 */
  .visualizer-container {
    height: 40px;
    margin-bottom: 10px;
    width: 100%;
  }
  
  /* 进度条自适应 */
  .progress-container {
    width: 100%;
    gap: 8px;
  }
}

/* 超小屏幕适配 (小于375px) */
@media (max-width: 375px) {
  .music-player {
    padding: 12px 8px;
  }
  
  .play-btn {
    width: 40px;
    height: 40px;
  }
  
  .prev-btn, .next-btn {
    width: 30px;
    height: 30px;
  }
  
  .visualizer-container {
    height: 30px;
  }
  
  .time {
    font-size: 10px;
    min-width: 30px;
  }
}
</style>