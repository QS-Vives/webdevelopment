// ================================================================
// == GLOBAL VARIABLES                                           ==
// ================================================================

global = {
    // \/ edit parameters below \/
    AANTAL_GELIJK: 2, // Size of sets, i.e. how many of the same card you need to match

    AANTAL_KAARTEN: 24, // X where X is the highest X of any kaartX.png

    AUTO_GENERATE_IMAGES: true, // If there are not enough cards, generate new ones.

    CARD_SHOW_MATCH_SPEED: 2_000, // How long the cards are shown to be right or wrong

    AUTO_DIMENSIONS: true, // If the grid of cards has manually set dimensions or automatic, further config below

    AANTAL_SETS: 12,         // Only for AUTO_DIMENSION = true,      Amount of sets in the game
    AANTAL_HORIZONTAAL: 4,  // Only for AUTO_DIMENSION = false (*), Amount of cards in a row
    AANTAL_VERTICAAL: 3,    // Only for AUTO_DIMENSION = false (*), Amount of cards in a column
                            // (*) AANTAL_HORIZONTAAL and AANTAL_VERTICAAL are used if AUTO_DIMENSION = true can't find dimensions that fit perfectly on screen

    AANTAL_SOUNDS: 24, // X where X is the highest X of any soundX.flac

    MATCH_SOUNDS: false, // Game of match sounds instead of images
    // /\ edit parameters above /\

    // do not touch parameters below
    state: "init",
    card_names: [],
    sound_names: ["unused"],
    sound_play_delay: 1_500,
    cards_currently_turned: 0,
    card_turn_animation_speed: 0,
    card_win_animation_speed: 0,
    total_amount_of_cards: 0,
    ig_generated_images: [],
    IG_AVAILABLE_HUES: [0, 60, 120, 180, 240, 300],

    stats: {
        cards_clicked: 0,
        sets_incorrect: 0,
    }

};

// ================================================================
// == CHECK PARAMETERS                                           ==
// ================================================================

if (global.AANTAL_KAARTEN <= 2) {
    alert("Not enough cards in folder images.");
    throw new Error("Not enough cards in folder images.");
}

if (global.AANTAL_SOUNDS <= 2) {
    alert("Not enough sound in folder sounds.");
    throw new Error("Not enough sounds in folder sounds.");
}

if (global.AANTAL_GELIJK < 2) {
    alert("AANTAL_GELIJK must be 2 or higher.");
    throw new Error("AANTAL_GELIJK must be 2 or higher.");
}

// ================================================================

if (global.AUTO_DIMENSIONS) {
    global.total_amount_of_cards = global.AANTAL_GELIJK * global.AANTAL_SETS;
} else {
    global.total_amount_of_cards = global.AANTAL_VERTICAAL * global.AANTAL_HORIZONTAAL;
}

// ================================================================
// == FUNCTIONS RUN ONCE                                         ==
// ================================================================

const setup = () => {
    get_card_names();
    create_grid();
    global.card_turn_animation_speed = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card_turn_animation_speed').slice(0, -2));
    global.card_win_animation_speed = (250 + global.card_turn_animation_speed) / global.total_amount_of_cards;
    document.getElementById("button_play_again").addEventListener("click", () => location.reload());

    if (global.state === "init") {
        populate_grid();
        document.getElementById("game_container").classList.remove("no_input");
        loading_done();
        global.state = "awaiting_input";
    }
}

const get_card_names = () => {
    global.card_names = ["images/achterkant.png"];

    if (global.total_amount_of_cards / global.AANTAL_GELIJK > global.AANTAL_KAARTEN) {
        if (! global.AUTO_GENERATE_IMAGES && ! global.MATCH_SOUNDS) {
            alert("Not enough cards.");
            throw new Error("Not enough cards.");
        }
    }

    if (global.MATCH_SOUNDS && global.total_amount_of_cards / global.AANTAL_GELIJK > global.AANTAL_SOUNDS) {
        alert("Not enough sounds.");
        throw new Error("Not enough sounds.");
    }


    if (global.MATCH_SOUNDS) {
        for (let i = 1; i <= global.AANTAL_SOUNDS; ++i) {
            global.card_names.push("images/sound.png");
            global.sound_names.push(`sound${i}`);
        }
    } else {
        for (let i = 1; i <= global.AANTAL_KAARTEN; ++i) {
            global.card_names.push(`images/kaart${i}.png`);
        }
    }

    if (global.AUTO_GENERATE_IMAGES && ! global.MATCH_SOUNDS) {
        let max_generated_images = ((global.AANTAL_KAARTEN * (global.AANTAL_KAARTEN - 1)) / 2 )
            * (global.IG_AVAILABLE_HUES.length * global.IG_AVAILABLE_HUES.length);
        if (global.total_amount_of_cards / global.AANTAL_GELIJK > max_generated_images) {
            alert("Not enough cards (Cannot generate that many cards).");
            throw new Error("Cannot generate that many cards.");
        } else if (global.total_amount_of_cards / global.AANTAL_GELIJK > global.card_names.length - 1){
            global.state = "init_generating_images";
            ig_generate_new_image();
        }
    }
}

