let global = {
    game_width: 20,
    game_height: 10,
    game_elements: 20 * 10,
    game_state: "playing",
    key: "ArrowRight",
    last_move_key: "ArrowLeft"
}

const setup = () => {
    document.addEventListener('keydown', handle_key_press);
    main_loop().then();
}

const update_settings = () => {
    global.game_state = "resetting"
    let walls = document.getElementsByName("walls")[0].checked;
    global.game_width = + document.getElementsByName("game_width")[0].value;
    global.game_height = + document.getElementsByName("game_height")[0].value;
    if (walls) {
        global.game_width = global.game_width + 2;
        global.game_height = global.game_height + 2;
    }

    global.game_elements = global.game_width * global.game_height;

    document.getElementsByClassName("game_container")[0].style.gridTemplateColumns = `repeat(${global.game_width}, 1fr)`;

    if (global.game_elements > 5000) {throw error}
    populate(walls);
    global.game_state = "reset_done"
}

const global_index_to_coordinates = (index) => {
    let x = index % global.game_width;
    let y = Math.floor(index / global.game_width);

    return [x, y]
}

const coordinates_to_global_index = (x, y) => {
    return global.game_width * y + x;
}

const change_coordinates = (x, y) => {
    x = x % global.game_width;
    if (x < 0) x = global.game_width - 1;
    y = y % global.game_height;
    if (y < 0) y = global.game_height - 1;

    return [x, y]
}

const populate = (walls) => {
    let game_container = document.getElementsByClassName("game_container")[0];

    game_container.innerHTML = "";

    for (let i = 0; i < global.game_elements; ++i) {
        let node = document.createElement("div");
        node.className = "square";
        node.id = i.toString();
        game_container.appendChild(node);
    }
    if (walls) {
        for (let i = 0; i < global.game_width; ++i) {
            document.getElementById(coordinates_to_global_index(i, 0)).classList.add("wall");
            document.getElementById(coordinates_to_global_index(i, global.game_height - 1)).classList.add("wall");
        }
        for (let i = 1; i < global.game_height - 1; ++i) {
            document.getElementById(coordinates_to_global_index(0, i)).classList.add("wall");
            document.getElementById(coordinates_to_global_index(global.game_width - 1, i)).classList.add("wall");
        }
    }
}

const main_loop =  async () => {

    while (global.key !== "S") {

        toggle_settings_enabled(false);

        update_settings();

        let walls = document.getElementsByName("walls")[0].checked;

        let head;
        walls ? head = [0, 1] : head = [-1, 0];
        let snake_indexes = []
        let length = 1;
        let tail = global.game_elements - 1;
        let got_apple = false;
        set_new_apple();

        global.game_state = "playing";
        global.key = "ArrowRight";

        let step = 0

        while (global.game_state === "playing") {

            step++;

            if (global.key === " ") {
                global.game_state = "paused";
                global.key = "";
            }

            while (global.game_state === "paused") {
                await delay(20);
                if (global.key === " ") {
                    global.key = global.last_move_key;
                    global.game_state = "playing";
                }
            }

            switch (global.key) {
                case "ArrowRight":
                    head = change_coordinates(head[0] + 1, head[1]);
                    global.last_move_key = "ArrowRight";
                    break;
                case "ArrowLeft":
                    head = change_coordinates(head[0] - 1, head[1]);
                    global.last_move_key = "ArrowLeft";
                    break;
                case "ArrowDown":
                    head = change_coordinates(head[0], head[1] + 1);
                    global.last_move_key = "ArrowDown";
                    break;
                case "ArrowUp":
                    head = change_coordinates(head[0], head[1] - 1);
                    global.last_move_key = "ArrowUp";
                    break;
            }

            if (step % 5 === 0) { //TODO
                try {let old_bomb_coordinates = global_index_to_coordinates(document.querySelector(".square.bomb").id);
                remove_old_bomb_at(old_bomb_coordinates[0], old_bomb_coordinates[1]); }
                catch (e) {}
                set_new_bomb(head[0], head[1]);
            }

            if (document.getElementById(coordinates_to_global_index(head[0], head[1])).classList.contains("apple")) {
                remove_old_apple_at(head[0], head[1]);
                set_new_apple();
                set_new_apple();

                update_score(length);
                got_apple = true;
            }

            if (check_game_over(head[0], head[1])) {
                global.game_state = "game_over";
                console.log("game")
                break
            }

            snake_indexes.push(coordinates_to_global_index(head[0], head[1]));

            console.log(snake_indexes)

            set_snake_at_index(snake_indexes[snake_indexes.length - 1]);

            if (got_apple) {
                length++;
                got_apple = false;
            } else {
                reset_at_index(tail);
                tail = snake_indexes.shift();
            }
            console.log(length)
            //let del = get_delay_amount(300, 50, length);
            //console.log(del)
            await delay(get_delay_amount(length));


            //
            // for (let i = 0; i < GAME_ELEMENTS; i++) {
            //     document.getElementById(i.toString()).classList.add("snake");
            //     let previous = i - 1;
            //     if (previous < 0) previous = GAME_ELEMENTS - 1;
            //     document.getElementById(previous.toString())?.classList.remove("snake");
            //     await delay(50); // introduce a delay of 'x' milliseconds
            // }
        }

        toggle_settings_enabled(true)

        while (global.game_state !== "reset_done") {
            await delay(2000);
        }

    }

}

