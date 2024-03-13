const setup = () => {
    document.getElementById("submit").addEventListener("click", output);
}

const output = () => {
    console.log(document.getElementById("is_roker").checked ? "is een roker" : "is geen roker");
    console.log(`moedertaal is ${document.querySelector("input[name='taal']:checked")?.value || "niet geselecteerd"}`);
    console.log(`favoriete buurland is ${document.getElementById("favorite_country").value}`);
    console.log(`bestelling bestaat uit ${Array.from(document.getElementById("order").selectedOptions, option => option.value).join(" ") || "niets"}`);

    console.log("--- alternatief indien ander bericht gewenst bij geen bestelling, implementatie is langer ---")
    console.log((o => o.length ? `bestelling bestaat uit ${o.join(" ")}` : "geen bestelling geselecteerd")(Array.from(document.getElementById("order").selectedOptions, option => option.value)));

    console.log("-".repeat(80));
}

window.addEventListener("load", setup);
