const musicsData = [
  { title: "Solar", artist: "Betical", id: 1 },
  { title: "Electric-Feel", artist: "TEEMID", id: 2 },
  { title: "Aurora", artist: "SLUMB", id: 3 },
  { title: "Lost-Colours", artist: "Fakear", id: 4 },
];

const titleMusic = document.querySelector('.left h1');
const artistMusic = document.querySelector('.left p');
const idMusic = document.querySelector('.right span');
const imgMusique = document.querySelector('.img-musique img')
const audioMusic = document.querySelector('audio');
let count = 0;

const shuffleMusic = document.querySelector('.shuffle');
const prevMusic = document.querySelector('.prev-btn');
const playMusic = document.querySelector('.play-btn');
const nextMusic = document.querySelector('.next-btn');

const displayCurrentTime = document.querySelector(".current-time");
const durationTime = document.querySelector(".duration-time");
const progressBar = document.querySelector(".progress-bar");

// -------PLAY AND PAUSE MUSIC
playMusic.addEventListener('click', () => {
  if(count == 0){
    count = 1;
    audioMusic.play();
    playMusic.innerHTML= `<img src="./ressources/icons/pause-icon.svg" alt="pause icon">`;
  } else {
    count = 0
    audioMusic.pause();
    playMusic.innerHTML= `<img src="./ressources/icons/play-icon.svg" alt="play icon">`;
  }
  
})

// ---------INDEX OF THE MUSIC
let currentMusicIndex = 1;

// Next music
[nextMusic, prevMusic].forEach(btn => btn.addEventListener("click", changeSong))
audioMusic.addEventListener("ended", changeSong)

function changeSong(e){

  if(shuffleToggle){
    playAShuffleSong();
    return;
  }

  e.target.classList.contains("next-btn") || e.type === "ended" ? currentMusicIndex++ : currentMusicIndex--;
  
  if(currentMusicIndex < 1) currentMusicIndex = musicsData.length;
  else if(currentMusicIndex > musicsData.length) currentMusicIndex = 1;

  populateUI(musicsData[currentMusicIndex - 1]);
  audioMusic.play();
  playMusic.innerHTML= `<img src="./ressources/icons/pause-icon.svg" alt="pause icon">`;
}
// shuffle
let shuffle =  false;
shuffleMusic.addEventListener("click", shuffleToggle);

function shuffleToggle(){
  shuffleMusic.classList.toggle("active");
  shuffle = !shuffle;
};

function playAShuffleSong(){
  const musicsWithoutCurrentSong = musicsData.filter(el => el.id !== currentMusicIndex);
  const randomMusic = musicsWithoutCurrentSong[Math.trunc(Math.random() * musicsWithoutCurrentSong.length)];

  currentMusicIndex = randomMusic.id;
  populateUI(randomMusic);
  audioMusic.play();
  playMusic.innerHTML= `<img src="./ressources/icons/pause-icon.svg" alt="pause icon">`;
}


// --------DISPLAY DATA MUSIC
function populateUI({title, artist}){
  titleMusic.textContent = title;
  artistMusic.textContent = artist;
  imgMusique.src = `./ressources/thumbs/${title}.png`;
  audioMusic.src = `./ressources/music/${title}.mp3`;
  idMusic.textContent = `${currentMusicIndex}/${musicsData.length}`
}

populateUI(musicsData[currentMusicIndex - 1]);

audioMusic.addEventListener("loadeddata", fillDurationVariables);

let totalDuration;
let current;

function fillDurationVariables(){
  totalDuration = audioMusic.duration;
  current = audioMusic.currentTime;

  formatValue(current, displayCurrentTime);
  formatValue(totalDuration, durationTime);

}

function formatValue(value, element){
  const currentMin = Math.trunc(value / 60);
  let currentSec = Math.trunc(value % 60);

  if(currentSec < 10){
    currentSec = `0${currentSec}`
  }

  element.textContent = `${currentMin}:${currentSec}`
}

// PROGRESS BAR
audioMusic.addEventListener("timeupdate", updateProgres)

function updateProgres(e){
  current = e.srcElement.currentTime;
  formatValue(current, displayCurrentTime);

  const progresValue = current / totalDuration;
  progressBar.style.transform = `scaleX(${progresValue})`
}

const progressBarContainer = document.querySelector(".progress-container");

let rect = progressBarContainer.getBoundingClientRect();
let width = rect.width;

console.log(rect);

progressBarContainer.addEventListener("click", setProgress)

function setProgress(e){
  const x = e.clientX - rect.left;
  audioMusic.currentTime = (x / width) * totalDuration;
}

