const setup = () => {
    let sliders = document.getElementsByClassName("slider");

    for (let slider of sliders){
        slider.addEventListener("change", update);
        slider.addEventListener("input", update);
    }

    document.getElementById("input_button_save").addEventListener("click", store);

    update();
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
}

const store = () => {
    let new_background_color = document.getElementById("swatch").style.backgroundColor;
    let element = document.importNode(document.getElementById("template_stored_swatch").content, true).firstElementChild;

    element.style.backgroundColor = new_background_color;
    element.addEventListener("click", restore);
    element.getElementsByClassName("input_button_remove")[0].addEventListener("click", remove);

    document.getElementById("stored_container").appendChild(element);
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

    event.stopPropagation();
}

window.addEventListener("load", setup);
