const setup = () => {
    document.getElementById("nieuw").focus();
    document.getElementById("nieuw").addEventListener("click", new_game);
    document.getElementById("gok").disabled = true;
    document.getElementById("go").disabled = true;
    document.getElementById("go").addEventListener("click", validate_input);
    document.getElementById("highscores").appendChild(document.createElement("ol"));
    document.getElementById("clear").addEventListener("click", clear_highscores);
    restore_highscores();
}

const new_game = () => {
    let username = null;
    do {
        username = prompt("Naam speler:")?.trim() || null;
    } while (username === null || username.length === 0)

    document.getElementById("gokken").innerHTML = "";
    document.getElementById("gok").disabled = false;
    document.getElementById("go").disabled = false;
    document.getElementById("nieuw").classList.add("hidden");
    document.body.setAttribute("data-word_id", Math.floor(Math.random() * get_words().length).toString());
    document.body.setAttribute("data-username", username);
}

const game_won = () => {
    let amount_of_guess = document.querySelectorAll("#gokken div").length / 6;
    let username = document.body.getAttribute("data-username");
    let now = new Date();
    let months = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
    let string = `${username}: ${amount_of_guess} gok(ken)\n[${now.getDay()} ${months[now.getMonth()]} om ${now.getHours()}:${now.getMinutes()}]`;
    let highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    highscores.push({amount_of_guess: amount_of_guess, string: string});
    highscores.sort((a, b) => a.amount_of_guess - b.amount_of_guess)
    localStorage.setItem("highscores", JSON.stringify(highscores));
    restore_highscores()

    document.getElementById("gok").disabled = true;
    document.getElementById("go").disabled = true;
    document.getElementById("nieuw").classList.remove("hidden");
}

const get_words = () => {
    return ["stijl", "steun", "games"];
}

const validate_input = () => {
    let input_element = document.getElementById("gok");
    let input = input_element.value;
    input_element.value = "";
    input = input.replaceAll(" ", "");
    if (input.length !== 5) return;
    let correct_word = get_words()[document.body.getAttribute("data-word_id")];

    let guess_container = document.createElement("div");

    let correct = true;
    for (let index = 0; index < 5 ; index++) {
        let letter_div = document.createElement("div");
        letter_div.innerText = input[index].toUpperCase();
        if (correct_word.indexOf(input[index]) === index) {
            letter_div.classList.add("juist");
        } else if (correct_word.indexOf(input[index]) !== -1) {
            letter_div.classList.add("bevat");
            correct = false;
        } else {
            letter_div.classList.add("fout");
            correct = false;
        }
        letter_div.addEventListener("click", show_hint);
        guess_container.appendChild(letter_div);
    }

    document.getElementById("gokken").appendChild(guess_container);

    if (correct) game_won();

}

const restore_highscores = () => {
    document.querySelector("#highscores ol").innerHTML = "";
    let highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    for (let highscore of highscores) {
        let new_element = document.createElement("li");
        new_element.innerText = highscore.string;
        document.querySelector("#highscores ol").appendChild(new_element);
    }
}

const show_hint = (event) => {
    {
        let timer_id = document.getElementsByTagName("p")[0].getAttribute("data-timer_id");
        if (timer_id) clearTimeout(parseInt(timer_id));
    }
    let letter = event.target.innerText;
    let classname = event.target.classList.toString();
    let string;
    switch (classname) {
        case "juist":
            string = `'${letter}' staat op de juiste plaats.`;
            break;
        case "bevat":
            string = `'${letter}' zit in het woord maar staat niet op de juiste plaats.`;
            break;
        case "fout":
            string = `'${letter}' zit niet in het woord.`;
    }

    let help_element = document.getElementsByTagName("p")[0];
    help_element.innerText = string;
    help_element.classList.remove("hidden");
    
    document.getElementsByTagName("p")[0].setAttribute("data-timer_id", setTimeout(remove_hint, 2500).toString())

    return false;
}

const remove_hint = () => {
    document.getElementsByTagName("p")[0].classList.add("hidden");
}

const clear_highscores = () => {
    document.querySelector("#highscores ol").innerHTML = "";
    localStorage.setItem("highscores", "[]");
}

window.addEventListener("load", setup);