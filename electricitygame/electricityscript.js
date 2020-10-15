window.addEventListener("DOMContentLoaded", initGame);

let MOBILE = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  MOBILE = true;
}
if (window.innerWidth < 800) {
  MOBILE = true;
}

const GAMETIME = 3600; // in ms
const TIMER_UPDATE_TICK_RATE = 100; // in ms

const NR_OF_PLATES = 10;
const INITIAL_PLATE_X = 950; // initial plate pos doesn't start at (0,0)
const INITIAL_PLATE_Y = 530;

//for changing dishwasher image
const DISHWASHER_EMPTY_PLATES = 5;
const DISHWASHER_FULL_PLATES = 8;

let svgPoint; //for translating page mouse coords in svg coords
let points = 0;

let plates = [];
const Plate = {
  node: "",
  collisionNode: "",
  grabbed: false,
};

const dishwasher = {
  nodeFull: "",
  nodeEmpty: "",
  nodeClosed: "",
  collisionNode: "",
  plates: 0,
  closed: false,
};

const sink = {
  collisionNode: "",
  plates: 0,
};

const timer = {
  timeout: GAMETIME,
  node: document.querySelector("#timerContent"),
  running: false,
};

async function initGame() {
  let response = await fetch("./kitchen-01.svg");
  let mySvgData = await response.text();
  document.querySelector("#svgWrapper").innerHTML = mySvgData;

  svgPoint = document.querySelector("#svgWrapper svg").createSVGPoint();
  document.querySelector("#startBtn").addEventListener("click", startGame);
  document.querySelector("#start_again").addEventListener("click", startGame);
  initDishwasher();
  gameLoop();
}

function startGame() {

  document.querySelector("#go_home").classList.add("hidden");
  document.querySelector("#startBtn").classList.add("hidden");
  document.querySelector("#darkenScreen").classList.add("hidden");
  document.querySelector("#endScreen").classList.add("hidden");
  document.querySelector("#plate").classList.remove("hidden");

  timer.running = true;
  timer.timeout = GAMETIME;

  points = 0;

  plates = [];
  dishwasher.plates = 0;
  dishwasher.closed = false;
  sink.plates = 0;

  console.log(timer.running, timer.timeout);
  console.log(plates, dishwasher.plates, sink.plates);

  addPlates();
}

function initDishwasher() {
  dishwasher.nodeEmpty = document.querySelector("#dishwasherEmpty");
  dishwasher.nodeFull = document.querySelector("#dishwasherFull");
  dishwasher.nodeClosed = document.querySelector("#dishwasherClosed");
  dishwasher.collisionNode = document.querySelector("#dishwasherCollision");

  dishwasher.nodeFull.classList.add("hidden");
  dishwasher.nodeEmpty.classList.add("hidden");
  dishwasher.nodeClosed.classList.add("hidden");

  sink.collisionNode = document.querySelector("#sinkCollision");
}

function addPlates() {
  for (let i = 0; i < NR_OF_PLATES; i++) {
    const newPlate = document.querySelector("#plate").cloneNode(true);
    newPlate.id = `plate${i}`;
    document.querySelector("#plates").appendChild(newPlate);

    plate = Object.create(Plate);
    plate.node = document.querySelector(`#plate${i}`);
    plate.node.setAttribute("transform", `translate(0,${-i * 15})`);
    plate.node.classList.add("hovered");

    plate.collisionNode = document.querySelector(`#plate${i} rect`);
    if (!MOBILE) plate.collisionNode.addEventListener("mousedown", grabPlate);
    else {
      //FIXME
      console.log("do we get there?");
      plate.collisionNode.addEventListener("touchstart", grabPlate);
      plate.collisionNode.addEventListener("mousedown", grabPlate);
    }

    plate.grabbed = false;

    plates.push(plate);
  }
  //remove initial plate
  document.querySelector("#plate").classList.add("hidden");
}

//translate mouse coords to match svg coords
function cursorPoint(evt) {
  svgPoint.x = evt.clientX;
  svgPoint.y = evt.clientY;
  return svgPoint.matrixTransform(document.querySelector("#svgWrapper svg").getScreenCTM().inverse());
}

