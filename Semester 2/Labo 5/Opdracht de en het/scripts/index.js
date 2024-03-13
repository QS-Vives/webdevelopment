const setup = () => {
    document.getElementById("replace").addEventListener("click", replace);
}

const replace = () => {
    let inputElement = document.getElementById("input");
    let outputElement = document.getElementById("output");

    let text = inputElement.value;

    text = text.split(" ")

    for (let i = 0; i < text.length; ++i) {
        switch (text[i]) {
            case "de":
                text[i] = "het";
                break;
            case "De":
                text[i] = "Het";
                break;
            case "DE":
                text[i] = "HET";
                break;
            case "dE":
                text[i] = "heT";
                break;
        }
    }

    outputElement.innerText = text.join(" ");
}

window.addEventListener("load", setup);