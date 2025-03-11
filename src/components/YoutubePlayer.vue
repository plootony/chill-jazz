<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  playlist: {
    type: Array,
    required: true
  }
});

const currentVideo = ref(null);
const videoData = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

const fetchVideoData = async () => {
  try {
    const videoIds = props.playlist.join(',');
    const response = await fetch(`/api/youtube?videoIds=${videoIds}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No videos found');
    }
    
    videoData.value = data.items;
    currentVideo.value = videoData.value[0];
  } catch (error) {
    console.error('Error fetching video data:', error);
    isLoading.value = false;
    errorMessage.value = error.message || 'Failed to fetch video data';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchVideoData();
});
</script>

<template>
  <div class="youtube-player">
    <div v-if="isLoading" class="loading">
      Загрузка...
    </div>
    
    <div v-else-if="currentVideo" class="player-container">
      <iframe
        :src="`https://www.youtube.com/embed/${currentVideo.id}`"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      
      <div class="playlist">
        <div
          v-for="video in videoData"
          :key="video.id"
          class="playlist-item"
          :class="{ active: video.id === currentVideo.id }"
          @click="currentVideo = video"
        >
          <img :src="video.snippet.thumbnails.default.url" :alt="video.snippet.title">
          <div class="video-info">
            <h3>{{ video.snippet.title }}</h3>
            <p>{{ video.snippet.channelTitle }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.youtube-player {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.player-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  padding: 20px;
}

iframe {
  width: 100%;
  aspect-ratio: 16/9;
}

.playlist {
  height: 600px;
  overflow-y: auto;
  background: #f5f5f5;
  border-radius: 8px;
}

.playlist-item {
  display: flex;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.playlist-item:hover {
  background-color: #e0e0e0;
}

.playlist-item.active {
  background-color: #d0d0d0;
}

.playlist-item img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  margin-right: 10px;
}

.video-info {
  flex: 1;
}

.video-info h3 {
  font-size: 14px;
  margin: 0 0 5px 0;
}

.video-info p {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .player-container {
    grid-template-columns: 1fr;
  }
  
  .playlist {
    height: 300px;
  }
}
</style> 