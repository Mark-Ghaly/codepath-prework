3;
// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var clueHoldTime = 1000;
var wrongGuesses = 0;

function generatePattern() {
  //generates different pattern everytime the player starts the game
  var i;
  var x;
  for (i = 0; i < 10; i++) {
    do {
      x = Math.floor(Math.random() * 7); //choose a number between 0 and 6
    } while (x == 0); //makes sure the number != 0
    pattern[i] = x; //adds the random number to the pattern
  }
}
function startGame() {
  //initialize game variables
  generatePattern();
  progress = 0;
  wrongGuesses = 0; //initialize the mistakes to 0
  gamePlaying = true;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function pressImage(img) {
  document.getElementById("img" + img).classList.remove("hidden");
}

function clearImage(img) {
  document.getElementById("img" + img).classList.add("hidden");
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}
function playClueSequence() {
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  clueHoldTime -= progress * 15; //decrease the clueHoldTime eveyr round by progress*15ms
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);

  if (!gamePlaying) {
    return;
  }
  if (btn == pattern[guessCounter]) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    if (wrongGuesses == 2) {
      //when the user presses the wrong button for the 3rd time (2 wrong guesses already) he loses the game
      loseGame();
    } else {
      wrongGuesses++; //increment the wrong guesses
      alert(
        "You guessed wrong, you still have " +
          (2 - wrongGuesses) +
          " availabe wrong guesses"
      ); //alert the user how many wrong guesses he still has
    }
  }
}
// Sound Synthesis Functions
const freqMap = {
  1: 280,
  2: 350.3,
  3: 410.6,
  4: 500.4,
  5: 610.2,
  6: 700,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
