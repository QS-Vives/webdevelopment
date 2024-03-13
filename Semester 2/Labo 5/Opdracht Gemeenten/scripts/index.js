const setup = () => {
    main();
}

const main = () => {
    let selectionElement = document.getElementById("gemeente");
    let optionsArray = [];
    let input = "";

    while (input !== "stop") {
        if (input !== "") {
            let option = document.createElement("option");
            option.text = input;
            optionsArray.push(option)
        }
        input = prompt("Gemeente:") || "";
    }

    optionsArray = optionsArray.sort(optionSorter);

    for (let i = 0; i < optionsArray.length; ++i) {
        selectionElement.options.add(optionsArray[i]);
    }
}

const optionSorter = (a, b) => {
    return a.text.localeCompare(b.text);
}

window.addEventListener("load", setup);