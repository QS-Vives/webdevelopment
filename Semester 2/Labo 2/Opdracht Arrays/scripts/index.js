const setup = () => {
    let family = ["a", "b", "c", "d", "e"];
    console.log(family.length);
    for (let i = 0; i < 5; i+=2) {
        console.log(family[i]);
    }
    const voegNaamToe = (array) => {
        array.push(prompt("Element om toe te voegen: "));
    }

    voegNaamToe(family);

    console.log(family)

    console.log(family.toString())
}

window.addEventListener("load", setup);

/*
Maak een array met namen van familieleden aan. Zorg dat er minimaal vijf zijn. Voer daarmee
volgende opdrachten uit:
- schrijf naar de console hoeveel elementen de array bevat
- schrijf het eerste, derde en vijfde element uit de array naar de console
- Vraag met prompt() een extra naam op en voeg deze toe aan de Array. Probeer dit via een zelf
geschreven functie VoegNaamToe. Maak gebruik van pass-by-reference. Schrijf vervolgens het
resultaat naar de console.
- Converteer de array naar een string en toon deze op de console.
 */