<!-- Copyright © C&L -->
<script setup>
// Copyright © C&L
import MusicPlayer from './components/MusicPlayer.vue'
import SongList from './components/SongList.vue'

import { ref, onMounted, computed } from 'vue'

// Copyright © C&L - 数据定义
const songs = ref([])
const currentIndex = ref(0)
const playMode = ref('list') // 播放模式：'single'单曲循环, 'random'随机播放, 'list'列表循环

// SEO优化 - 动态更新页面标题和描述
const updateMetaTags = (songTitle) => {
  if (songTitle) {
    document.title = `${songTitle} - C&L音乐播放器`
    // 更新描述标签
    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', `正在播放: ${songTitle} - C&L音乐播放器提供高品质音乐在线欣赏，支持多种播放模式。`)
    }
  }
}

// Copyright © C&L - 计算属性
const isTitleLong = computed(() => {
  return songs.value[currentIndex.value]?.title?.length > 20
})

// Copyright © C&L - 事件处理函数
function handleSelect(idx) {
  currentIndex.value = idx
  // 更新SEO元标签
  if (songs.value[idx]) {
    updateMetaTags(songs.value[idx].title)
  }
}

function handleNext() {
  if (songs.value.length > 0) {
    if (playMode.value === 'random') {
      // 随机模式：随机选择一首歌
      const randomIndex = Math.floor(Math.random() * songs.value.length)
      currentIndex.value = randomIndex
    } else {
      // 列表循环模式：顺序播放下一首
      currentIndex.value = (currentIndex.value + 1) % songs.value.length
    }
    // 更新SEO元标签
    updateMetaTags(songs.value[currentIndex.value].title)
  }
}

function handlePrev() {
  if (songs.value.length > 0) {
    if (playMode.value === 'random') {
      // 随机模式：随机选择一首歌
      const randomIndex = Math.floor(Math.random() * songs.value.length)
      currentIndex.value = randomIndex
    } else {
      // 列表循环模式：顺序播放上一首
      currentIndex.value = (currentIndex.value - 1 + songs.value.length) % songs.value.length
    }
    // 更新SEO元标签
    updateMetaTags(songs.value[currentIndex.value].title)
  }
}

function handleSongEnd() {
  if (playMode.value === 'single') {
    // 单曲循环模式：重新播放当前歌曲
    // 不改变 currentIndex，MusicPlayer 会自动重新播放
  } else {
    // 其他模式：播放下一首
    handleNext()
  }
}

function setPlayMode(mode) {
  playMode.value = mode
}

// Copyright © C&L - 生命周期钩子
onMounted(async () => {
  // 通过 fetch 获取 public 目录下的 music-list.json 文件
  const res = await fetch('/music-list.json')
  if (res.ok) {
    const list = await res.json()
    songs.value = list
    // 初始加载时更新SEO元标签
    if (list.length > 0 && list[currentIndex.value] && list[currentIndex.value].title) {
      updateMetaTags(list[currentIndex.value].title)
    }
  }
})
</script>

<template>
  <!-- Copyright © C&L - 应用主结构 -->
  <div class="app-wrapper">
    <div class="app-bg">
      <div class="app-container">
        <h1 class="main-title">C&L</h1>
        
        <div class="side-layout">
          <!-- 内容区 - 直接显示，不再使用侧边栏 -->
          <div class="content-area">
            <div class="content-header">
              <div class="play-mode-controls">
                <button 
                  class="mode-btn" 
                  :class="{ active: playMode === 'single' }" 
                  @click="setPlayMode('single')" 
                  title="单曲循环"
                >
                  <span>单曲循环</span>
                </button>
                <button 
                  class="mode-btn" 
                  :class="{ active: playMode === 'random' }" 
                  @click="setPlayMode('random')" 
                  title="随机播放"
                >
                  <span>随机播放</span>
                </button>
                <button 
                  class="mode-btn" 
                  :class="{ active: playMode === 'list' }" 
                  @click="setPlayMode('list')" 
                  title="列表循环"
                >
                  <span>列表循环</span>
                </button>
              </div>
            </div>
            
            <!-- 播放器 -->
            <div v-if="songs.length > 0" class="now-playing-area">
              <div class="song-info">
                <span class="label">正在播放:</span>
                <!-- 长文本使用无缝滚动容器 -->
                <div class="marquee-wrapper" v-if="isTitleLong">
                  <div class="marquee-content">
                    <span class="song-title">{{ songs[currentIndex].title }}</span>
                    <span class="song-title spacer">-</span>
                    <span class="song-title">{{ songs[currentIndex].title }}</span>
                  </div>
                </div>
                <!-- 短文本使用普通显示 -->
                <div v-else class="normal-text">
                  <span class="song-title">{{ songs[currentIndex].title }}</span>
                </div>
              </div>
              
              <MusicPlayer 
                :src="songs[currentIndex].src"
                :title="songs[currentIndex].title"
                :on-next="handleNext"
                :on-prev="handlePrev"
                :on-ended="handleSongEnd"
                :has-next="songs.length > 1"
                :has-prev="songs.length > 1"
              />
            </div>
            
            <SongList 
              :songs="songs" 
              :currentIndex="currentIndex" 
              @select="handleSelect" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Copyright © C&L - 样式定义 */
