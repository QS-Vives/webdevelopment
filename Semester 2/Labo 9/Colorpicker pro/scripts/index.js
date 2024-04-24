const setup = () => {
    let sliders = document.getElementsByClassName("slider");

    for (let slider of sliders){
        slider.addEventListener("change", update);
        slider.addEventListener("input", update);
    }

    document.getElementById("input_button_save").addEventListener("click", store_event);

    let previous_sliders = localStorage.getItem("sliders");

    if (previous_sliders) {
        restore_sliders(previous_sliders);
    }

     let stored_colors = localStorage.getItem("stored_colors");

    if (stored_colors) {
        restore_colors(stored_colors);
        //document.getElementById("stored_container").innerHTML = JSON.parse(previous_colors);
    }

    update();
}

const update_stored_colors = () => {
    let stored_colors = [];
    for (let swatch of document.getElementsByClassName("stored_swatch")) {
        stored_colors.push(swatch.style.backgroundColor)
    }

    localStorage.setItem("stored_colors", JSON.stringify(stored_colors));
}

const restore_colors = (stored_colors) => {
    let previous_colors = JSON.parse(stored_colors);

    for (let i = 0; i < previous_colors.length; ++i) {
        store(previous_colors[i])
    }
}

const restore_sliders = (previous_sliders) => {
    let previous_values = JSON.parse(previous_sliders);
    let colors = ["r", "g", "b"];

    for (let i = 0; i < colors.length; ++i) {
        document.getElementById(`color_${colors[i]}`).value = previous_values[colors[i]];
    }
}

const update = () => {
    let colors = ["r", "g", "b"];
    let sliders = {};
    let labels = {};
    let values = {};
    for (let color of colors) {
        sliders[color] = document.getElementById(`color_${color}`);
        values[color] = sliders[color].value;
        labels[color] = document.getElementById(`label_${color}`);
        labels[color].textContent = values[color];
    }
    let swatch = document.getElementById("swatch");

    swatch.style.backgroundColor = `rgb(${values["r"]}, ${values["g"]}, ${values["b"]})`;

    localStorage.setItem("sliders", JSON.stringify(values));
}

const store_event = (event, color = "") => {
    store(color);
}

const store = (color = "") => {
    let new_background_color;
    if (color === "") {
        new_background_color = document.getElementById("swatch").style.backgroundColor;
    } else {
        new_background_color = color
    }

    let element = document.importNode(document.getElementById("template_stored_swatch").content, true).firstElementChild;

    element.style.backgroundColor = new_background_color;
    element.addEventListener("click", restore);
    element.getElementsByClassName("input_button_remove")[0].addEventListener("click", remove);

    document.getElementById("stored_container").appendChild(element);

    if (color === "") {
        update_stored_colors();
    }
    //localStorage.setItem("stored_colors", JSON.stringify(document.getElementById("stored_container").innerHTML));

}

const restore = (event) => {
    let background_color = event.currentTarget.style.backgroundColor;
    let background_colors = background_color.match(/\d+/g);
    let colors = ["r", "g", "b"];

    for (let i = 0; i < background_colors.length; ++i) {
        document.getElementById(`color_${colors[i]}`).value = background_colors[i];
    }

    update();

    event.stopPropagation();
}

const remove = (event) => {
    event.currentTarget.parentElement.remove()

    update_stored_colors();

    event.stopPropagation();
}

window.addEventListener("load", setup);
