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

function settingScene() {
    const randomElement = windows[Math.floor(Math.random() * windows.length)];

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
}