function grabPlate(event) {
  event.preventDefault();
  if (!MOBILE) {
    event.target.grabbed = !event.target.grabbed;
    if (event.target.grabbed) {
      event.target.addEventListener("mousemove", movePlate);
      event.target.removeEventListener("mousedown", grabPlate);
      event.target.addEventListener("mouseup", ungrabPlate);
    } else event.target.removeEventListener("mousemove", movePlate);
    console.log(event.target.grabbed);
  } else {
    //FIXME
    console.log("Grab");
    event.target.grabbed = true;
    if (event.target.grabbed) {
      event.target.addEventListener("mousemove", movePlate);
      event.target.removeEventListener("mousedown", grabPlate);
    } else event.target.removeEventListener("mousemove", movePlate);
    console.log(event.target.grabbed);
  }
}

function ungrabPlate(event) {
  console.log("Ungrab");
  event.target.grabbed = false;
  event.target.removeEventListener("mousemove", movePlate);
  event.target.addEventListener("mousedown", grabPlate);
}

function movePlate(event) {
  event.preventDefault();
  if (!MOBILE) {
    event.target.parentElement.setAttribute(
      "transform",
      `translate(${parseInt(cursorPoint(event).x) - INITIAL_PLATE_X},${parseInt(cursorPoint(event).y) - INITIAL_PLATE_Y
      })`
    );
  } else {
    event.target.parentElement.setAttribute(
      "transform",
      `translate(${parseInt(cursorPoint(event).x) - INITIAL_PLATE_X},${parseInt(cursorPoint(event).y) - INITIAL_PLATE_Y
      })`
    );
  }

  if (!dishwasher.closed) checkCollision(event.target, dishwasher.collisionNode);
  else checkCollision(event.target, sink.collisionNode);
}

function checkCollision(rect1, rect2) {
  let plateWidth = parseInt(rect1.getAttribute("width")) / 2;
  let plateHeight = parseInt(rect1.getAttribute("height"));
  let plateCollisionX = rect1.parentElement.computedStyleMap().get("transform")[0].x.value + INITIAL_PLATE_X;
  let plateCollisionY =
    rect1.parentElement.computedStyleMap().get("transform")[0].y.value + INITIAL_PLATE_Y - plateHeight / 2;

  let rect2CollisionX = rect2.x.baseVal.value;
  let rect2CollisionY = rect2.y.baseVal.value;
  let rect2Width = parseInt(rect2.getAttribute("width"));
  let rect2Height = parseInt(rect2.getAttribute("height"));

  if (
    plateCollisionX < rect2CollisionX + rect2Width &&
    plateCollisionX + plateWidth > rect2CollisionX &&
    plateCollisionY < rect2CollisionY + rect2Height &&
    plateCollisionY + plateHeight > rect2CollisionY
  ) {
    if (!dishwasher.closed) addPlateToDishwasher(rect1.parentElement);
    else addPlateToSink(rect1.parentElement);
  }
}

function addPlateToDishwasher(plate) {
  dishwasher.plates++;
  plate.parentElement.removeChild(plate);
  points++;
}

function addPlateToSink(plate) {
  sink.plates++;
  plate.parentElement.removeChild(plate);
  points++;
}

function gameLoop() {
  //PROCESS
  if (timer.timeout > 0 && timer.running) {
    timer.timeout--;
  }

  if (timer.timeout == 0 || points == 10) {
    endGame();
    timer.running = false;
  }

  //VIEW
  if (timer.timeout > 0 && timer.running) {
    if (timer.timeout % TIMER_UPDATE_TICK_RATE == 0) {
      updateTimer();
    }
  }

  if (timer.timeout % 10 == 0) updateDishwasherView();

  //LOOP
  requestAnimationFrame(gameLoop);
}

function updateDishwasherView() {
  if (dishwasher.plates < DISHWASHER_EMPTY_PLATES) {
    dishwasher.nodeEmpty.classList.remove("hidden");
    dishwasher.nodeClosed.classList.add("hidden");
    dishwasher.nodeFull.classList.add("hidden");
  } else if (dishwasher.plates >= DISHWASHER_EMPTY_PLATES && dishwasher.plates < DISHWASHER_FULL_PLATES) {
    dishwasher.nodeFull.classList.remove("hidden");
    dishwasher.nodeClosed.classList.add("hidden");
    dishwasher.nodeEmpty.classList.add("hidden");
  } else if (dishwasher.plates >= DISHWASHER_FULL_PLATES) {
    dishwasher.nodeFull.classList.add("hidden");
    dishwasher.nodeEmpty.classList.add("hidden");
    dishwasher.nodeClosed.classList.remove("hidden");
    dishwasher.closed = true;
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
