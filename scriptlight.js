// document.querySelector("DOMContentLoaded", start);

start();
async function start() {
  let response = await fetch("./Rooms-01.svg");
  let mySvgData = await response.text();
  document.querySelector("#svgWrapper").innerHTML = mySvgData;
  initSvg();
}

function initSvg() {
  for (let i = 0; i <= 4; i++) {
    document.querySelector(`#room${i + 1}`).setAttribute("filter", "url(#myFilter)");
    document.querySelector(`#room${i + 1}`).addEventListener("click", function () {
      console.log("caca");
      if (document.querySelector(`#room${i + 1}`).toggleAttribute("filter")) {
        document.querySelector(`#room${i + 1}`).setAttribute("filter", "url(#myFilter)");
      } else {
        document.querySelector(`#room${i + 1}`).removeAttribute("filter");
      }
    });
  }
}