const create_grid = () => {
    let game_container = document.getElementById("game_container");

    if (global.AUTO_DIMENSIONS) {
        let available_height = window.innerHeight - 1;
        let available_width = window.innerWidth - 1;
        let i = 1;
        let best = -1;
        let best_height = -1;
        let card_width = available_width / i;

        while (card_width >= 80)  {
            card_width = available_width / i;
            let card_height = card_width / 2 * 3;
            let total_height = (global.total_amount_of_cards / i) * card_height;
            let total_width = (global.total_amount_of_cards / i) * card_width;
            if (total_height <= available_height && total_width <= available_width) {
                if (card_height > best_height && Number.isInteger(global.total_amount_of_cards / i)) {
                    best = i;
                    best_height = card_height;
                }
            }
            ++i;
        }

        if (best < 0) {
            //fallback on manual values
            game_container.style.gridTemplateColumns = `repeat(${global.AANTAL_HORIZONTAAL}, 1fr)`;
            game_container.style.gridTemplateRows = `repeat(${global.AANTAL_VERTICAAL}, 1fr)`;
        } else {
            game_container.style.gridTemplateColumns = `repeat(${best}, 1fr)`;
            game_container.style.gridTemplateRows = `repeat(${global.total_amount_of_cards / best}, 1fr)`;
        }
    } else {
        game_container.style.gridTemplateColumns = `repeat(${global.AANTAL_HORIZONTAAL}, 1fr)`;
        game_container.style.gridTemplateRows = `repeat(${global.AANTAL_VERTICAAL}, 1fr)`;
    }
}

const populate_grid = () => {
    let game_container = document.getElementById("game_container");
    let card_numbers = [];
    let number;

    for (let i = 0; i < (global.total_amount_of_cards) / global.AANTAL_GELIJK; ++i) {
        do {
             number = Math.round(Math.random() * (global.card_names.length - 2)) + 1;
        } while (card_numbers.includes(number));

        for (let j = 0; j < global.AANTAL_GELIJK; j++) {
            card_numbers.push(number);
        }
    }

    card_numbers = card_numbers.sort(() => Math.random() - 0.5); // shuffle cards

    for (let i = 0; i < card_numbers.length; i++) {
        let card_number = card_numbers[i];
        let new_card = document.importNode(document.getElementById("card_template").content, true).firstElementChild;

        new_card.querySelector(".front img").src = global.card_names[card_number]
        new_card.setAttribute("data-card_number", card_number);
        new_card.setAttribute("data-card_id", i.toString());
        new_card.addEventListener("click", card_click_handler);
        game_container.appendChild(new_card);
    }
}

const loading_done = () => {
    document.getElementById("loading_popup").classList.add("no_display");
}

const ig_generated_image_event = new Event('ig_generate_image_done');
window.addEventListener("load", setup);

// ================================================================
// == FUNCTIONS RUN MULTIPLE TIMES                               ==
// ================================================================

/* check if where done generating new images or need to generate one more */
const image_generator_check_ready = () => {
    if (global.card_names.length > (global.total_amount_of_cards / global.AANTAL_GELIJK)) {
        populate_grid();
        document.getElementById("game_container").classList.remove("no_input");
        loading_done();
        global.state = "awaiting_input";
    } else {
        ig_generate_new_image();
    }
}

document.addEventListener('ig_generate_image_done', image_generator_check_ready);

/* handle card clicks */
const card_click_handler = (event) => {
    if (global.state !== "awaiting_input") return;
    global.state = "processing_input";

    let card = event.currentTarget;

    if (! card.classList.contains("turn_and_show") && ! card.classList.contains("turn_and_hide")) {
        card.classList.remove("turn_and_hide");
        card.classList.add("turn_and_show");
        play_sound("card_turn");
        global.stats.cards_clicked++;
        global.cards_currently_turned++;

        if (global.MATCH_SOUNDS) {
            setTimeout(() => play_sound(global.sound_names[card.getAttribute("data-card_number")]), global.card_turn_animation_speed);
        }
    }

    if (global.cards_currently_turned === global.AANTAL_GELIJK) {
        global.state = "checking_cards";
        document.getElementById("game_container").classList.add("no_input");

        if (global.MATCH_SOUNDS) {
            setTimeout(check_matching, global.sound_play_delay);
        } else {
            check_matching();
        }
        global.cards_currently_turned = 0;
    } else {
        global.state = "awaiting_input";
    }
}

