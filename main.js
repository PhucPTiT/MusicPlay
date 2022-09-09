const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const player = $('.player')

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const playBtn = $('.btn-toggle-play')
const audio = $('#audio')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    saveLoopMusic: [],
    songs: [
        {
            name:  "song1",
            singer: "Aland",
            path: './accsets/mp3/song1.mp3',
            img: "./accsets/img/song1.jpg"
        },
        {
            name:  "song2",
            singer: "Botman",
            path: './accsets/mp3/song2.mp3',
            img: "./accsets/img/song2.jpg"
        },
        {
            name:  "song3",
            singer: "Marguie",
            path: './accsets/mp3/song3.mp3',
            img: "./accsets/img/song3.jpg"
        },
        {
            name:  "song4",
            singer: "Sancho",
            path: './accsets/mp3/song4.mp3',
            img: "./accsets/img/song4.jpg"
        },
        {
            name:  "song5",
            singer: "Nacho",
            path: './accsets/mp3/song5.mp3',
            img: "./accsets/img/song5.jpg"
        },
        {
            name:  "song6",
            singer: "Degea",
            path: './accsets/mp3/song6.mp3',
            img: "./accsets/img/song6.jpg"
        },
        {
            name:  "song7",
            singer: "Thumbail",
            path: './accsets/mp3/song7.mp3',
            img: "./accsets/img/song7.jpg"
        },
        {
            name:  "song8",
            singer: "Atony",
            path: './accsets/mp3/song8.mp3',
            img: "./accsets/img/song8.jpg"
        } 
    ],
    render: function() {
        const htmls = this.songs.map((song,index) =>{
            return `
                <div class="song" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}')"></div>
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
        $('.playlist').innerHTML = htmls.join('')
        this.saveLoopMusic.push(this.currentIndex)
    },
    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth
        //  zoom in and zoom out 
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // when song play and pause

        playBtn.onclick = function() {
            let check = true;
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
            audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdRotate.play()
            }
            audio.onpause = function() {
                _this.isPlaying = false;
                player.classList.remove('playing') 
                cdRotate.pause()
            }
        }

        // when time song be changed
      
        audio.ontimeupdate = function() {
            if(audio.duration) {
                progress.value = Math.floor(audio.currentTime / audio.duration * 100)
            }
        }
       
       
        
       // when song rewind
       
        progress.onchange = function(e) {
            console.log(e.target.value)
            audio.currentTime = audio.duration / 100 * e.target.value
        }
        // cd rotate
        const cdRotate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000,
            iterations : Infinity
        })
        cdRotate.pause()

        // when next song 
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            }
            _this.nextSong()
            audio.play()
            
        }

        // when preview song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            }
            _this.prewSong()
            audio.play()
        }
        //when on or off random song button
        randomBtn.onclick = function() {
            if(_this.isRepeat) {
                _this.isRepeat = false
                repeatBtn.classList.toggle('active',_this.isRepeat)
            } 
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
        }
        // when on or off repeat song button
        repeatBtn.onclick = function() {
            if(_this.isRandom) {
                _this.isRandom = false
                randomBtn.classList.toggle('active',_this.isRandom)
            }
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        // when song ended 
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        // when click in to playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode) {
                _this.currentIndex = Number(songNode.getAttribute('data-index'))
                _this.loadCurrentSong()
                audio.play()
            }
        }
    },
    loadCurrentSong : function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
        this.songActive()
    },
    defineProperties : function() {
        Object.defineProperty(this, 'currentSong', {
            get : function() {
                return this.songs[this.currentIndex]
            }
        }) 
    },
    nextSong : function() {
        if(!this.isRandom) {
            this.currentIndex++
        }
        let topScroll =  this.currentIndex * 75;
        window.scrollTo({ top:topScroll, behavior: 'smooth' });
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.loadCurrentSong()
    },
    prewSong: function() {
        if(!this.isRandom) {
            this.currentIndex--
        }
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1 
        }
        let topScroll = this.currentIndex * 75
        window.scrollTo({ top:topScroll, behavior: 'smooth' })
        this.loadCurrentSong()
    },
    randomSong: function() {
        if(this.saveLoopMusic.length === this.songs.length) {
            this.saveLoopMusic.splice(0, this.songs.length)
        }
        let newCurrentIndex
        do{
            newCurrentIndex = Math.floor(Math.random()*this.songs.length)
        }
        while(this.saveLoopMusic.find(a => a===newCurrentIndex)==0 ||this.saveLoopMusic.find(a => a===newCurrentIndex))
        this.currentIndex = newCurrentIndex
        this.saveLoopMusic.push(this.currentIndex)
        this.loadCurrentSong() 
    },
    songActive : function() {
        const songsActive = $$('.song')
        $(".song.active")?.classList.remove("active")
        songsActive[this.currentIndex].classList.add('active')
    },
    start : function() {
        this.defineProperties()
        this.render()
        this.handleEvents()
        this.loadCurrentSong()
    }
}

app.start();    