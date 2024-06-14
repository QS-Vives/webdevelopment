//TODO finish controls popup 
//TODO finish dead screen popup 
//TODO close popup when game start
//TODO high score saving 
//TODO bugtest
//BUG head direction disapear on pause
//TODO add button controls 
//TODO if state playing and page closed -> save game, change state to paused
//TODO move tail first, then check for head collison
//TODO bomb every 11 steps -> last step no bomb for one step
//BUG bombs do not gameover
//BUG sometimes apples don't count
//TODO remember setting
//TODO reset settings [button]


let global = {
    game: {
        width: 20,
        height: 10,
        elements: 20 * 10,
        state: "init",
        step: 0,
        snake: {
            head: [0, 0],
            indexes: [],
            tail: 0,
            length: 0
        }
    },
    key: "ArrowRight",
    last_move_key: "ArrowLeft"
}

const setup = () => {
    document.addEventListener('keydown', handle_key_press);
    for (let element of document.getElementsByClassName("popup_close_button")) {
        element.addEventListener("click", close_popup);
    }
    for (let element of document.getElementsByClassName("popup_open_button")) {
        element.addEventListener("click", open_popup);
    }
    document.getElementById("form_settings").addEventListener("input", settings_changed);
    global.game.state = "reset";
    main_loop();
}

const update_settings = () => {
    let walls = document.getElementsByName("walls")[0].checked;
    global.game.width = + document.getElementsByName("game_width")[0].value;
    global.game.height = + document.getElementsByName("game_height")[0].value;
    if (walls) {
        global.game.width = global.game.width + 2;
        global.game.height = global.game.height + 2;
    }

    global.game.elements = global.game.width * global.game.height;

    document.getElementsByClassName("game_container")[0].style.gridTemplateColumns = `repeat(${global.game.width}, 1fr)`;

    if (global.game.elements > 5000) {throw error}
    populate(walls);
}

const global_index_to_coordinates = (index) => {
    let x = index % global.game.width;
    let y = Math.floor(index / global.game.width);

    return [x, y]
}

const coordinates_to_global_index = (x, y) => {
    return global.game.width * y + x;
}

const change_coordinates = (x, y) => {
    x = x % global.game.width;
    if (x < 0) x = global.game.width - 1;
    y = y % global.game.height;
    if (y < 0) y = global.game.height - 1;

    return [x, y]
}

const populate = (walls) => {
    let game_container = document.getElementsByClassName("game_container")[0];

    game_container.innerHTML = "";

    for (let i = 0; i < global.game.elements; ++i) {
        let node = document.createElement("div");
        node.className = "square";
        node.id = i.toString();
        game_container.appendChild(node);
    }
    if (walls) {
        for (let i = 0; i < global.game.width; ++i) {
            document.getElementById(coordinates_to_global_index(i, 0)).classList.add("wall");
            document.getElementById(coordinates_to_global_index(i, global.game.height - 1)).classList.add("wall");
        }
        for (let i = 1; i < global.game.height - 1; ++i) {
            document.getElementById(coordinates_to_global_index(0, i)).classList.add("wall");
            document.getElementById(coordinates_to_global_index(global.game.width - 1, i)).classList.add("wall");
        }
    }
}

