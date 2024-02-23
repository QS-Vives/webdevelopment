const setup = () => {
    let button = document.getElementById("button_substring");
    button.addEventListener("click", extract_substring);
}

const extract_substring = () => {
    let input_string = document.getElementById("input_text").value;
    let output_field = document.getElementById("output_text");
    let start = document.getElementById("input_number_start").value;
    let end = document.getElementById("input_number_end").value;
    output_field.innerText = input_string.substring(start, end);
}

window.addEventListener("load", setup);