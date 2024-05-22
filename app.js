const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const repeatButton = document.getElementById('repeat');
const shuffleButton = document.getElementById('shuffle');
const audio = document.getElementById('audio');
const songImg = document.getElementById('song-image');
const songName = document.getElementById('song-name');
const songArtist = document.getElementById('song-artist');
const pauseButton = document.getElementById('pause');
const playButton = document.getElementById('play');
const playlistButton = document.getElementById('playlist');
const maxDuration = document.getElementById('max-duration');
const currentTimeRef = document.getElementById('current-time');
const progressBar = document.getElementById('progress-bar');
const playlistContainer = document.getElementById('playlist-container');
const closeButton = document.getElementById('close-button');
const playlistSongs = document.getElementById('playlist-songs');
const currentProgress = document.getElementById('current-progress');

// index for song
let index;

// initiality loop= true
let loop = true;

const songList = [
    {
        name: "Джованна",
        link: "djavanna.mp3",
        artist: "Enrasta",
        img: "./img/photo1.jpg",
    },
    {
        name: "Как ты там",
        link: "kakTiTam.mp3",
        artist: "Asiya",
        img: "./img/photo2.jpg",
    },
    {
        name: "Зачем ты?",
        link: "zachemTi.mp3",
        artist: "Nargis",
        img: "./img/photo3.jpg",
    },
    {
        name: "Джованнаa",
        link: "djavanna.mp3",
        artist: "Enrasta",
        img: "./img/photo4.jpg",
    },
    {
        name: "Как ты там",
        link: "kakTiTam.mp3",
        artist: "Asiya",
        img: "./img/photo2.jpg",
    },
];


// events object
let events = {
    mouse: {
        click: 'click',
    },
    touch: {
        click: 'touchstart',
    },
};

let deviceType = "";

// detect touch device

const isTouchDevice = () => {
    try {
        document.createEvent('TouchEvent');
        deviceType = "touch";
        return true;
    }
    catch (e) {
        deviceType = "mouse";
        return false;
    }
};

const timeFormatter = (timeInput) => {
    let minute = Math.floor(timeInput / 60);
    minute = minute < 10 ? '0' + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? '0' + second : second;
    return `${minute}:${second}`;
}

// set song

const setSong = (arrayIndex) => {
    let {name, link, artist, img} = songList[arrayIndex];
    audio.src = link;
    songName.innerHTML = name;
    songArtist.innerHTML = artist;
    songImg.src = img;
    audio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(audio.duration)
    };
}

// play song 
const playAudio = () => {
    audio.play();
    pauseButton.classList.remove('hide');
    playButton.classList.add('hide');
}


// repeat button 
repeatButton.addEventListener('click', () => {
    if (repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active');
        audio.loop = false;
    }
    else {
        repeatButton.classList.add('active');
        audio.loop = true;
    }
});


// next song

const nextSong = () => {
    if (loop) {
        if (index == songList.length - 1) {
            index = 0;
        }
        else {
            index += 1;
        }
        setSong(index);
        playAudio();
    }
    else {
        let randIndex = Math.floor(Math.random() * songList.length);
        console.log(randIndex);
        setSong(randIndex);
        playAudio();
    }
} 

// pause song
const pauseAudio = () => {
    audio.pause();
    pauseButton.classList.add('hide');
    playButton.classList.remove('hide');
}

// previouse song
const previouseSong = () => {
    if (index > 0) {
        pauseAudio();
        index -= 1;
    }
    else {
        index = songList.length - 1;
    }
    setSong(index);
}


// play button
playButton.addEventListener('click', playAudio);


// next button
nextButton.addEventListener('click', nextSong);

// pause button 
pauseButton.addEventListener('click', pauseAudio);


// prev button 
prevButton.addEventListener('click', previouseSong);

// if user clicks on progress bar
isTouchDevice();

progressBar.addEventListener(events[deviceType].click, (event) => {
    let coordStart = progressBar.getBoundingClientRect().left;

    let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;

    let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

    currentProgress.style.width = progress * 100 + '%';

    // set time
    audio.currentTime = progress * audio.duration;

    // play
    audio.play();
    pauseButton.classList.remove('hide');
    playButton.classList.add('hide');
})


setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + '%';
})


audio.addEventListener('timeupdate', () => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
})

// creates playlist
const initializePlaylist = () => {
    for ( let i in songList) {
        playlistSongs.innerHTML += `
        <li class="playlistSong" onclick= 'setSong(${i})'>
             <div class="playlist-image-container">
                 <img src="${songList[i].img}" alt="">
             </div>
             
            <div class="playlist-song-details">
                 <span id="playlist-song-name">${songList[i].name}</span>
                 <span id="playlist-song-artist-album">${songList[i].artist}</span>

           </div>
</li>
        `
    }
}

playlistButton.addEventListener('click', () => {
    playlistContainer.classList.remove('hide');
})

closeButton.addEventListener('click', () => {
    playlistContainer.classList.add('hide');
})


window.onload = () => {
    index = 0;
    setSong(index);
    initializePlaylist();
}

// next song when current song ends
audio.onended = () => {
    nextSong();
}

// shuffle song
shuffleButton.addEventListener('click', () => {
    if (shuffleButton.classList.contains('active')) {
        shuffleButton.classList.remove('active');
        loop = true;
    }
    else {
        shuffleButton.classList.add('active');
        loop = false;
    }
})