.app-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  /* 添加安全区域的内边距 */
  padding-top: env(safe-area-inset-top, 0);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.app-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  padding-top: calc(70px + env(safe-area-inset-top, 0)); /* 增加顶部内边距 */
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0));
  padding-left: calc(20px + env(safe-area-inset-left, 0));
  padding-right: calc(20px + env(safe-area-inset-right, 0));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.app-container {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  padding: 30px;
  padding-top: 40px; /* 增加顶部内边距 */
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  margin-top: 20px; /* 增加顶部外边距 */
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 30px 0;
  color: #5a36b5;
  text-align: center;
  background: linear-gradient(to right, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  width: 100%;
}

.side-layout {
  display: flex;
  position: relative;
  width: 100%;
  justify-content: center;
}

.content-area {
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box; /* 确保padding不会增加宽度 */
}

.content-header {
  margin-bottom: 20px;
  border-bottom: 2px solid rgba(118, 75, 162, 0.2);
  padding-bottom: 10px;
  width: 100%;
  text-align: center;
}

.play-mode-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.mode-btn {
  background: rgba(118, 75, 162, 0.1);
  border: 1px solid rgba(118, 75, 162, 0.3);
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 0.9rem;
  color: #5a36b5;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn:hover {
  background: rgba(118, 75, 162, 0.2);
}

.mode-btn.active {
  background: linear-gradient(to right, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

@media (max-width: 480px) {
  .mode-btn {
    padding: 5px 8px;
    font-size: 0.8rem;
  }
}
.content-header h2 {
  font-size: 1.5rem;
  color: #5a36b5;
  margin: 0;
}

.now-playing-area {
  margin-bottom: 25px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 14px;
  overflow: hidden;
  width: 100%;
  max-width: 450px;
  box-sizing: border-box; /* 确保不会溢出容器 */
}

.now-playing-area .song-info {
  background: linear-gradient(to right, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
  padding: 18px 15px;
  margin-bottom: 0;
  border-radius: 14px 14px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 70px; /* 确保有足够的高度显示内容 */
  box-sizing: border-box; /* 确保padding不会增加高度 */
}

.now-playing-area .label {
  font-size: 0.9rem;
  color: #667eea;
  margin-bottom: 5px;
  display: block;
}

.now-playing-area .normal-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

/* 无缝滚动容器 */
.now-playing-area .marquee-wrapper {
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
}

.now-playing-area .marquee-content {
  display: inline-flex;
  white-space: nowrap;
  animation: scrollText 20s linear infinite;
}

.now-playing-area .song-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: #764ba2;
}

.now-playing-area .song-title.spacer {
  margin: 0 20px;
}

@keyframes scrollText {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%); /* 只滚动一半就重置 */
  }
}

/* 响应式样式 */
/* PC端样式 - 增加顶部内边距确保内容完全显示 */
@media (min-width: 769px) {
  .app-bg {
    padding-top: calc(100px + env(safe-area-inset-top, 0)); /* 增加PC端顶部内边距 */
  }
}

@media (max-width: 768px) {
  .app-bg {
    padding: 10px;
    padding-top: calc(20px + env(safe-area-inset-top, 0)); /* 保持移动端顶部内边距不变 */
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0));
    padding-left: calc(10px + env(safe-area-inset-left, 0)); 
    padding-right: calc(10px + env(safe-area-inset-right, 0));
    align-items: flex-start;
    height: 100%;
    min-height: 100%;
  }
  
  .app-container {
    padding: 20px 10px;
    border-radius: 16px;
    max-width: 100%;
    margin: 0;
    height: auto;
    box-sizing: border-box; /* 确保padding不会增加宽度 */
  }
  
  .main-title {
    font-size: 1.8rem;
    margin-bottom: 15px;
  }
  
  .side-layout {
    width: 100%;
  }
  
  .content-area {
    height: auto;
    overflow: visible;
    padding: 15px 10px;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    width: calc(100% - 20px);
    margin: 0 10px;
  }

  .content-header {
    margin-bottom: 12px;
  }
  
  .now-playing-area {
    max-width: 100%; /* 在移动端占满可用宽度 */
    margin-bottom: 15px;
  }
  
  .now-playing-area .music-player {
    padding: 15px 10px;
    border-radius: 12px;
  }
  
  /* 调整播放器组件和歌曲列表的移动端样式 */
  .song-list {
    max-width: 100%;
  }
  
  /* 确保可视化效果在小屏幕上不会太高 */
  .now-playing-area .visualizer-container {
    height: 50px;
    margin-bottom: 15px;
  }
  
  .now-playing-area .song-title {
    font-size: 1.2rem;
  }
  
  .now-playing-area .marquee-content {
    animation-duration: 12s; /* 移动端速度稍快 */
  }
}

/* 超小屏幕适配 (小于375px) */
@media (max-width: 375px) {
  .app-container {
    padding: 15px 8px;
  }
  
  .content-area {
    padding: 12px 8px;
    width: calc(100% - 16px);
    margin: 0 8px;
  }
  
  .main-title {
    font-size: 1.6rem;
    margin-bottom: 12px;
  }
}

/* 为SongList组件设置统一宽度 */
.song-list {
  width: 100%;
  max-width: 450px;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}
</style>