/* check if turned cards match */
const check_matching = () => {
    let turned_cards = document.querySelectorAll(".turn_and_show:not(.hidden)");

    for (let i = 0; i < global.AANTAL_GELIJK - 1; i++) {
        if (turned_cards[i].getAttribute("data-card_number") !== turned_cards[i+1].getAttribute("data-card_number")) {
            setTimeout(match_incorrect, global.card_turn_animation_speed);
            global.stats.sets_incorrect++;
            return false;
        }
    }

    setTimeout(match_correct, global.card_turn_animation_speed);
    return true;
}

/* match incorrect, color card border */
const match_incorrect = () => {
    let turned_cards = document.querySelectorAll(".turn_and_show");

    for (let turned_card of turned_cards) {
        turned_card.classList.add("incorrect_match");
    }

    play_sound("match_incorrect");

    setTimeout(hide_incorrect_cards_again, global.CARD_SHOW_MATCH_SPEED);
}

const hide_incorrect_cards_again = () => {
    let turned_cards = document.querySelectorAll(".turn_and_show");

    for (let turned_card of turned_cards) {
        turned_card.classList.remove("turn_and_show");
        turned_card.classList.remove("incorrect_match");
        turned_card.classList.add("turn_and_hide");
    }

    play_sound("card_turn");
    setTimeout(enable_click_handeling_again, global.card_turn_animation_speed);
}

/* enable input again */
const enable_click_handeling_again = () => {
    let cards = document.querySelectorAll(".turn_and_hide");

    for (let card of cards) {
        card.classList.remove("turn_and_hide");
    }

    document.getElementById("game_container").classList.remove("no_input");
    global.state = "awaiting_input";
}

/* match correct, color card border */
const match_correct = () => {
    let turned_cards = document.querySelectorAll(".turn_and_show");

    for (let turned_card of turned_cards) {
        turned_card.classList.add("correct_match");
    }

    play_sound("match_correct");
    setTimeout(hide_correct_cards, global.CARD_SHOW_MATCH_SPEED);
}

const hide_correct_cards = () => {
    let cards = document.querySelectorAll(".correct_match");

    for (let card of cards) {
        card.classList.add("hidden");
    }

    document.getElementById("game_container").classList.remove("no_input");
    global.state = "awaiting_input";

    let delay = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--card_hide_animation_speed').slice(0, -2));
    setTimeout(check_game_over, delay);
}

const check_game_over = () => {
    if (! document.querySelector(".card_container:not(.hidden)")) {
        let stats_element = document.getElementById("stats");

        stats_element.innerText = stats_element.innerText.replace("_x_", global.stats.cards_clicked)
            .replace("_y_", global.stats.sets_incorrect);

        if (global.stats.sets_incorrect === 1) {
            stats_element.innerText = stats_element.innerText.replace("mistakes", "mistake");
        }

        play_sound("match_won");
        document.getElementById("game_won_message").classList.remove("no_display");

        for (let card of document.querySelectorAll(".card_container.hidden")) {
            card.classList.remove("hidden");
        }

        if (! window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setTimeout(() => game_over_animation(0), 500);
        }
    }
}

const game_over_animation = (current_id) => {
    if (current_id >= global.total_amount_of_cards) {
        current_id = 0;
    }
    let card = document.querySelector(`[data-card_id="${current_id}"]`);

    if (card.classList.contains("turn_and_hide")) {
        card.classList.remove("turn_and_hide");
        card.classList.add("turn_and_show");
    } else {
        card.classList.remove("turn_and_show");
        card.classList.add("turn_and_hide");
    }

    setTimeout(() => game_over_animation(++current_id), global.card_win_animation_speed);
}

/* function to play audio */
const play_sound = (sound_name, removal_delay = 5_000) => {
    const remove_sound_element = (sound_element) => { document.body.removeChild(sound_element); }

    let sound_player_element = new Audio(`sounds/${sound_name}.flac`);
    document.body.appendChild(sound_player_element);
    sound_player_element.play().then(() => {});
    setTimeout(() => remove_sound_element(sound_player_element), removal_delay);
}

// ================================================================
// == IMAGE GENERATOR                                            ==
// ================================================================

