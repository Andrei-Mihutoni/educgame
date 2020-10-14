"use strict";
window.addEventListener("DOMContentLoaded", start)

let score = 0;

const GAMETIME = 3600; //seting the game time
const timer = {
    timeout: GAMETIME,
    node: document.querySelector("#timerContent"),
    running: false,
};

function start() {
    fetchSVG();
    timer.running = true;
}


async function fetchSVG() {  // fetching the SVG
    // let response = await fetch("./graphics/all-topLeftCorner.svg");
    let response = await fetch("./graphics/close-up_less_colors2.svg");
    let mySvgData = await response.text();
    document.querySelector("#svgHolder").innerHTML = mySvgData;


    document.querySelector("#sadFlower").classList.remove("hidden"); // showing the initial sad flower

    placeingHands();
    moveDrops();
    gameLoop();
};



function placeingHands() {  // moving the hands
    const hands = document.querySelector("#hands");
    // placeing the hands in the initial position
    hands.setAttribute("transform", "translate(950,900)");
}


function moveDrops() {  // moving the drop
    const drop1 = document.querySelector("#waterDrop1");

    // placeing the drop in the initial position
    drop1.setAttribute("transform", "translate(1100,450)");
    //addiing the animation to the drop
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
    if (timer.timeout == 0) {
        endGame();
        timer.running = false;
    };

    const drop1 = document.querySelector("#waterDrop1");
    let dropX = drop1.computedStyleMap().get("transform")[0].x.value;
    let dropY = drop1.computedStyleMap().get("transform")[0].y.value;
    // console.log(`dropX: ${dropX}`);
    // let dropY = parseInt(drop1.getClientRects()[0].y);

    // *** process input ***
    function mouseDown() {
        // console.log("theMouseDown");
        document.querySelector("#svgHolder").addEventListener("mousemove", moveHands);
    }

    function moveHands(event) {
        let svg = document.querySelector("#svgHolder svg");  // get the SVG element

        //  ***** Mouse event handler
        let pt = svg.createSVGPoint();  // Create an SVGPoint
        function cursorPoint(evt) {  // Get mouse cursor point in global SVG space
            pt.x = evt.clientX; pt.y = evt.clientY;
            return pt.matrixTransform(svg.getScreenCTM().inverse());
        };
        document.querySelector("#hands").style.transform = `translate(${cursorPoint(event).x - 150}px, 900px)`;   // moving the hands to the cursor point
    };


    // collision detection
    function colisionDetection() {
        const bowlRect = document.querySelector("#bowlRect");
        const bowlRectX = hands.computedStyleMap().get("transform")[0].x.value;
        const bowlRectY = hands.computedStyleMap().get("transform")[0].y.value;
        const bowlWidth = parseInt(bowlRect.getAttribute("width"));
        const bowlHeight = parseInt(bowlRect.getAttribute("height"));

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

            } else if (score >= 5 && score < 10) {
                document.querySelector("#neutralFlower").classList.add("show");
                document.querySelector("#sadFlower").classList.remove("show");
                document.querySelector("#sadFlower").classList.add("hidden");
                console.log("oahudhuiadhfuadhfuodah")
                // document.querySelector("#bowlInside").setAttribute("class", "");
                // document.querySelector("#bowlInside").classList.add("st1555"); //color the inside of the bowl(make it look waterish)

            } else if (score > 10) {
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
    alert("Game over")
};




