"use strict";
window.addEventListener("DOMContentLoaded", start)



function start() {
    fetchSVG()
}

// fetching the SVG
async function fetchSVG() {
    let response = await fetch("./graphics/all-topLeftCorner.svg");
    let mySvgData = await response.text();
    document.querySelector("#svgHolder").innerHTML = mySvgData;
    placeingHands();
    moveDrops();
    gameLoop();

    // moveDrops2()
}


// moving the hands
function placeingHands() {
    const hands = document.querySelector("#hands");
    // placeing the hands in the initial position
    hands.setAttribute("transform", "translate(950,900)");
}

// moving the drop
function moveDrops() {
    const drop1 = document.querySelector("#waterDrop1");

    // placeing the drop in the initial position
    drop1.setAttribute("transform", "translate(1100,450)");
    //addiing the animation to the drop
    drop1.classList.add("fall");

    console.log(drop1.computedStyleMap().get("transform"));
    const transformValue = getComputedStyle(drop1).getPropertyValue("transform");
    console.log(transformValue);

    // drop1.getIntersectionList();

};



function gameLoop() {

    const drop1 = document.querySelector("#waterDrop1");
    let dropX = drop1.computedStyleMap().get("transform")[0].x.value;
    let dropY = drop1.computedStyleMap().get("transform")[0].y.value;
    // console.log(`dropX: ${dropX}`);
    // console.log(`dropY: ${dropY}`);


    // console.log(drop1.getBoundingClientRect().y);
    // drop1.getIntersectionList();


    // *** process input ***
    function mouseDown() {
        // console.log("theMouseDown");
        document.querySelector("#svgHolder").addEventListener("mousemove", moveHands);
    }

    function moveHands(event) {
        // get the SVG element
        let svg = document.querySelector("#svgHolder svg");





        //  ***** Mouse event handler
        // Create an SVGPoint
        let pt = svg.createSVGPoint();
        // Get mouse cursor point in global SVG space
        function cursorPoint(evt) {
            pt.x = evt.clientX; pt.y = evt.clientY;
            return pt.matrixTransform(svg.getScreenCTM().inverse());
        };

        // moving the hands to the cursor point
        document.querySelector("#hands").style.transform = `translate(${cursorPoint(event).x - 150}px, 900px)`;
        // document.querySelector("#hands").style.transform = "translateX(300px)";

    };


    // collision detection
    function colisionDetection() {
        const bowlRect = document.querySelector("#bowlRect");
        const bowlRectX = hands.computedStyleMap().get("transform")[0].x.value;
        const bowlRectY = hands.computedStyleMap().get("transform")[0].y.value;
        const bowlWidth = parseInt(bowlRect.getAttribute("width"));
        const bowlHeight = parseInt(bowlRect.getAttribute("height"));


        // console.log(`bowl X: ${bowlRectX}`);
        // console.log(`bowl Y: ${bowlRectY}`);

        if (dropX < bowlRectX + bowlWidth &&
            dropX > bowlRectX &&
            dropY > bowlRectY) {
            // collision detected!
            console.log("heeeeyyyy")
        }
        // console.log("dropX", dropX, "dropY", dropY, "bowlX", bowlRectX, "bowlY", bowlRectY)
        // console.log("bowlRectW", bowlWidth, "bowlRectH", bowlHeight, "bowlRectW+X", bowlWidth + bowlRectX)
    }

    mouseDown();
    colisionDetection();
    requestAnimationFrame(gameLoop);

}




