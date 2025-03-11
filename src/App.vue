<script setup>
import YoutubePlayer from './components/YoutubePlayer.vue'

const playlist = [
  'dQw4w9WgXcQ', // Пример ID видео
  'jNQXAC9IVRw'  // Можете добавить свои ID видео
];
</script>

<template>
  <div class="app-container">
    <h1>YouTube Плеер</h1>
    <YoutubePlayer :playlist="playlist" />
  </div>
</template>

<style scoped>
.app-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}
</style>
