window.addEventListener("DOMContentLoaded", initGame);

const GAMETIME = 3600; // in ms
const TIMER_UPDATE_TICK_RATE = 100;

const INITIAL_PLATE_X = 950;
const INITIAL_PLATE_Y = 530;

const DISHWASHER_EMPTY_PLATES = 0;
const DISHWASHER_FULL_PLATES = 5;
const DISHWASHER_CLOSED_PLATES = 10;

let pt;

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

  startGame();
  initDishwasher();
  addPlates();
  gameLoop();
}

function startGame() {
  timer.running = true;
}

function initDishwasher() {
  dishwasher.nodeEmpty = document.querySelector("#dishwasherEmpty");
  dishwasher.nodeFull = document.querySelector("#dishwasherFull");
  dishwasher.nodeClosed = document.querySelector("#dishwasherClosed");
  dishwasher.collisionNode = document.querySelector("#dishwasherCollision");

  dishwasher.nodeFull.classList.add("hidden");
  dishwasher.nodeEmpty.classList.add("hidden");
  dishwasher.nodeClosed.classList.add("hidden");
}

function addPlates() {
  plate = Object.create(Plate);
  plate.node = document.querySelector("#plate");
  plate.collisionNode = document.querySelector("#plate rect");
  plate.grabbed = false;
  pt = document.querySelector("#svgWrapper svg").createSVGPoint();
  plate.collisionNode.addEventListener("mousedown", grabPlate);
}

function cursorPoint(evt) {
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  return pt.matrixTransform(document.querySelector("#svgWrapper svg").getScreenCTM().inverse());
}

function grabPlate(event) {
  event.target.grabbed = !event.target.grabbed;
  if (event.target.grabbed) {
    event.target.addEventListener("mousemove", movePlate);
  } else event.target.removeEventListener("mousemove", movePlate);
  console.log(event.target.grabbed);
}

function checkCollision(rect1, rect2) {
  let plateWidth = parseInt(rect1.getAttribute("width")) / 2;
  let plateHeight = parseInt(rect1.getAttribute("height"));
  let plateCollisionX = rect1.parentElement.computedStyleMap().get("transform")[0].x.value + INITIAL_PLATE_X;
  let plateCollisionY =
    rect1.parentElement.computedStyleMap().get("transform")[0].y.value + INITIAL_PLATE_Y - plateHeight / 2;

  let dishwasherCollisionX = rect2.x.baseVal.value;
  let dishwasherCollisionY = rect2.y.baseVal.value;
  let dishwasherWidth = parseInt(rect2.getAttribute("width"));
  let dishwasherHeight = parseInt(rect2.getAttribute("height"));

  if (
    plateCollisionX < dishwasherCollisionX + dishwasherWidth &&
    plateCollisionX + plateWidth > dishwasherCollisionX &&
    plateCollisionY < dishwasherCollisionY + dishwasherHeight &&
    plateCollisionY + plateHeight > dishwasherCollisionY
  ) {
    console.log(plateCollisionX, plateCollisionY, "dx:", dishwasherCollisionX, "dy:", dishwasherCollisionY);
    console.log(plateWidth, plateHeight, dishwasherWidth, dishwasherHeight);
    console.log("collision");
  }
}

function movePlate(event) {
  document
    .querySelector("#plate")
    .setAttribute(
      "transform",
      `translate(${parseInt(cursorPoint(event).x) - INITIAL_PLATE_X},${
        parseInt(cursorPoint(event).y) - INITIAL_PLATE_Y
      })`
    );

  checkCollision(event.target, dishwasher.collisionNode);
}

function gameLoop() {
  //PROCESS
  if (timer.timeout > 0 && timer.running) {
    timer.timeout--;
  }

  if (timer.timeout == 0) {
    endGame();
    timer.running = false;
  }

  //   if (plate.grabbed) plate.collisionNode.addEventListener("mousemove", movePlate);
  //   else plate.collisionNode.removeEventListener("mousemove", movePlate);

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
    // console.log(dishwasher.plates, "empty");
  } else if (dishwasher.plates >= DISHWASHER_EMPTY_PLATES && dishwasher.plates < DISHWASHER_FULL_PLATES) {
    dishwasher.nodeFull.classList.remove("hidden");
    dishwasher.nodeClosed.classList.add("hidden");
    dishwasher.nodeEmpty.classList.add("hidden");
    // console.log(dishwasher.plates, "full");
  } else if (dishwasher.plates >= DISHWASHER_FULL_PLATES) {
    dishwasher.nodeFull.classList.add("hidden");
    dishwasher.nodeEmpty.classList.add("hidden");
    dishwasher.nodeClosed.classList.remove("hidden");
    // console.log(dishwasher.plates, "closed");
  }
}

function updateTimer() {
  //timer.node.style.width = timer.timeout / (GAMETIME / 100) + "%";
}

function endGame() {}
