const setup = () => {
    document.getElementById("submit").addEventListener("click", output);
}

const output = () => {
    console.log(document.getElementById("is_roker").checked ? "is een roker" : "is geen roker");
    console.log(`moedertaal is ${document.querySelector("input[name='moedertaal']:checked")?.value || "niet geselecteerd"}`);
    console.log(`favoriete buurland is ${document.getElementById("favorite_country").value}`);
    console.log(`bestelling bestaat uit ${Array.from(document.getElementById("bestelling").selectedOptions, option => option.value).join(" ") || "niets"}`);
}

window.addEventListener("load", setup);
