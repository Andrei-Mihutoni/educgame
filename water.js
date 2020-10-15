"use strict";
window.addEventListener("DOMContentLoaded", init)

let score = 0;

const GAMETIME = 2400; //seting the game time
let gameReset = false;
const timer = {
    timeout: GAMETIME,
    node: document.querySelector("#timerContent"),
    running: false,
};

let instructionsAudio = new Audio("./sounds/instructions.m4a");
let cheersAudio = new Audio("./sounds/goGoGo.m4a");


function init() {
    fetchSVG();
    document.querySelector("#startButton").addEventListener("click", start);
};


function start() {
    score = 0;
    timer.running = true;
    timer.timeout = GAMETIME;
    document.querySelector("#startButton").classList.add("hidden");
    instructionsAudio.play();

    document.querySelector("#neutralFlower").classList.remove("show");
    document.querySelector("#happyFlower").classList.remove("show");
    document.querySelector("#sadFlower").classList.add("show");

    moveDrops();
    if (!gameReset)
        gameLoop();
}



let mobile = false;    // 
if (window.innerWidth < 800) {   //setting the mobile "detection" if the screen is smaller than 800px
    mobile = true;
};

async function fetchSVG() {  // fetching the SVG
    // let response = await fetch("./graphics/all-topLeftCorner.svg");
    let response = await fetch("./graphics/close-up_less_colors2.svg");
    let mySvgData = await response.text();
    document.querySelector("#svgHolder").innerHTML = mySvgData;
    document.querySelector("#sadFlower").classList.remove("hidden"); // showing the initial sad flower
    document.querySelector("#waterDrop1").setAttribute("transform", "translate(1100,450)"); // placeing the drop in the initial position
    placeingHands();
};



function placeingHands() {  // moving the hands
    const hands = document.querySelector("#hands");
    // placeing the hands in the initial position
    hands.setAttribute("transform", "translate(950,900)");
};


function moveDrops() {  // moving the drop
    const drop1 = document.querySelector("#waterDrop1");


    //adding the animation to the drop
    drop1.classList.add(`bounce${Math.floor(Math.random() * 1) + 1}`);
    // drop1.classList.add("bounce2");
    // console.log(drop1.computedStyleMap().get("transform"));
    const transformValue = getComputedStyle(drop1).getPropertyValue("transform");
    console.log(transformValue);
};



function gameLoop() {
    if (timer.timeout > 0 && timer.running) {
        timer.timeout--;
    };
    if (timer.timeout == 0 && timer.running == true) {
        timer.running = false;
        endGame();
    };
    if (score > 25) {
        endGame();
    };
    if (score == 10) {
        cheersAudio.play(); //play cheers sound
    }

    const drop1 = document.querySelector("#waterDrop1");
    let dropX = drop1.computedStyleMap().get("transform")[0].x.value;  //getting the drop position on x axis
    let dropY = drop1.computedStyleMap().get("transform")[0].y.value;  //getting the drop position on y axis
    // console.log(`dropX: ${dropX}`);
    // let dropY = parseInt(drop1.getClientRects()[0].y);

    // *** process input ***
    function mouseDown() {
        if (mobile == true) {
            document.querySelector("body").addEventListener("mousemove", moveHands); //on screen smaller than 800px it moves the hands on tap
            // console.log("Mobile screen size");
        } else {
            document.querySelector("#hands").addEventListener("mousemove", moveHands);  //on large screen it moves the hands only when hovering on them
            // console.log("Desktop screen size");
        }
    };




    function moveHands(event) {
        let svg = document.querySelector("#svgHolder svg");  // get the SVG element

        //  ***** Mouse event handler
        let point = svg.createSVGPoint();  // Create an SVGPoint

        function cursorPoint(evt) {  // Get mouse cursor point in global SVG space
            point.x = evt.clientX;
            point.y = evt.clientY;
            // console.log(point.x);
            return point.matrixTransform(svg.getScreenCTM().inverse());
        };
        document.querySelector("#hands").style.transform = `translate(${cursorPoint(event).x - 150}px, 900px)`;   // moving the hands to the cursor point
    };


    // collision detection
    function colisionDetection() {
        const bowlRect = document.querySelector("#bowlRect");
        const bowlRectX = hands.computedStyleMap().get("transform")[0].x.value; // gets the hand/bowl position on x axis
        const bowlRectY = hands.computedStyleMap().get("transform")[0].y.value;  // gets the hand/bowl position on y axis
        const bowlWidth = parseInt(bowlRect.getAttribute("width"));
        // const bowlHeight = parseInt(bowlRect.getAttribute("height"));

        if (dropX < bowlRectX + bowlWidth &&
            dropX > bowlRectX &&
            dropY > bowlRectY) {
            // collision detected!
            drop1.setAttribute("class", "");
            drop1.classList.add(`bounce${Math.floor(Math.random() * 2 + 1)}`);
            console.log("Collision!")
            addScore();
            showFlower();
        };
        //     console.log("dropX", dropX, "dropY", dropY, "bowlX", bowlRectX, "bowlY", bowlRectY)
        //     console.log("bowlRectW", bowlWidth, "bowlRectH", bowlHeight, "bowlRectW+X", bowlWidth + bowlRectX)


        function addScore() {                    // adds score on collision of the drops with the bown
            console.log("Adding to score!");
            score++;
            console.log(score);
        };

        function showFlower() {
            if (score == 1) {
                document.querySelector("#bowlInside").classList.add("st1554"); //color the inside of the bowl(make it look waterish)

            } else if (score >= 5 && score < 25) {
                document.querySelector("#neutralFlower").classList.add("show");
                document.querySelector("#sadFlower").classList.remove("show");
                document.querySelector("#sadFlower").classList.add("hidden");
                // document.querySelector("#bowlInside").setAttribute("class", "");
                // document.querySelector("#bowlInside").classList.add("st1555"); //color the inside of the bowl(make it look waterish)

            } else if (score > 25) {
                document.querySelector("#neutralFlower").classList.remove("show");
                document.querySelector("#happyFlower").classList.add("show");

                //document.querySelector("#bowlInside").setAttribute("class", "");
                //document.querySelector("#bowlInside").classList.add("st1556"); //color the inside of the bowl(make it look waterish)

            }
        }
    };

    // timer: update the visuals on timer count
    if (timer.timeout > 0 && timer.running) {
        if (timer.timeout % 100 == 0) {
            updateTimer();
        }
    };

    function updateTimer() {
        timer.node.style.width = timer.timeout / (GAMETIME / 100) + "%";
    };



    mouseDown();
    colisionDetection();
    requestAnimationFrame(gameLoop);
};


function endGame() {
    alert("Game over");
    score = 0;
    document.querySelector("#waterDrop1").setAttribute("class", "");
    document.querySelector("#startButton").classList.remove("hidden");

    timer.running = false;  //stoping the timer
    gameReset = true;  //reset game
};