const check_game_over = (x, y) => {
    let class_list = document.getElementById(coordinates_to_global_index(x, y)).classList
    return class_list.contains("snake") || class_list.contains("wall")
}

const set_snake_at_index = (index) => {
    document.getElementById(index.toString()).classList.add("snake")
}

const set_new_apple = () => {
    let tile = find_free_tile();
    if (tile) {
        tile.classList.add("apple");
    }
}

const set_new_bomb = (not_at_x, not_at_y) => {
    let tile = find_free_tile(not_at_x, not_at_y);
    if (tile) {
        tile.classList.add("bomb");
    }
}

const find_free_tile = (not_at_x = -1, not_at_y = -1) => {
    let tile;
    let x;
    let y;
    let attempts = 0;

    while (!tile || tile.classList.contains("snake")
    || tile.classList.contains("wall") || tile.classList.contains("apple")) {
        x = Math.floor(Math.random() * global.game_width);
        y = Math.floor(Math.random() * global.game_height);
        attempts++;
        if (x !== not_at_x && y !== not_at_y) {
            tile = document.getElementById(coordinates_to_global_index(x, y));
            if (attempts > 20) {
                tile = document.querySelector(".square:not(.snake):not(.apple):not(.wall):not(.bomb)");
                if (!tile) return;
            }
        }
    }
    return tile;
}

const remove_old_apple_at = (x, y) => {
    let tile = document.getElementById(coordinates_to_global_index(x, y));
    tile.classList.remove("apple")
}

const remove_old_bomb_at = (x, y) => {
    let tile = document.getElementById(coordinates_to_global_index(x, y));
    tile.classList.remove("bomb")
}

const reset_at_index = (index) => {
    document.getElementById(index.toString()).classList.remove("snake")
}

const handle_key_press = (event) => {
    console.log(event.key)
    if (event.key !== key_reverse(global.last_move_key)) {
        global.key = event.key;
    }
}

const key_reverse = (key) => {
    switch (key) {
        case "ArrowRight":
            return "ArrowLeft";
        case "ArrowLeft":
            return "ArrowRight";
        case "ArrowDown":
            return "ArrowUp";
        case "ArrowUp":
            return "ArrowDown";

    }
}

const toggle_settings_enabled = (bool) => {
    let form_element = document.getElementById("form_settings");
    let form_elements = form_element.elements;

    for (let element of form_elements) {
        element.disabled = !bool;
    }

}

const get_delay_amount = (snake_length) => {
    let longest_delay = tiles_per_second_to_ms(+ document.getElementsByName("game_speed_start")[0].value);
    let shortest_delay = tiles_per_second_to_ms(+ document.getElementsByName("game_speed_end")[0].value);
    let walls = document.getElementsByName("walls")[0].checked;
    let playable_elements = (global.game_width - 2 * walls) * (global.game_height - 2 * walls);
    let claimed_percent = snake_length / playable_elements;
    return Math.round(shortest_delay + ((longest_delay - shortest_delay) * (1 - claimed_percent)));
}

const tiles_per_second_to_ms = (tiles_per_second) => {
    return 1000 / tiles_per_second;
}

const update_score = (length) => {
    document.getElementById("display_score").innerText = (length).toString();
}

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.addEventListener("load", setup);