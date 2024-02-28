const setup = () => {
    let slider_r = document.getElementById("color-r");
    let slider_g = document.getElementById("color-g");
    let slider_b = document.getElementById("color-b");

    slider_r.addEventListener("change", update);
    slider_r.addEventListener("input", update);
    slider_g.addEventListener("change", update);
    slider_g.addEventListener("input", update);
    slider_b.addEventListener("change", update);
    slider_b.addEventListener("input", update);
}

const update = () => {
    let slider_r = document.getElementById("color-r");
    let slider_g = document.getElementById("color-g");
    let slider_b = document.getElementById("color-b");
    let label_r = document.getElementById("label-r");
    let label_g = document.getElementById("label-g");
    let label_b = document.getElementById("label-b");
    let swatch = document.getElementById("swatch");

    let value_r = slider_r.value;
    let value_g = slider_g.value;
    let value_b = slider_b.value;

    label_r.textContent = value_r;
    label_g.textContent = value_g;
    label_b.textContent = value_b;

    swatch.style.backgroundColor = `rgb(${value_r}, ${value_g}, ${value_b})`;

}

window.addEventListener("load", setup);