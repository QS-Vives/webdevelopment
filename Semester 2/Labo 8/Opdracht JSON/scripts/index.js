const setup = () => {
    let student1 = {
    voornaam: "Jan",
    familienaam: "Janssens",
    geboorteDatum: new Date("1993-12-31"),
    adres: {
        straat: "Kerkstraat 13",
        postcode: "8500",
        gemeente: "Kortrijk"
    },
    adres: {
        straat: "Kerkstraat 13",
        postcode: "8500",
        gemeente: "Wevelgem"
    },
    isIngeschreven: true,
    namenVanExen: ["Sofie", "Berta", "Philip", "Albertoooo"],
    aantalAutos: 2
    };

    let string = JSON.stringify(student1);

    console.log(string);

    let parsed = JSON.parse(string);

    console.log(parsed)
}

window.addEventListener("load", setup);