const main_loop = () => {

    while (true) {

        if (global.game.state === "await_start" || global.game.state === "stopped") {
            setTimeout(main_loop, 200);
            return;
        }

        if (global.game.state === "game_over") {
            document.getElementById("popup_game_over").classList.remove("no_display");

            toggle_settings_enabled(true);
            global.game.state = "stopped";
            setTimeout(main_loop, 200);
            return;
        }

        if (global.game.state === "reset" || global.game.state === "reset_into_playing") {

            update_settings()

            let walls = document.getElementsByName("walls")[0].checked;

            walls ? global.game.snake.head = [0, 1] : global.game.snake.head = [-1, 0];
            global.game.snake.indexes = [];
            global.game.snake.length = 1;
            update_score(1);
            global.game.snake.tail = global.game.elements - 1;
            set_new_classname_at_free_tile("apple");

            global.key = "ArrowRight";

            global.game.step = 0

            if (global.game.state === "reset") {
                global.game.state = "await_start";
            } else {
                global.game.state = "playing";
            }

            setTimeout(main_loop, 200);
            return;
        }

        if (global.key === " ") {
            if (global.game.state === "playing") {
                global.game.state = "paused";
                toggle_settings_enabled(true);
                global.key = global.last_move_key;
            } else {
                close_any_open_popup();
                toggle_settings_enabled(false);
                global.game.state = "playing";
                global.key = global.last_move_key;
            }
        }

        if (global.game.state === "paused") {
            setTimeout(main_loop, 100);
            return;
        }

        if (global.game.state === "playing") {
            document.getElementById("game_container").focus();
            
            toggle_settings_enabled(false);


            let head = global.game.snake.head;
            let snake_indexes = global.game.snake.indexes;
            let tail = global.game.snake.tail;
            let length = global.game.snake.length;

            switch (global.key) {
                case "ArrowDown":
                    head = change_coordinates(head[0], head[1] + 1);
                    global.last_move_key = "ArrowDown";
                    break;
                case "ArrowUp":
                    head = change_coordinates(head[0], head[1] - 1);
                    global.last_move_key = "ArrowUp";
                    break;
                case "ArrowLeft":
                    head = change_coordinates(head[0] - 1, head[1]);
                    global.last_move_key = "ArrowLeft";
                    break;
                case "ArrowRight":
                    head = change_coordinates(head[0] + 1, head[1]);
                    global.last_move_key = "ArrowRight";
                    break;
            }

            if (global.game.step % 10 === 0) {
                let amount_bombs = document.getElementById("input_number_bombs").value;
                let current_bombs = document.querySelectorAll(".square.bomb");
                for (let index = 0; index < amount_bombs; index++) {
                        try {let old_bomb_coordinates = global_index_to_coordinates(current_bombs[index].id);
                        remove_classname_at("bomb", old_bomb_coordinates[0], old_bomb_coordinates[1]); }
                        catch (e) {}
                        set_new_classname_at_free_tile("bomb", head); //TODO add x amount of margin into direction of travel (i.e don't spawn bomb x tiles in front of snake)
                    }
            }

            let got_apple = false;
            if (document.getElementById(coordinates_to_global_index(head[0], head[1])).classList.contains("apple")) {
                remove_classname_at("apple", head[0], head[1]);
                set_new_classname_at_free_tile("apple")
                
                got_apple = true;
            }

            if (check_game_over(head[0], head[1])) {
                global.game.state = "game_over";
                console.log("game")
                setTimeout(main_loop, 50);
                return;
            }

            current_head_id = coordinates_to_global_index(head[0], head[1]);
            snake_indexes.push(current_head_id);
            document.querySelector(".snake_head")?.classList.remove("snake_head");
            document.getElementById(current_head_id).classList.add("snake_head");

            console.log(global.game.state)
            update_head();

            console.log(snake_indexes)

            set_snake_at_index(snake_indexes[snake_indexes.length - 1]);

            if (got_apple) {
                length++;
                got_apple = false;
                update_score(length);
            } else {
                reset_at_index(tail);
                tail = snake_indexes.shift();
            }
            console.log(length)
            //let del = get_delay_amount(300, 50, length);
            //console.log(del)

            
            
            global.game.snake.head = head;
            global.game.snake.indexes = snake_indexes;
            global.game.snake.tail = tail;
            global.game.step++;
            global.game.snake.length = length;

            setTimeout(main_loop, get_delay_amount(length));
            return;

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

    }

}

const check_game_over = (x, y) => {
    let class_list = document.getElementById(coordinates_to_global_index(x, y)).classList
    return class_list.contains("snake") || class_list.contains("wall")
}

const set_snake_at_index = (index) => {
    document.getElementById(index.toString()).classList.add("snake")
}

const set_new_classname_at_free_tile = (classname, ...disallowed_positions) => {
    let tile = find_free_tile(disallowed_positions);
    if (tile) {
        tile.classList.add(classname);
    }
}

const find_free_tile = (...disallowed_positions) => {
    let tile;
    let x;
    let y;
    let attempts = 0;

    while (!tile || tile.classList.contains("snake")
    || tile.classList.contains("wall") || tile.classList.contains("apple")) {
        x = Math.floor(Math.random() * global.game.width);
        y = Math.floor(Math.random() * global.game.height);
        attempts++;
        let is_disallowed_position = disallowed_positions.some(([not_at_x, not_at_y]) => x === not_at_x && y === not_at_y);
        //if (x !== not_at_x && y !== not_at_y) {
        if (! is_disallowed_position) {
            tile = document.getElementById(coordinates_to_global_index(x, y));
            if (attempts > 20) {
                tile = document.querySelector(".square:not(.snake):not(.apple):not(.wall):not(.bomb)");
                if (!tile) return;
            }
        }
    }
    return tile;
}

const remove_classname_at = (classname, x, y) => {
    let tile = document.getElementById(coordinates_to_global_index(x, y));
    tile.classList.remove(classname)
}

const reset_at_index = (index) => {
    document.getElementById(index.toString()).classList.remove("snake")
}

const handle_key_press = (event) => {
    console.log(event.key)
    if (global.game.state === "playing" && [" ", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        if (event.key !== key_reverse(global.last_move_key)) {
            global.key = event.key;
            update_head();
        }
    } else if (global.game.state === "paused") {
        if (event.key === " ") {
            global.key = event.key;
        }
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
    // let form_element = document.getElementById("form_settings");
    // let form_elements = form_element.elements;
    let elements = document.querySelectorAll(".setting_container > *")

    for (let element of elements) {
        if (element.id !== "button_new_game") {  //suboptimal implementation regarding button_new_game
            element.disabled = !bool;
        } else if (global.game.state === "playing") {
            element.disabled = true;
        } else {
            element.disabled = false;
        }
    }

}

const get_delay_amount = (snake_length) => {
    let longest_delay = tiles_per_second_to_ms(+ document.getElementsByName("game_speed_start")[0].value);
    let shortest_delay = tiles_per_second_to_ms(+ document.getElementsByName("game_speed_end")[0].value);
    let walls = document.getElementsByName("walls")[0].checked;
    let playable_elements = (global.game.width - 2 * walls) * (global.game.height - 2 * walls);
    let claimed_percent = snake_length / playable_elements;
    return Math.round(shortest_delay + ((longest_delay - shortest_delay) * (1 - claimed_percent)));
}

const tiles_per_second_to_ms = (tiles_per_second) => {
    return 1000 / tiles_per_second;
}

const update_score = (length) => {
    document.getElementById("display_score").innerText = (length).toString();
}

const close_popup = (event) => {
    event.target.parentElement.classList.add("no_display");
}

const close_any_open_popup = () => {
    document.querySelector(".popup:not(.no_display)")?.classList.add("no_display");
}

const open_popup = (event=null, id=null) => {
    close_any_open_popup();
    if (global.game.state === "playing") return;
    if (event) {
        id = event.target.getAttribute("data-target_popup_id");
    }
    document.getElementById(id).classList.remove("no_display");
}

const apply_settings_or_start_new_game = () => {
    let button_element = document.getElementById("button_new_game");
    
    if (button_element.getAttribute("data-action") === "reset") {
        button_element.setAttribute("data-action", "play");
        button_element.innerText = "Play";
        global.game.state = "reset";
    } else {
        close_any_open_popup();
        if (global.game.state === "await_start") {
            global.game.state = "playing";
        } else {
            global.game.state = "reset_into_playing";
        }
        
    }
}

const update_head = () => {
    if (global.game.state !== "playing") return;
    let snake_head = document.querySelector(".snake_head");
    document.querySelector(".direction_down")?.classList.remove("direction_down");
    document.querySelector(".direction_up")?.classList.remove("direction_up");
    document.querySelector(".direction_left")?.classList.remove("direction_left");
    document.querySelector(".direction_right")?.classList.remove("direction_right");
    switch (global.key) {
        case "ArrowRight":
            snake_head.classList.add("direction_right")
            break;
        case "ArrowLeft":
            snake_head.classList.add("direction_left")
            break;
        case "ArrowDown":
            snake_head.classList.add("direction_down")
            break;
        case "ArrowUp":
            snake_head.classList.add("direction_up")
            break;
    }
}

const settings_changed = () => {
    let button_element = document.getElementById("button_new_game");
    button_element.setAttribute("data-action", "reset")
    button_element.innerText = "Apply settings"
}

window.addEventListener("load", setup);
