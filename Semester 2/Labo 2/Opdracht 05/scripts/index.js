const setup = () => {
    let buttonWijzig = document.getElementById("wijzig");
    buttonWijzig.addEventListener("click", wijzig)
}

const wijzig = () => {
    let pElement=document.getElementById("txtOutput");
    pElement.innerHTML="Welkom!";
}

window.addEventListener("load", setup);