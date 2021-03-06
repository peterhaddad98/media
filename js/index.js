"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Particle = function () {
  function Particle(index, parent) {
    _classCallCheck(this, Particle);

    this.index = index;
    this.parent = parent;
    this.minSize = 5;
    this.init();
  }

  Particle.prototype.init = function init() {
    this.freqVal = this.parent.freqData[this.index] * 0.01;
    this.size = this.freqVal * ((this.parent.dimensions.x + this.parent.dimensions.y) * 0.5) * 0.0125 + this.minSize;
    this.position = new Vector2(Math.random() * this.parent.dimensions.x, this.parent.dimensions.y + this.size);
    this.velocity = new Vector2(2 - Math.random() * 4, 0);
  };

  Particle.prototype.update = function update() {
    this.freqVal = this.parent.freqData[this.index] * 0.01;

    this.size = this.freqVal * 20 + this.minSize;

    this.hue = this.index / this.parent.bufferLen * 360 + 120 + this.parent.tick / 6;
    this.saturation = this.freqVal * 50;
    this.alpha = this.freqVal * 0.3;

    this.fill = "hsla(" + this.hue + ", " + this.saturation + "%, 50%, " + this.alpha + ")";
    this.lift = Math.pow(this.freqVal, 3);

    this.position.subY(this.lift + 0.5);
    this.position.add(this.velocity);

    this.checkBounds();
  };

  Particle.prototype.checkBounds = function checkBounds() {
    if (this.position.y < -this.size || this.position.x < -this.parent.dimensions.x * 0.15 || this.position.x > this.parent.dimensions.x * 1.15) {
      this.init();
    }
  };

  return Particle;
}();