/* Generates a new image from images in images folder when there are not enough images in the images folder.
*  The new images are generated by taking two existing images, (possibly) applying hue shifting to them,
*  and then XOR-ing them together. */
const ig_generate_new_image = () => {
    let ig_image_id = "";
    let image_number_1;
    let image_number_2;
    let hue_1;
    let hue_2;
    do {
        image_number_1 = Math.round(Math.random() * (global.AANTAL_KAARTEN - 1)) + 1;
        image_number_2 = Math.round(Math.random() * (global.AANTAL_KAARTEN - 1)) + 1;
        while (image_number_1 === image_number_2) {
            image_number_2 = Math.round(Math.random() * (global.AANTAL_KAARTEN - 1)) + 1;
        }

        if (image_number_1 > image_number_2) {
            [image_number_1, image_number_2] = [image_number_2, image_number_1]; //swap variables
        }

        hue_1 = global.IG_AVAILABLE_HUES[Math.round(Math.random() * (global.IG_AVAILABLE_HUES.length - 1))];
        hue_2 = global.IG_AVAILABLE_HUES[Math.round(Math.random() * (global.IG_AVAILABLE_HUES.length - 1))];

        ig_image_id = `${image_number_1}_${image_number_2}_${hue_1}_${hue_2}`;

    } while (global.ig_generated_images.includes(ig_image_id));

    global.ig_generated_images.push(ig_image_id);

    let image_1 = new Image();
    image_1.src = global.card_names[image_number_1];
    image_1.onload = () => {
        let image_2 = new Image();
        image_2.src = global.card_names[image_number_2];
        image_2.onload = () => {
            ig_create_new_image(image_1, image_2, hue_1, hue_2);
        }
    }
}

const ig_create_new_image = (image_1, image_2, hue_shift_1, hue_shift_2) => {
    let canvas_1 = document.createElement('canvas');
    let context_1 = canvas_1.getContext('2d');

    let canvas_2 = document.createElement('canvas');
    let context_2 = canvas_2.getContext('2d');

    let canvas_out = document.createElement('canvas');
    let context_out = canvas_out.getContext('2d');

    canvas_1.width = image_1.width;
    canvas_1.height = image_1.height;
    context_1.drawImage(image_1, 0, 0);
    let img_data_1 = context_1.getImageData(0, 0, canvas_1.width, canvas_1.height);
    ig_hue_shift_image(img_data_1, hue_shift_1);
    context_1.putImageData(img_data_1, 0, 0);

    canvas_2.width = image_2.width;
    canvas_2.height = image_2.height;
    context_2.drawImage(image_2, 0, 0);
    let img_data_2 = context_2.getImageData(0, 0, canvas_2.width, canvas_2.height);
    ig_hue_shift_image(img_data_2, hue_shift_2);
    context_2.putImageData(img_data_2, 0, 0);

    canvas_out.width = image_1.width;
    canvas_out.height = image_1.height;

    let output_data_url  = ig_xor_image_data_and_convert_to_data_url(img_data_1, img_data_2, context_out, canvas_out);
    global.card_names.push(output_data_url);

    document.dispatchEvent(ig_generated_image_event);
}

const ig_hue_shift_image = (image_data, shift_amount) => {
    let data = image_data.data;
    for (let i = 0; i < data.length; i += 4) {
        let hsl = ig_rgb_to_hsl(data[i], data[i + 1], data[i + 2]);
        hsl[0] += shift_amount;
        let rgb = ig_hsl_to_rgb(hsl[0], hsl[1], hsl[2]);
        data[i] = rgb[0];
        data[i + 1] = rgb[1];
        data[i + 2] = rgb[2];
    }
}

const ig_xor_image_data_and_convert_to_data_url = (img_data_1, img_data_2, context, canvas) => {
    let combined_data = context.createImageData(canvas.width, canvas.height);
    let data_1 = img_data_1.data;
    let data_2 = img_data_2.data;
    let combined_data_array = combined_data.data;

    for (let i = 0; i < combined_data_array.length; i += 4) {
        combined_data_array[i] = data_1[i] ^ data_2[i];
        combined_data_array[i + 1] = data_1[i + 1] ^ data_2[i + 1];
        combined_data_array[i + 2] = data_1[i + 2] ^ data_2[i + 2];
        combined_data_array[i + 3] = 255;
    }

    context.putImageData(combined_data, 0, 0);
    return canvas.toDataURL();
}

const ig_rgb_to_hsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

const ig_hsl_to_rgb = (h, s, l) => {
    let r, g, b;
    h /= 360;
    s /= 100;
    l /= 100;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue_to_rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue_to_rgb(p, q, h + 1 / 3);
        g = hue_to_rgb(p, q, h);
        b = hue_to_rgb(p, q, h - 1 / 3);
    }
    return [r * 255, g * 255, b * 255];
}
