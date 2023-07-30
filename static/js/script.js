var currentAudio = null;
var progressBar = null;
var playPauseButton = null;
var timeElement = null;
function showEmotion() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var response = JSON.parse(this.responseText);
      document.getElementById("emotion-label").innerHTML = response.emotion;
      var songsHtml = "";
      for (var i = 0; i < response.songs.length; i++) {
        var song = response.songs[i];
        songsHtml += '<div class="song-item">';
        songsHtml += '<img class="cover-photo" src="/static/covers/' + song.cover_photo +'" onclick="playSong(this, \'/static/audio/' + song.audio_file + '\')">';
        songsHtml += '<p class="song-title">' + song.title + "</p>";
        songsHtml += "</div>";
      }
      document.getElementById("songs-list").innerHTML = songsHtml;
    }
  };
  xhttp.open("GET", "/get_emotion", true);
  xhttp.send();
}
function playSong(coverPhoto, audioFile) {
  if (currentAudio !== null && !currentAudio.paused) {
    currentAudio.pause();
  }

  if (currentAudio && currentAudio.src === audioFile) {
    currentAudio.play();
    return;
  }

  currentAudio = new Audio(audioFile);
  currentAudio.play();
 

  progressBar = document.getElementById("progress");
  playPauseButton = document.getElementById("play-pause");
  playPauseButton.src = "/static/images/pause.png";
  timeElement = document.getElementById("time");

  currentAudio.addEventListener("timeupdate", updateProgress);
  currentAudio.addEventListener("ended", handleAudioEnded);
  playPauseButton.addEventListener("click", togglePlayPause);
}


function togglePlayPause() {
  if (currentAudio.paused) {
    currentAudio.play();
    playPauseButton.src = "/static/images/pause.png";
  } else {
    currentAudio.pause();
    playPauseButton.src = "/static/images/play.png";
  }
}

function updateProgress() {
  var progress = (currentAudio.currentTime / currentAudio.duration) * 100;
  progressBar.style.width = progress + "%";

  var currentTime = formatTime(currentAudio.currentTime);
  var duration = formatTime(currentAudio.duration);
  timeElement.textContent = currentTime + " / " + duration;
}

function handleAudioEnded() {
  progressBar.style.width = "0";
}

function formatTime(time) {
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time % 60);
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return minutes + ":" + seconds;
}