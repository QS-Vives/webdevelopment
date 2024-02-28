const setup = () => {
    document.getElementById("herbereken").addEventListener("click", update);
}

const update = () => {
    let price_elements = document.getElementsByClassName("prijs");
    let amount_elements = document.getElementsByClassName("aantal");
    let btw_elements = document.getElementsByClassName("btw");
    let subtotal_elements = document.getElementsByClassName("subtotaal");
    let total_element = document.getElementById("totaal");

    let total = 0;

    for (let i=0; i < subtotal_elements.length; ++i) {
        let without_btw = parseFloat(price_elements[i].textContent) * amount_elements[i].value ;
        let with_btw = without_btw + without_btw * parseFloat(btw_elements[i].textContent) / 100;
        subtotal_elements[i].textContent = with_btw.toFixed(2) + " Eur";
        total += with_btw;
    }

    total_element.innerText = total.toFixed(2) + " Eur";
}

window.addEventListener("load", setup);