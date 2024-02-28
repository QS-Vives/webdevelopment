const setup = () => {
    let belangrijks= document.getElementsByClassName("belangrijk");
    for (let i=0; i < belangrijks.length; ++i) {
        belangrijks[i].classList.add("opvallend");
    }
}

window.addEventListener("load", setup);