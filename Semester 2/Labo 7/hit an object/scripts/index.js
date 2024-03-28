let global = {
    IMAGE_COUNT: 5, // aantal figuren
    IMAGE_SIZE: 48, // grootte van de figuur
    IMAGE_PATH_PREFIX: "images/", // map van de figuren
    IMAGE_PATH_SUFFIX: ".png", // extensie van de figuren
    MOVE_DELAY: 3000, // aantal milliseconden voor een nieuwe afbeelding verschijnt
    score: 0, // aantal hits
    timeout_id: 0 // id van de timeout timer, zodat we die kunnen annuleren
};


const setup = () => {
    document.getElementById("image").addEventListener("click", image_clicked_handler);

    reset();
}

const image_clicked_handler = () => {
    clearInterval(global.timeout_id)
    let image = document.getElementById("image");
    
    if (image.src.includes(`/${global.IMAGE_PATH_PREFIX}0${global.IMAGE_PATH_SUFFIX}`)) {
        game_over();
        return;
    }

    global.score += 1;

    update_score_display();

    move_and_change_image();

    reset_timer();
}

const update_score_display = () => {
    document.getElementById("score_display").innerText = + global.score
}

const move_and_change_image = () => {
    let image = document.getElementById("image");

    random_number = Math.round(Math.random() * (global.IMAGE_COUNT - 1));

    image.src = `./${global.IMAGE_PATH_PREFIX}${random_number}${global.IMAGE_PATH_SUFFIX}`
}

const reset_timer = () => {
    global.timeout_id = setInterval(move_and_change_image, global.MOVE_DELAY);
}
 
const reset = () => {
    global.score = 0;
    reset_timer();
}

const game_over = () => {
    alert("Game over!");
}

window.addEventListener("load", setup);