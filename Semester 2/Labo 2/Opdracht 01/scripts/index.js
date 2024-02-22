const setup = () => {
    console.log(window.confirm("Confirm"));
    console.log(window.prompt("Prompt"));
}

window.addEventListener("load", setup);

/*
[OK] Probeer eerst eens elk van de drie soorten popups uit in een javascript programma.
[OK] Zet daarna de return value van de confirm call op de console en probeer uit met zowel op 'ok' als op
'cancel' te klikken.
• Wat is de return value van de confirm functie als de gebruiker op een van de buttons klikt?
    true of false
Zet nu de return value van de prompt call op de console als je een tekst intypt en op 'ok' drukt.
• Wat is de return value van de prompt functie als de gebruiker een tekst intypt en op 'ok' klikt?
    de tekst
• Wat is de return value van de prompt functie als de gebruiker op 'cancel' klikt?
    null
 */