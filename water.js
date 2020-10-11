"use strict";
window.addEventListener("DOMContentLoaded", start)



function start () {
    fetchSVG()
}

async function fetchSVG() {
    let response = await fetch("./graphics/all-topLeftCorner.svg");
    let mySvgData = await response.text();
    document.querySelector("#svgHolder").innerHTML = mySvgData;
    moveHands();
    moveDrops();
}


function moveHands() {
    const hands =  document.querySelector("#hands");
    hands.setAttribute("transform", "translate(950,900)");
    console.log(hands)
}

function moveDrops() {
    const drop1 = document.querySelector("#waterDrop1");
    drop1.setAttribute("transform", "translate(1100,450)");
    drop1.classList.add("fall");
    console.log(drop1.computedStyleMap().get("transform"))

}






    
    // document.querySelector("#hands").setAttribute("x", "0");

    // // let handsX = document.querySelector("#hands").getAttribute("x");
    // // console.log(handsX);

    // // document.querySelector("#hands").setAttribute("x", "200");
    // // console.log(handsX);

