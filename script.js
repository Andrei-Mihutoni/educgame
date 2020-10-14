const snif = document.querySelector(".logo");

snif.addEventListener("click", addAnimation);

function addAnimation() {

    snif.src = "graphics/icons/winking.png"

    setTimeout(() => {
        snif.src = "graphics/icons/snif.png"
    }, 300);
}