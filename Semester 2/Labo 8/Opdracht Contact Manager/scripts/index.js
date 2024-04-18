let global = {
    personen: [
        {
            voornaam: 'Jan',
            familienaam: 'Janssens',
            geboorteDatum: new Date('2010-10-10'),
            email: 'jan@example.com',
            aantalKinderen: 0
        },
        {
            voornaam: 'Mieke',
            familienaam: 'Mickelsen',
            geboorteDatum: new Date('1980-01-01'),
            email: 'mieke@example.com',
            aantalKinderen: 1
        },
        {
            voornaam: 'Piet',
            familienaam: 'Pieters',
            geboorteDatum: new Date('1970-12-31'),
            email: 'piet@example.com',
            aantalKinderen: 2
        }
    ],
    current_id: -1
};

// Event listener (btnBewaar click)
// Bewaar de wijzigingen die in de user interface werden aangebracht
const bewaarBewerktePersoon = () => {
    console.log("Klik op de knop bewaar");

    // valideer alle input data en controleer of er geen errors meer zijn
    valideer();

    // indien ok, bewaar de ingegeven data.
    if (document.querySelector(".invalid")) {
        return
    }
    // een nieuw aangemaakte persoon voegen we toe
    // een bestaande persoon in de lijst passen we aan
    if (global.current_id === -1) {
        global.current_id = global.personen.length;
    }

    let inputs = document.querySelectorAll("form input")

    global.personen[global.current_id] = {
        voornaam: inputs[0].value,
        familienaam: inputs[1].value,
        geboorteDatum: new Date(inputs[2].value),
        email: inputs[3].value,
        aantalKinderen: inputs[4].value
    }

    // zorg ervoor dat de naam en voornaam ook aangepast en/of zichtbaar zijn in de lijst na updaten
    update_list();
};

// Event listener (btnNieuw click)
const bewerkNieuwePersoon = () => {
    console.log("Klik op de knop nieuw");

    clearAllErrors();

    // Zet de user interface klaar om de gegevens van een nieuwe persoon in te voeren
    document.querySelector("form").reset();

    global.current_id = -1;
};

const update_list = () => {
    let select_element = document.getElementById("lstPersonen");
    select_element.innerHTML = "";

    for (let i = 0; i < global.personen.length; i++) {
        let option_element = document.createElement("option");
        let persoon = global.personen[i];
        option_element.text = `${persoon.voornaam} ${persoon.familienaam}`;
        option_element.id = i.toString();
        select_element.options.add(option_element);
    }

}

const update_form = () => {
    if (global.current_id < 0) {
        return;
    }
    clearAllErrors();
    let persoon = global.personen[global.current_id];
    let inputs = document.querySelectorAll("form input");
    let properties = ["voornaam", "familienaam", "geboorteDatum", "email", "aantalKinderen"];
    for (let i = 0; i < inputs.length; ++i) {
        let property = persoon[properties[i]];
        if (properties[i] === "geboorteDatum") {
            inputs[i].value = property.getFullYear().toString().padStart(4, "0")
                + "-" + (property.getMonth()+1).toString().padStart(2, "0")
                + "-" + property.getDate().toString().padStart(2, "0");
        } else {
            inputs[i].value = property;
        }
    }
}

const select_person = (event) => {
    if (event.target.tagName.toLowerCase() !== 'option') {
        return
    }
    global.current_id = document.getElementById("lstPersonen").selectedIndex;
    update_form();
}

// onze setup functie die de event listeners registreert
const setup = () => {
    update_list();
    let btnBewaar = document.getElementById("btnBewaar");
    btnBewaar.addEventListener("click", bewaarBewerktePersoon);

    let btnNieuw = document.getElementById("btnNieuw");
    btnNieuw.addEventListener("click", bewerkNieuwePersoon);

    let lstPersonen = document.getElementById("lstPersonen");
    // voeg een change listener toe aan lstPersonen. Bij het klikken op een option element in de lijst
    // moet de data van die persoon getoond worden in het formulier
    lstPersonen.addEventListener("click", select_person);
};

window.addEventListener("load", setup);