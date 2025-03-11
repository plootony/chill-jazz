import axios from 'axios';

export default async function handler(req, res) {
  // Установим правильные CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Если это OPTIONS запрос, вернем 200
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { videoIds } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!videoIds) {
    return res.status(400).json({ error: 'Video IDs are required' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'YouTube API key is not configured' });
  }

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`,
      {
        params: {
          part: 'snippet,contentDetails',
          id: videoIds,
          key: apiKey
        }
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    return res.status(500).json({ 
      error: 'Failed to fetch video data',
      details: error.response?.data || error.message 
    });
  }
} 