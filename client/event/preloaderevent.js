!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Scrambler=t():e.Scrambler=t()}(self,(function(){return(()=>{"use strict";var e={d:(t,r)=>{for(var s in r)e.o(r,s)&&!e.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:r[s]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)},t={};e.d(t,{default:()=>s});class r{static get CHARACTERS(){return{DEFAULT:["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],ALPHABET:["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s",
"t", "u", "v", "w", "x", "y", "z"]}}constructor(){this.characters=[...r.CHARACTERS.DEFAULT],this.maxCounter=12,this.targetText="",this.scrambledText="",this.encodingCounters=[],this.decodingCounters=[],this.onScramble=null,this.frameId=null,this.frameIndex=0}scramble(e,t,s=null){this.characters=s?.characters?[...s.characters]:[...r.CHARACTERS.DEFAULT],this.targetText=e,this.encodingCounters=this._generateCounters(this.scrambledText),this.decodingCounters=this._generateCounters(this.targetText),this.onScramble=t,this.frameId=null,this.frameIndex=0,this.frameId=requestAnimationFrame((()=>this._encode()))}_randomText(e){let t="";for(let r=0;r<e;r+=1)t+=this.characters[Math.floor(Math.random()*this.characters.length)];return t}_generateCounters(e){return new Array(e.length).fill(0).map((()=>Math.floor(Math.random()*this.maxCounter)+1))}_encode(){if(0===this.frameIndex){if(0===this.encodingCounters.reduce(((e,t)=>e+t),0))return void(this.frameId=requestAnimationFrame((()=>this._fill())));for(let e=0;e<this.encodingCounters.length;e+=1)if(0!==this.encodingCounters[e])this.encodingCounters[e]-=1,this.onScramble(this.scrambledText);else{const t=this.scrambledText.split("");t[e]=this._randomText(1),this.scrambledText=t.join("")}}this.frameIndex=(this.frameIndex+1)%3,this.frameId=requestAnimationFrame((()=>this._encode()))}_fill(){if(0===this.frameIndex){if(this.scrambledText.length===this.targetText.length)return void(this.frameId=requestAnimationFrame((()=>this._decode())));const e=this.scrambledText.length<this.targetText.length?1:-1;this.scrambledText=this.
_randomText(this.scrambledText.length+e), this.onScramble(this.scrambledText)} this.frameIndex=(this.frameIndex+1)%2, this.frameId=requestAnimationFrame((()=> this._fill()))} _decode(){if(this.scrambledText=== this.targetText) cancelAnimationFrame(this.frameId); else{if(0=== this.frameIndex){let e=""; for(let t=0; t<this.decodingCounters.length; t+=1) 0!== this.decodingCounters[t]?(e+= this.characters[Math.floor(Math.random()* this.characters.length)], this.decodingCounters[t]-=1): e+= this.targetText[t]; this.scrambledText=e, this.onScramble(this.scrambledText)} this.frameIndex=(this.frameIndex+1)%4, this.frameId=requestAnimationFrame((()=> this._decode()))}}} const s=r; return t.default})()}));

const TEXTS = ['EVENTS LOADING'];

const scrambler = new window.Scrambler();
const handleScramble = (text) => {
  document.getElementById('preloader-text').innerHTML = text;
}

let i = 0;
function printText() {
  const targetText = TEXTS[i % TEXTS.length];
  if (i++ % 3 == 2) {
    scrambler.scramble(targetText, handleScramble, {
      characters: Scrambler.CHARACTERS.ALPHABET,
    });
  } else {
    scrambler.scramble(targetText, handleScramble);
  }
  setTimeout(printText, 2000);//2000 default
}
printText();


/*----------------------------------------------------------------*/
document.addEventListener('DOMContentLoaded', function() {
  fetch('http://localhost:5000/trandingSliderData')
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              populateSlider(data.data);
              
              
              // Use setTimeout to delay hiding the preloader and showing the main content
              setTimeout(function() {
              // Hide preloader
              document.getElementById('preloader-container').style.display = 'none';

              // Show main content
              var mainContent = document.getElementById('event-content');
              mainContent.style.visibility = 'visible';
              mainContent.style.opacity = '1';
              }, 2500);
          } else {
              console.error(data.error);
          }
      })
      .catch(error => {
          console.error(error);
      });
});

function populateSlider(data) {
  // Clear the slider
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  swiperWrapper.innerHTML = '';

  // Add each item to the slider
  data.forEach(item => {
    swiperWrapper.innerHTML += `
        <div class="swiper-slide tranding-slide">
            <div class="tranding-slide-img">
                <img src="${item.evtpic}" alt="${item.evtname}">
            </div>
        </div>
    `;
  });

  // Initialize the slider after populating it
  initializeSlider();
}
