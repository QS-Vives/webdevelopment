const setup = () => {
    document.getElementById("run").addEventListener("click", run);
    run()
}

const run = () => {
    let text = document.getElementById("input").value;

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