var App = function () {
  function App() {
    var _this = this;

    _classCallCheck(this, App);

    this.globalMovement = new Vector2();
    this.initCanvas();
    this.initAudio();
    this.initUI();
    this.loadAudio();
    this.populate();
    this.render();
    window.onresize = function () {
      _this.resize();
    };
  }

  App.prototype.initCanvas = function initCanvas() {
    this.tick = 0;
    this.dark = false;
    this.wave = true;
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.dimensions = {};
    this.resize();
  };

  App.prototype.resize = function resize() {
    this.canvas.width = this.dimensions.x = window.innerWidth;
    this.canvas.height = this.dimensions.y = window.innerHeight;
  };

  App.prototype.initUI = function initUI() {
    var _this2 = this;

    this.controls = {
      wave: document.querySelector("#btn-wave"),
      lights: document.querySelector("#btn-lights"),
      prev: document.querySelector("#btn-prev"),
      next: document.querySelector("#btn-next"),
      play: document.querySelector("#btn-play"),
      volume: document.querySelector("#btn-volume")
    };
    this.controls.wave.onclick = function () {
      var i = _this2.controls.wave.getElementsByTagName("i")[0];
      if (_this2.wave) {
        i.classList.add("off");
        _this2.wave = false;
      } else if (!_this2.wave) {
        i.classList.remove("off");
        _this2.wave = true;
      }
    };
    this.controls.lights.onclick = function () {
      var i = _this2.controls.lights.getElementsByTagName("i")[0];
      if (_this2.dark) {
        i.classList.remove("off");
        _this2.background.classList.remove("hidden");
        _this2.dark = false;
      } else if (!_this2.dark) {
        i.classList.add("off");
        _this2.background.classList.add("hidden");
        _this2.dark = true;
      }
    };
    this.controls.prev.onclick = function () {
      _this2.currentSong = _this2.currentSong > 1 ? _this2.currentSong - 1 : _this2.fileNames.length;
      _this2.loadAudio();
    };
    this.controls.next.onclick = function () {
      _this2.currentSong = _this2.currentSong < _this2.fileNames.length ? _this2.currentSong + 1 : 1;
      _this2.loadAudio();
    };
    this.controls.play.onclick = function () {
      var i = _this2.controls.play.getElementsByTagName("i")[0];
      if (_this2.playing && _this2.audioReady) {
        i.classList.remove("fa-pause");
        i.classList.add("fa-play");
        _this2.audio.pause();
        _this2.playing = false;
      } else if (_this2.playing && _this2.audioReady) {
        i.classList.remove("fa-play");
        i.classList.add("fa-pause");
        _this2.audio.play();
        _this2.playing = true;
      }
    };
    this.controls.volume.onclick = function () {
      var i = _this2.controls.volume.getElementsByTagName("i")[0];
      _this2.volume = _this2.volume > 0 ? _this2.volume - 0.5 : 1;
      switch (_this2.volume) {
        case 1:
          i.classList.remove("fa-volume-off");
          i.classList.add("fa-volume-up");
          break;
        case 0.5:
          i.classList.remove("fa-volume-up");
          i.classList.add("fa-volume-down");
          break;
        case 0:
          i.classList.remove("fa-volume-down");
          i.classList.add("fa-volume-off");
          break;
        default:
          break;
      }
      _this2.gainNode.gain.value = _this2.volume;
    };
    this.background = document.getElementById("background");
    this.title = document.getElementById("title");
  };

  App.prototype.initAudio = function initAudio() {
    var _this3 = this;

    this.currentSong = 1;
    this.volume = 1;
    this.baseURL = "https://media.fbcbaptistchurch.org/media/";
    this.fileNames = ["1.mp3", "2.mp3", "3.mp3", "4.mp3", "5.mp3", "6.mp3", "7.mp3", "8.mp3", "9.mp3", "10.mp3", "11.mp3", "12.mp3", "13.mp3", "14.mp3", "15.mp3", "16.mp3", "17.mp3", "18.mp3", "19.mp3", "20.mp3", "21.mp3", "22.mp3", "23.mp3", "24.mp3", "25.mp3", "26.mp3", "27.mp3", "28.mp3", "29.mp3", "30.mp3", "31.mp3", "32.mp3", "33.mp3", "34.mp3", "35.mp3", "36.mp3"];
    this.songTitles = ["01. Hal 3eshtou kabla an", "02. Anta li man", "03. Fawka", "04. Askouno", "05. 3anni kada", "06. 2ila be2r samira", "07. Sa2alouzou bi 7idnika", "08. Alki", "09. Moustaslimon", "10. Rahmatan", "11. Lima a5af 7oznan", "12. Far7atou kalbi", "13. Hal tarakta lilmasi7", "14. Min baha2", "15. Kamilou jamal", "16. Ila douja", "17. In zara3ti", "18. Askouno", "19. Inta moush li", "20. Yateebo li", "21. Ha innani", "22. Ou7ibouka iz", "23. Rabbi anta li ta3aba", "24. Comment", "25. Abana lathe", "26. 5alika l2akwani", "27. Araka Ilahi Arak", "28. Ayuha Lkudus", "29. Ha salatu Tawbati", "30. Ya Rabbu Ma A7la", "31. Rabi Sabayta", "32. Fi Sitrihi", "33. Ma7abatu Lahi", "34. Rabi J3alanni", "35. Arfa3uka", "36. Sa2alto Nafsi", "37. Lasto A3lamo", "38. Musta7eki Kuli Lmajdi"];

    this.audio = document.getElementById("audio");
    this.audio.addEventListener("ended", function () {
      _this3.audio.currentTime = 0;
      _this3.audio.pause();
      _this3.currentSong = _this3.currentSong < _this3.fileNames.length ? _this3.currentSong + 1 : 1;
      _this3.loadAudio();
    });
    this.audioCtx = new AudioContext();

    this.source = this.audioCtx.createMediaElementSource(this.audio);
    this.gainNode = this.audioCtx.createGain();
    this.analyser = this.audioCtx.createAnalyser();

    this.source.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    this.gainNode.gain.value = this.volume;
    this.bufferLen = 512;
    this.freqData = new Uint8Array(this.bufferLen);
  };

  App.prototype.loadAudio = function loadAudio() {
    var _this4 = this;

    var request = new XMLHttpRequest();

    this.audioReady = false;
    this.playing = false;
    this.background.classList.add("loading");

    this.controls.prev.classList.add("disabled");
    this.controls.next.classList.add("disabled");
    this.controls.play.classList.add("disabled");

    request.open("GET", this.baseURL + this.fileNames[this.currentSong - 1], true);
    request.responseType = "blob";

    request.onload = function () {
      _this4.playAudio(request.response);
    };

    request.send();
  };

  App.prototype.playAudio = function playAudio(data) {
    this.audioReady = true;
    this.playing = true;

    this.background.classList.remove("loading");
    this.title.innerHTML = this.songTitles[this.currentSong - 1];

    this.controls.prev.classList.remove("disabled");
    this.controls.next.classList.remove("disabled");
    this.controls.play.classList.remove("disabled");

    this.controls.play.getElementsByTagName("i")[0].classList.remove("fa-play");
    this.controls.play.getElementsByTagName("i")[0].classList.add("fa-pause");

    this.audio.src = window.URL.createObjectURL(data);
    this.audio.play();
  };

  App.prototype.populate = function populate() {
    this.particles = [];
    for (var i = 0; i < this.bufferLen; i++) {
      this.particles.push(new Particle(i, this));
    }
  };

  App.prototype.update = function update() {
    this.ctx.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
    this.ctx.save();
    this.ctx.globalCompositeOperation = "lighten";
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var particle = this.particles[i];
      if (this.freqData[i] > 0) {
        particle.update();
        if (this.wave) particle.position.add(this.globalMovement);
        this.ctx.beginPath();
        this.ctx.fillStyle = particle.fill;
        this.ctx.beginPath();
        this.ctx.arc(particle.position.x, particle.position.y, particle.size, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
    this.ctx.restore();
  };

  App.prototype.render = function render() {
    this.tick++;
    if (this.wave) this.globalMovement.x = Math.sin(this.tick * 0.01) * 2;
    this.analyser.getByteFrequencyData(this.freqData);
    this.update();
    window.requestAnimationFrame(this.render.bind(this));
  };

  return App;
}();

window.requestAnimationFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
}();

window.onload = function () {
  var app = new App();
};