const setup = () => {
    document.getElementById("validate").addEventListener("click", main);
};

const main = () => { // in deze oplossing is de validator functie veralgemeent om code duplicatie te voorkomen
    validator("voornaam", new Map([
        ["max. 30 karakters", value => value.length > 30]
    ]));

    validator("naam", new Map([
        ["max. 50 karakters", value => value.length > 50],
        ["verplicht", value => value.length === 0]
    ]));

    validator("geboorte_datum", new Map([
        ["verplicht", value => value.length === 0],
        ["formaat is niet jjjj-mm-dd", value => ! /^\d{4}-\d{2}-\d{2}$/.test(value)],
        // test voor geldige datum, houdt geen rekening met maanden van minder dan 31 dagen
        ["geen geldige datum", value => ! /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])$/.test(value)]
    ]));

    validator("email", new Map([
        ["verplicht", value => value.length === 0],
        ["geen geldig email adres", value => ! /^[^@\n]+@[^@\n]+$/.test(value)]
    ]));

    validator("aantal_kids", new Map([
        ["is geen positief getal", value => isNaN(value) || value.length === 0 || value < 0],
        ["is te vruchtbaar", value => value > 99]
    ]));
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

const validator = (input_name, errors_and_check) => {
    let input_value = document.getElementById(`input_${input_name}`).value.trim();
    let invalid = false;
    for (let [error, check] of errors_and_check) {
        if (check(input_value)) {
            add_error(input_name, error);
            invalid = true;
            break;
        }
    }
    if (!invalid) remove_error(input_name);
}

window.addEventListener("load", setup);
