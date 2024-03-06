const setup = () => {
    document.getElementById("to_spaties").addEventListener("click", update);
}

const update = () => {
    let input_elem = document.getElementById("input_text");

    console.log(maakMetSpaties(input_elem.value));
}

const maakMetSpaties = (inputText) => {
    let result="";

    for (let i=0; i < inputText.length; ++i) {
        if (inputText.charAt(i) !== " ") {
            result += inputText.charAt(i);
        }
        result += " ";
    }

    return result.slice(0, -1);
}

window.addEventListener("load", setup);