const setup = () => {
    document.getElementById("run").addEventListener("click", run);
    run()
}

const run = () => {
    /*  deze functie is specifiek enkel voor 1 woord, indien de gebruiker een spatie typt in het woord
        wordt dit gezien als user error en behandeld alsof het 1 woord is */
    let text = document.getElementById("input").value.replaceAll(" ", "");

    if (text.length < 3) return;
    else if (text.length === 3) {
        console.log(text);
        return;
    }

    for (let i = 0; i < text.length - 2; ++i) {
        console.log(text.slice(i, i+3));
    }
}

window.addEventListener("load", setup);