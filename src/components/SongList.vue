<!-- Copyright © C&L -->
<template>
  <!-- Copyright © C&L - 歌曲列表组件 -->
  <div class="song-list">
    <div class="song-list-header">歌曲列表</div>
    <ul>
      <li 
        v-for="(song, idx) in songs" 
        :key="song.src" 
        :class="{active: idx === currentIndex}" 
        @click="selectSong(idx)"
      >
        <div class="song-item">
          <span class="song-number">{{ idx + 1 }}.</span>
          
          <!-- 当前播放歌曲使用滚动效果 -->
          <div v-if="idx === currentIndex" class="marquee-wrapper">
            <div class="marquee-content">
              <span class="song-title">{{ song.title }}</span>
              <span class="spacer">-</span>
              <span class="song-title">{{ song.title }}</span>
            </div>
          </div>
          
          <!-- 非播放歌曲使用普通显示 -->
          <span v-else class="song-title">{{ song.title }}</span>
          
          <span v-if="idx === currentIndex" class="playing-indicator">正在播放</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
// Copyright © C&L
import { ref, computed } from 'vue'

// Copyright © C&L - 组件属性定义
const props = defineProps({
  songs: { type: Array, required: true },
  currentIndex: { type: Number, default: 0 }
})

const emit = defineEmits(['select'])

// Copyright © C&L - 事件处理函数
function selectSong(idx) {
  emit('select', idx)
}
</script>

<style scoped>
/* Copyright © C&L - 歌曲列表样式 */
.song-list {
  width: 100%;
  border-radius: 12px;
  max-height: 500px;
  overflow-y: auto;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 10px;
}

.song-list-header {
  font-size: 16px;
  font-weight: bold;
  color: #764ba2;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(118, 75, 162, 0.2);
}

.song-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.song-list li {
  padding: 10px;
  cursor: pointer;
  margin: 3px 0;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.song-item {
  display: flex;
  align-items: center;
}

.song-number {
  margin-right: 10px;
  color: #666;
  min-width: 25px;
}

.song-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #444;
}

/* 滚动效果容器 */
.marquee-wrapper {
  flex: 1;
  overflow: hidden;
  max-width: 60%;
}

/* 滚动内容 */
.marquee-content {
  display: inline-flex;
  white-space: nowrap;
  animation: scrollText 10s linear infinite;
}

/* 滚动动画 */
@keyframes scrollText {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* 分隔符样式 */
.spacer {
  margin: 0 15px;
  color: #764ba2;
}

.playing-indicator {
  color: #764ba2;
  font-size: 12px;
  background-color: rgba(118, 75, 162, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 10px;
}

.song-list li:hover {
  background-color: rgba(118, 75, 162, 0.1);
}

.song-list li.active {
  background-color: rgba(118, 75, 162, 0.2);
}

.song-list li.active .song-title {
  color: #764ba2;
  font-weight: 600;
}

/* 滚动条样式 */
.song-list::-webkit-scrollbar {
  width: 6px;
}

.song-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.song-list::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #667eea, #764ba2);
  border-radius: 10px;
}

@media (max-width: 768px) {
  .song-list {
    width: 100%;
    max-height: none;
  }
  
  .song-list li {
    padding: 8px 10px;
  }
  
  .song-number {
    min-width: 20px;
  }
  
  .marquee-wrapper {
    max-width: 50%;
  }
  
  .marquee-content {
    animation-duration: 8s;
  }
}

@media (max-width: 375px) {
  .song-list li {
    padding: 6px 8px;
  }
  
  .song-title {
    font-size: 14px;
  }
  
  .playing-indicator {
    font-size: 10px;
    padding: 1px 6px;
  }
  
  .marquee-wrapper {
    max-width: 40%;
  }
  
  .marquee-content {
    animation-duration: 6s;
  }
}
</style>