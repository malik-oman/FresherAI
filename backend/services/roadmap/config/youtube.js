import "dotenv/config";
import axios from "axios";

const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

const searchVideo = async (topic) => {
  try {
    let query = `Full Stack ${topic}`;

    let { data } = await axios.get(BASE_URL, {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: query,
        maxResults: 5, 
        type: "video",
      },
    });


    const video = data.items.find((v) =>
      v.snippet.channelTitle.toLowerCase().includes("full stack")
    );

    if (video) {
      return {
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      };
    }

    query = `${topic} Tutorial`;

    let { data: tutorialData } = await axios.get(BASE_URL, {
      params: {
        key: process.env.YOUTUBE_API_KEY,
        part: "snippet",
        q: query,
        maxResults: 1,
        type: "video",
      },
    });

    if (tutorialData.items.length > 0) {
      const video = tutorialData.items[0];

      return {
        title: video.snippet.title,
        channel: video.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      };
    }

    return null;
  } catch (error) {
    
    console.log(
      "YouTube API error:",
      error.response?.status,
      error.response?.data?.error?.message || error.message
    );
    return null;
  }
};

export default searchVideo;