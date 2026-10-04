const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const player = $('.player');
const playlist = $('.playlist');
const progress = $('#progress');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [{
        name: "Nếu Như Ta Chẳng Còn (feat. AAP Ướt Mi)",
        singer: "MCK",
        path: "./assets/music/Nếu Như Ta Chẳng Còn (feat. AAP Ướt Mi).mp3",
        image: "./assets/img/cover.jpg"
    },
    {
        name: "Sun kiss",
        singer: "Tuide",
        path: "./assets/music/Sk.mp3",
        image: "./assets/img/sk.jpg"
    },
    {
        name: "String 57th & 9th",
        singer: "Sting",
        path: "./assets/music/String-57th-9th.mp3",
        image: "./assets/img/cover.jpg"
    },
    {
        name: "String 57th & 9th",
        singer: "Sting",
        path: "./assets/music/String-57th-9th.mp3",
        image: "./assets/img/cover.jpg"
    },
    {
        name: "String 57th & 9th",
        singer: "Sting",
        path: "./assets/music/String-57th-9th.mp3",
        image: "./assets/img/cover.jpg"
    }



    ],
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
<div class="song ${index === this.currentIndex ? 'active' : ''} "data-index="${index}">                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        //xu ly quay / dung CD
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        //xu ly phong to / thu nho CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
        }

        //khi song duoc play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        //khi song duoc pause
        audio.onpause = function () {
            _this.isPlaying = false;
            cdThumbAnimate.pause();
            player.classList.remove('playing');
        }

        //khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        //Khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();

            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        audio.onended = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else if (_this.isRepeat) {
                audio.currentTime = 0;
            }
            else {
                _this.nextSong();
            }

            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                if (e.target.closest('.option')) {
                }
            }
        },

            repeatBtn.onclick = function (e) {
                _this.isRepeat = !_this.isRepeat;
                _this.setConfig('isRepeat', _this.isRepeat);
                repeatBtn.classList.toggle('active', _this.isRepeat);
            }
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            if (this.currentIndex === 0 || this.currentIndex === 1) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }
            else {
                $('.song.active').scrollIntoView({
                    alignment: 'nearest',
                    behavior: 'smooth'
                });
            }
        }, 800);
    },

    start: function () {
        this.loadConfig();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }


}

app.start();