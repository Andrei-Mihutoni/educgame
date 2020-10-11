"use strict";

window.addEventListener("load", fetchSVG);

const el = document.querySelector(".container");

async function fetchSVG() {

    const response = await fetch('snif_path_colors.svg');
    const text = await response.text();
    el.innerHTML = text;
    settingID();
}

// initializing variables to be filled when SVG is done
let winter_snif = null;
let summer_snif = null;
let normal_snif = null;

let snifs = [];

// I'll have to do it for radiator & window as well

let cold_radiator = null;
let hot_radiator = null;

let radiators = [];

//windows setting

let opened_window = null;
let closed_window = null;

let windows = [];

function settingID() {

    //setting data-name to id
    document.querySelectorAll("g").forEach((elem) => elem.id = elem.dataset.name);

    //creating an array with all the Snifs
    winter_snif = document.querySelector("#winter_snif");
    summer_snif = document.querySelector("#summer_snif");
    normal_snif = document.querySelector("#normal_snif");

    snifs = [winter_snif, summer_snif, normal_snif];

    //adding radiator to an array
    cold_radiator = document.querySelector("#cold_radiator");
    hot_radiator = document.querySelector("#hot_radiator");

    radiators = [cold_radiator, hot_radiator];

    // adding windows to an array
    opened_window = document.querySelector("#opened_window");
    closed_window = document.querySelector("#closed_window");

    windows = [closed_window, opened_window];

    //adding an eventlistener to each
    addingEventlistener(snifs);
    addingEventlistener(windows);
    addingEventlistener(radiators);

    settingScene();
}

let winningSnif = null;
let winningRadiator = null;
let winningWindow = null;

// sets the elements to a random element
function settingScene() {

    const randomElement = windows[Math.floor(Math.random() * windows.length)];

    //setting the win co
    winningWindow = randomElement;

    randomElement.classList.add("showing");

    if (randomElement == closed_window) {
        opened_window.classList.add("hidden");
        hot_radiator.classList.add("showing");
        cold_radiator.classList.add("hidden");
    }

    else {
        closed_window.classList.add("hidden");
        hot_radiator.classList.add("hidden");
        cold_radiator.classList.add("showing");
    }

    const randomSnif = snifs[Math.floor(Math.random() * snifs.length)];

    //setting the win co
    winningSnif = randomSnif;

    let chosenSnif = snifs.indexOf(randomSnif);

    for (let a = 0; a < snifs.length; a++) {
        if (a == chosenSnif) {
            snifs[a].classList.add("showing");
        }

        else {
            snifs[a].classList.add("hidden");
        }
    }
}

function addingEventlistener(array) {
    for (let i = 0; i < array.length; i++) {
        array[i].addEventListener("click", WhichElement);
    }
}

// passes the array as an param to the moving function
function WhichElement() {

    if (snifs.includes(this)) {
        MovingtoNext(snifs, this);
    }

    else if (radiators.includes(this)) {
        MovingtoNext(radiators, this);
    }

    else if (windows.includes(this)) {
        MovingtoNext(windows, this);
    }
}

//gets the elements to move in the array
//also sets up the winning condition!!!

function MovingtoNext(array, elem) {

    if (array.indexOf(elem) + 1 == array.length) {

        //this means it is the last element in the array
        elem.classList.remove("showing");
        elem.classList.add("hidden");

        array[0].classList.add("showing");
        array[0].classList.remove("hidden");

    }

    else {
        //this means it is either the first or second element
        elem.classList.remove("showing");
        elem.classList.add("hidden");

        array[array.indexOf(elem) + 1].classList.add("showing");
        array[array.indexOf(elem) + 1].classList.remove("hidden");
    }

    //the radiator is a consequence of the window
    if (winningWindow == closed_window) {
        winningRadiator = hot_radiator;
    }

    else {
        winningRadiator = cold_radiator;
    }

    /*     for debugging if necessary
        console.log(winningRadiator);
        console.log(winningSnif);
        console.log(winningWindow); */

    if (winningSnif.classList.contains("showing") && winningWindow.classList.contains("showing") && winningRadiator.classList.contains("showing")) {
        document.querySelector(".wrapper").classList.add("showing");
        document.querySelector(".wrapper").classList.remove("hidden");

        document.querySelector("#start_button").classList.remove("hidden");
        document.querySelector("#start_button").classList.add("showing");

        document.querySelector("#won_text").classList.remove("hidden");
        document.querySelector("#won_text").classList.add("showing");

    }
}

//starting screen 
const start_button = document.querySelector("#start_button");
const wrapper = document.querySelector(".wrapper");
const timer = document.querySelector("#countdown");
let seconds = document.querySelector("#countdown").textContent;

start_button.addEventListener("click", settingCountdown);

function settingCountdown() {

    document.querySelector("#won_text").classList.add("hidden");
    start_button.classList.add("hidden");
    wrapper.classList.add("blocking");
    timer.classList.add("showing");
    timer.classList.remove("hidden");

    // countdown from https://tonnygaric.com/blog/create-a-seconds-countdown-in-6-lines-of-javascript#:~:text=getElementById(%22countdown%22).,(countdown)%3B%20%7D%2C%201000)%3B

    let counting = setInterval(function () {
        seconds--;
        document.getElementById("countdown").textContent = seconds;
        if (seconds == 0) clearInterval(counting);
        if (seconds == 0) changingScene();
        if (seconds == 0) seconds = 10;
    }, 1000);

}

function changingScene() {

    //hiding timer
    wrapper.classList.add("hidden");
    wrapper.classList.remove("blocking");
    timer.classList.add("hidden");

    //getting a new random window
    const shownElement = windows[Math.floor(Math.random() * windows.length)];

    //looking for the other that are NOT the chosen window
    let otherWindow = windows.filter(function (window) {
        return window != shownElement;
    });

    //changing what is showing
    shownElement.classList.add("showing");
    shownElement.classList.remove("hidden");

    otherWindow.forEach(window => window.classList.add("hidden"));
    otherWindow.forEach(window => window.classList.remove("showing"));

    //doing the same for radiator
    const shownElement_2 = radiators[Math.floor(Math.random() * radiators.length)];

    let otherRadiator = radiators.filter(function (radiator) {
        return radiator != shownElement_2;
    });

    shownElement_2.classList.add("showing");
    shownElement_2.classList.remove("hidden");

    otherRadiator.forEach(radiator => radiator.classList.add("hidden"));
    otherRadiator.forEach(radiator => radiator.classList.remove("showing"));

    //doing the same for Snif

    const randomSnif_2 = snifs[Math.floor(Math.random() * snifs.length)];

    let otherSnifs = snifs.filter(function (snif) {
        return snif != randomSnif_2;
    });

    randomSnif_2.classList.add("showing");
    randomSnif_2.classList.remove("hidden");

    otherSnifs.forEach(snif => snif.classList.add("hidden"));
    otherSnifs.forEach(snif => snif.classList.remove("showing"));
}


