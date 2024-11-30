const API_KEY = "AIzaSyB9A9V51HpMulQfyx0yJ3FP-yRQi94UoCQ"; 
const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=music&type=video&key=${API_KEY}`;

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    console.log("YouTube Data:", data);
  })
  .catch(error => {
    console.error("Error fetching YouTube API:", error);
  });
