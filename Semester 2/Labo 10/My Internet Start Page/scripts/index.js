const setup = () => {
    populate_history();
}

const populate_history = () => {
    document.getElementById("history_container").innerHTML = "";
    let card_array = JSON.parse(localStorage.getItem("card_array"));
    if (! card_array) return;

    add_rows(Math.floor(card_array.length / 3));

    let max_index = card_array.length - 1

    for (let index = max_index; index >= 0; --index) {
        add_card_to_element(get_column(max_index - index), card_array[index]);
    }
}

const execute_command = () => {
    let input_element = document.getElementById("input_command");
    let input = input_element.value;
    if (input[0] !== "/" || input[2] !== " ") {
        alert("Invalid command");
        return;
    }
    if (input[0] === "/" && ! ["g", "y", "t", "i"].includes(input[1])) {
        alert("Unknown command prefix");
        return;
    }

    let title, text, url;

    switch (input[1]) {
        case "g":
            title = "Google";
            text = input.slice(3);
            url = `https://www.google.com/search?q=${text}`;
            break;

        case "y":
            title = "Youtube";
            text = input.slice(3);
            url = `https://www.youtube.com/results?search_query=${text}`;
            break;
            
        case "t":
            title = "Twitter";
            text = input.slice(3);
            url = `https://twitter.com/search?q=${text}`;
            break;
            
        case "i":
            title = "Instagram";
            text = input.slice(3);
            url = `https://www.instagram.com/explore/tags/${text}`;
            break;
    };

    let search_object = {
        title: title,
        text: text,
        url: url
    };

    add_card_to_array(search_object);

    window.open(url, '_blank');

    populate_history();

    input_element.value = "";

}

get_color = (website, index=0) => {
    let colors = {
        Youtube: [
            "#ff0000",
            "#282828",
            "#ffffff"
        ],
        Instagram: [
            "#c32aa3",
            "#4c5fd7",
            "#7232bd"
        ],
        Google: [
            "#4285f4",
            "#ea4335",
            "#34a853"
        ],
        Twitter: [
            "#1da1f2",
            "#14171a",
            "#aab8c2"
        ]
    };

    return colors[website][index];
}

const get_column = (index) => {
    let row_index = Math.floor(index / 3);
    let col_index = index % 3;
    
    let row = document.getElementsByClassName("row")[row_index];
    let column = row.getElementsByClassName("col")[col_index];

    return column;
}

const add_card_to_array = (card_object) => {
    let card_array = JSON.parse(localStorage.getItem("card_array")) || [];
    card_array.push(card_object);
    localStorage.setItem("card_array", JSON.stringify(card_array));
}

const add_card_to_element = (element, card_object) => {
    let new_card = document.importNode(document.getElementById("template_card").content, true).firstElementChild;
    new_card.getElementsByClassName("card-title")[0].innerText = card_object["title"];
    new_card.getElementsByClassName("card-text")[0].innerText = card_object["text"];
    new_card.style.backgroundColor = get_color(card_object["title"]);
    let button = new_card.getElementsByClassName("btn")[0];
    let button_color = get_color(card_object["title"], 1);
    button.style.backgroundColor = button_color;
    button.style.borderColor = button_color;
    button.href = card_object["url"];
    element.appendChild(new_card);
}

const add_rows = (amount) => {
    for (let index = 0; index <= amount; index++) {
        let new_row = document.importNode(document.getElementById("template_row").content, true).firstElementChild;
        document.getElementById("history_container").appendChild(new_row);
    }
}

window.addEventListener("load", setup);