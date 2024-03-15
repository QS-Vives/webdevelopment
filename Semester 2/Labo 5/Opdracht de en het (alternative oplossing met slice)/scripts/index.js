const setup = () => {
    document.getElementById("replace").addEventListener("click", replace);
}

const replace = () => {
    let inputElement = document.getElementById("input");
    let outputElement = document.getElementById("output");

    let text = inputElement.value;
    let pointer = -1;

    do {
        if (text[pointer + 3] === " " || ! text[pointer + 3]) {
            pointer++;
            switch (text.slice(pointer, pointer + 2)) {
                case "de":
                    text = text.slice(0, pointer) + "het" + text.slice(pointer + 2);
                    break;
                case "De":
                    text = text.slice(0, pointer) + "Het" + text.slice(pointer + 2);
                    break;
                case "DE":
                    text = text.slice(0, pointer) + "HET" + text.slice(pointer + 2);
                    break;
                case "dE":
                    text = text.slice(0, pointer) + "heT" + text.slice(pointer + 2);
                    break;
            }
        }
        pointer = text.indexOf(" ", pointer + 1);
    } while (pointer !== -1);

    outputElement.innerText = text;
}

window.addEventListener("load", setup);