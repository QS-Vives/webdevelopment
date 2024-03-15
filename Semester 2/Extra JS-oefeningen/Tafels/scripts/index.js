const main = () => {
    let input_field = document.getElementById("input")
    let input_value = input_field.value;

    input_field.value = "";

    if (! isFinite(input_value)) {
        alert("Gelieve een getal in te voeren!");
        return;
    }

    let creation_time = get_time();
    let tafels_container_element = document.getElementById("tafels_container");
    let old_tafels = [];

    for (let element of tafels_container_element.children) {
        let number = element.getAttribute("data-number");
        let creation_date = element.getAttribute("data-creation-time");
        old_tafels.push([number, creation_date]);
    }

    tafels_container_element.innerHTML = "";

    for (let element of old_tafels) {
        add_tafel(element[0], element[1])
    }

    add_tafel(input_value, creation_time);
}

const get_time = () => {
    return new Date().toLocaleTimeString('nl-BE', {hour12: false});
}

const add_tafel = (number, creation_time) => {
    let template_element = document.getElementById("tafel_template");

    let new_tafel = document.importNode(template_element.content, true).firstElementChild;

    new_tafel.setAttribute("data-number", number);
    new_tafel.setAttribute("data-creation-time", creation_time);

    new_tafel.firstElementChild.innerHTML = `Tafel van ${number} aangemaakt op: ${creation_time}`;

    let tafel_body = new_tafel.getElementsByClassName("tafel_body")[0];

    for (let i = 0; i < tafel_body.children.length; ++i) {
        tafel_body.children[i].innerHTML = `${number} x ${i + 1} = ${number * (i + 1)}`;
    }

    document.getElementById("tafels_container").appendChild(new_tafel);
}

