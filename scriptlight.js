window.addEventListener("DOMContentLoaded", start);

const Room = {
  name: "",
  node: "",
  isAdultIn: false,
  isLit: false,
  isSnif: false,
};
let rooms = [];
let points;

const adult = {
  room: 0,
  node: "",
};

const timer = {
  timeout: 3600,
};

async function start() {
  let response = await fetch("./Rooms-01.svg");
  let mySvgData = await response.text();
  document.querySelector("#svgWrapper").innerHTML = mySvgData;
  for (let i = 0; i <= 4; i++) {
    let room = Object.create(Room);
    room.name = `#room${i + 1}`;
    room.node = document.querySelector(`#room${i + 1}`);
    room.isLit = false;
    room.isSnif = false;
    room.isAdultIn = false;
    rooms.push(room);
  }
  initSvg();
  initAdult();
  gameLoop();
}

function initAdult() {
  adult.room = 0;
  adult.node = document.querySelector("#adult");
}

function initSvg() {
  for (let i = 0; i < rooms.length; i++) {
    rooms[i].node.setAttribute("filter", "url(#myFilter)");
    console.log(rooms[i].node);
    rooms[i].node.addEventListener("click", function () {
      if (!rooms[i].isAdultIn) {
        if (rooms[i].isLit) {
          rooms[i].node.setAttribute("filter", "url(#myFilter)");
          rooms[i].isLit = false;
        } else {
          rooms[i].node.removeAttribute("filter");
          rooms[i].isLit = true;
        }
      }
    });
  }
}

function gameLoop() {
  if (timer.timeout > 0) {
    timer.timeout--;
    if (timer.timeout % 100 == 0) {
      console.log("tick");
      moveAdult(Math.floor(Math.random() * 5));
    }
  }

  for (let i = 0; i < rooms.length; i++) {
    if (!rooms[i].isLit) rooms[i].node.setAttribute("filter", "url(#myFilter)");
    else rooms[i].node.removeAttribute("filter");
  }

  requestAnimationFrame(gameLoop);
}

function moveAdult(roomNr) {
  rooms.forEach((room) => (room.isAdultIn = false));
  adult.room = roomNr;
  // console.log(rooms);
  // console.log(adult.room);
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
  rooms[roomNr].isAdultIn = true;
  rooms[roomNr].isLit = true;
}
