const searchInput = document.getElementById("search-input");
const btn = document.getElementById("search-btn");
const videoBox = document.getElementById("video");
const searchList = document.getElementById("search-res-list");
const playlistVideo = document.getElementById("playlist");
const searchResContainer = document.querySelector('.search-res-container')

btn.addEventListener("click", () => {
  fetchData(searchInput.value);
});
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "da6d7bb386mshdd04159cb309f4dp1f7dfcjsn3df707758184",
    "X-RapidAPI-Host": "youtube138.p.rapidapi.com",
  },
};
const fetchData = (searchTerm) => {
  const url = `https://youtube138.p.rapidapi.com/search/?q=${searchTerm}&hl=en&gl=US`;
  const fetchData = fetch(url, options);
  fetchData
    .then((response) => response.json())
    .then((data) => {
      fetchedPlaylist(data.contents);
    });
};

const fetchedPlaylist = (result) => {
  searchList.innerHTML = "";
  const playlist = result.filter((filterData) => {
    return filterData.type === "playlist";
  });
  // console.log(playlist);
  playlist.forEach((items) => {
    // console.log(items);
    const searchListItems = document.createElement("li");
    searchListItems.className = "search-res-list_items";
    searchListItems.dataset.Playlistid = items.playlist.playlistId;
    searchListItems.textContent = items.playlist.title;
    searchList.append(searchListItems);
  });
  searchResContainer.classList.remove('hide')
  searchedPlaylist();
};

const searchedPlaylist = () => {
  const searchedItems = document.querySelectorAll(".search-res-list_items");
  searchedItems.forEach((playlistItem) => {
    playlistItem.addEventListener("click", () => {
      videoAccessor(playlistItem.dataset.Playlistid);
      searchResContainer.classList.add("hide")
      
    });
  });
};

const videoAccessor = (accessedId) => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'da6d7bb386mshdd04159cb309f4dp1f7dfcjsn3df707758184',
      'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
    }
  };
  
  fetch(`https://youtube138.p.rapidapi.com/playlist/videos/?id=${accessedId}&hl=en&gl=US`, options)
    .then(response => response.json())
    .then(res => {
      res.contents.forEach(v=>{
        const newEl = document.createElement('li')
        newEl.className = 'playlist-item'
        newEl.dataset.videoId=v.video.videoId
        newEl.textContent = v.video.title
        playlistVideo.append(newEl)
      })
      displayVideoElEvent()
})
    .catch(err => console.error(err));
}
const displayVideoElEvent = ()=>{
  const videoList = document.querySelectorAll('.playlist-item')
  videoList.forEach((vidEl)=>{
    vidEl.addEventListener("click",()=>{
      displayVideo(vidEl.dataset.videoId)
      videoBox.innerHTML=""
    })
  })
}


displayVideo=(vidId)=>{
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'da6d7bb386mshdd04159cb309f4dp1f7dfcjsn3df707758184',
      'X-RapidAPI-Host': 'youtube138.p.rapidapi.com'
    }
  };
  
  fetch(`https://youtube138.p.rapidapi.com/video/streaming-data/?id=${vidId}`, options)
    .then(response => response.json())
    .then(res => {
        const video = document.createElement('video')
        video.className = 'video'
        video.src =res.formats[1].url
        video.controls = true;
        video.muted = false;
        // video.height = 240; // in px
        // video.width = 320; // in px
        videoBox.append(video)
        video.play()

    })
    .catch(err => console.error(err));
}