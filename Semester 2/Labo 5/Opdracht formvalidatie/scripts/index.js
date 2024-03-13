const setup = () => {
    document.getElementById("validate").addEventListener("click", validate);
};

const validate = () => {
    valideer_voornaam();
    valideer_naam();
    valideer_geboorte_datum();
    valideer_email();
    valideer_aantal_kids();
};

const add_error = (element_name, message) => {
    let input_element = document.getElementById(`input_${element_name}`);
    let error_element = document.getElementById(`error_${element_name}`);

    input_element.classList.add("invalid");
    error_element.innerText = message;
}

const remove_error = (element_name) => {
    let input_element = document.getElementById(`input_${element_name}`);
    let error_element = document.getElementById(`error_${element_name}`);

    input_element.classList.remove("invalid");
    error_element.innerText = "";
}

const valideer_voornaam = () => {
    let input_name = "voornaam"
    let input_element = document.getElementById(`input_${input_name}`);
    let input_value = input_element.value.trim();
    if (input_value.length > 30) add_error(input_name, "max. 30 karakters");
    else remove_error(input_name);
};

const valideer_naam = () => {
    let input_name = "naam"
    let input_element = document.getElementById(`input_${input_name}`);
    let input_value = input_element.value.trim();
    if (input_value.length === 0) add_error(input_name, "verplicht");
    else if (input_value.length > 50) add_error(input_name, "max. 50 karakters");
    else remove_error(input_name);
};

const valideer_geboorte_datum = () => {
    let input_name = "geboorte_datum"
    let input_element = document.getElementById(`input_${input_name}`);
    let input_value = input_element.value.trim();
    if (input_value.length === 0) add_error(input_name, "verplicht");
    else if (! /^\d{4}-\d{2}-\d{2}$/.test(input_value) ) add_error(input_name, "formaat is niet jjjj-mm-dd");
    else if (! /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/.test(input_value) ) add_error(input_name, "geen geldige datum");
    else remove_error(input_name);
};

const valideer_email = () => {
    let input_name = "email"
    let input_element = document.getElementById(`input_${input_name}`);
    let input_value = input_element.value.trim();
    if (input_value.length === 0) add_error(input_name, "verplicht");
    else if (! /^[^@\n]+@[^@\n]+$/.test(input_value)) add_error(input_name, "geen geldig email adres");
    else remove_error(input_name);
};

const valideer_aantal_kids = () => {
    let input_name = "aantal_kids"
    let input_element = document.getElementById(`input_${input_name}`);
    let input_value = input_element.value.trim();
    if (isNaN(input_value) || input_value.length === 0 || input_value < 0) add_error(input_name, "is geen positief getal");
    else if (input_value > 99) add_error(input_name, "is te vruchtbaar");
    else remove_error(input_name);
};

window.addEventListener("load", setup);