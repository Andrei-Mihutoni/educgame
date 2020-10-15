window.addEventListener("DOMContentLoaded", initGame);

const ADULT_MOVE_TICK_RATE = 200; // move every nr of ms
const TIMER_UPDATE_TICK_RATE = 100; // update every nr of ms
let GAMETIME = 3600; // in ms

let rooms = [];
let points = 0;
let lastEnteredRoom = 0;

let soundLightOff = new Audio("./light_off.mp3");
let soundLightOn = new Audio("./light_on.mp3");
let soundWrong = new Audio("./wrong.mp3");

const Room = {
  name: "",
  node: "",
  isAdultIn: false,
  isLit: false,
  isSnif: false,
};

const adult = {
  room: 0,
  node: "",
};

const timer = {
  timeout: GAMETIME,
  node: document.querySelector("#timerContent"),
  running: false,
};

async function initGame() {
  let response = await fetch("./Rooms-01.svg");
  let mySvgData = await response.text();
  document.querySelector("#svgWrapper").innerHTML = mySvgData;

  document.querySelector("#startBtn").addEventListener("click", startGame);
  document.querySelector("#start_again").addEventListener("click", startGame);

  addRooms();
  initSvg();
  initAdult();
  gameLoop();
}

function startGame() {
  timer.timeout = GAMETIME;

  document.querySelector("#endScreen").classList.add("hidden");
  document.querySelector("#startBtn").classList.add("hidden");
  document.querySelector("#darkenScreen").classList.add("hidden");

  rooms.forEach((room) => (room.isLit = false));
  rooms.forEach((room) => (room.isAdultIn = false));
  adult.node.setAttribute("transform", "translate(-500,-500)");
  points = 0;

  timer.running = true;
}

function addRooms() {
  for (let i = 0; i <= 4; i++) {
    let room = Object.create(Room);
    room.name = `#room${i + 1}`;
    room.node = document.querySelector(`#room${i + 1}`);
    room.isLit = false;
    room.isSnif = false;
    room.isAdultIn = false;
    rooms.push(room);
  }
}

function initAdult() {
  adult.room = 0;
  adult.node = document.querySelector("#adult");
  adult.node.setAttribute("transform", "translate(-500,-500)");
}

function initSvg() {
  for (let i = 0; i < rooms.length; i++) {
    rooms[i].node.setAttribute("filter", "url(#darkenRoom)");
    rooms[i].node.classList.add("hovered");
    rooms[i].node.querySelector(".light-on").classList.add("hidden");
    rooms[i].node.addEventListener("click", function () {
      if (!rooms[i].isAdultIn) {
        if (rooms[i].isLit) {
          rooms[i].node.setAttribute("filter", "url(#darkenRoom)");
          rooms[i].isLit = false;
          rooms[i].node.querySelector(".light-on").classList.add("hidden");
          points++;
          soundLightOff.play();
        }
      } else {
        soundWrong.currentTime = 0;
        soundWrong.play();
      }
    });
  }
}

function gameLoop() {
  //PROCESS
  if (timer.timeout > 0 && timer.running) {
    timer.timeout--;
    if (timer.timeout % ADULT_MOVE_TICK_RATE == 0) {
      console.log("tick");
      let nowEnteredRoom = Math.floor(Math.random() * 5);
      console.log(nowEnteredRoom, lastEnteredRoom);
      while (nowEnteredRoom == lastEnteredRoom) {
        nowEnteredRoom = Math.floor(Math.random() * 5);
        console.log(nowEnteredRoom);
      }
      moveAdult(nowEnteredRoom);
      lastEnteredRoom = nowEnteredRoom;
    }
  }

  if (timer.timeout == 0) {
    endGame();
    timer.running = false;
  }

  //VIEW
  if (timer.timeout > 0 && timer.running) {
    if (timer.timeout % TIMER_UPDATE_TICK_RATE == 0) {
      updateRoomView();
      updateTimer();
    }
  }

  //LOOP
  requestAnimationFrame(gameLoop);
}

function updateRoomView() {
  for (let i = 0; i < rooms.length; i++) {
    if (!rooms[i].isLit) rooms[i].node.setAttribute("filter", "url(#darkenRoom)");
    else rooms[i].node.removeAttribute("filter");
  }
}

function updateTimer() {
  timer.node.style.width = timer.timeout / (GAMETIME / 100) + "%";
}

function endGame() {
  document.querySelector("#darkenScreen").classList.remove("hidden");
  document.querySelector("#endScreen").classList.remove("hidden");
  document.querySelector("#endScreen p span").textContent = points;
}

function moveAdult(roomNr) {
  rooms.forEach((room) => (room.isAdultIn = false));
  adult.room = roomNr;

  if (adult.room == 0) {
    adult.node.setAttribute("transform", "translate(0,0)");
  } else if (adult.room == 1) {
    adult.node.setAttribute("transform", "translate(400,0)");
  } else if (adult.room == 2) {
    adult.node.setAttribute("transform", "translate(1200,0)");
  } else if (adult.room == 3) {
    adult.node.setAttribute("transform", "translate(0,350)");
  } else if (adult.room == 4) {
    adult.node.setAttribute("transform", "translate(1000,350)");
  }

  soundLightOn.play();
  rooms[roomNr].node.querySelector(".light-on").classList.remove("hidden");
  rooms[roomNr].isAdultIn = true;
  rooms[roomNr].isLit = true;
}
