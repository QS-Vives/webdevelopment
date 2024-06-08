const setup = () => {
    init();
}

const init = () => {
    let seats = get_all_seats();

    for (let seat of seats) {
        if (Math.random() >= 0.6) {
            seat.src = "images/seat_unavail.png";
        }
    }
}

const find_seats = () => {
    let amount_seats_selected = document.getElementById("input_number_seats").value;
    let amount_adjacent_seats = 0;
    let index = 0;
    let matched_indexes = [];
    let seats_per_row = 9;

    clear_selected_seats();

    for (let seat of get_all_seats()) {
        if (index % seats_per_row === 0) {
            amount_adjacent_seats = 0;
        }
        if (seat.src.endsWith("seat_avail.png")) {
            amount_adjacent_seats++;
        } else {
            amount_adjacent_seats = 0;
        }
        if (amount_adjacent_seats >= amount_seats_selected) {
            matched_indexes.push(index - amount_seats_selected + 2);
        }

        index++;
    }

    if (matched_indexes.length > 0) {
        add_seat_selection_input(matched_indexes);
    }
    update_highlight();
}

const remove_seat_selection_input = () => {
    let element = document.getElementById("select_seats");

    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

const add_seat_selection_input = (indexes) => {
    let form_element = document.getElementById("selection_form");
    let select_element = document.createElement('select');

    select_element.id="select_seats";
    select_element.setAttribute("onchange", "update_highlight()");

    remove_seat_selection_input();

    indexes.forEach(index => {
        let option = document.createElement('option');
        option.value = index;
        option.textContent = index;
        select_element.appendChild(option);
    });

    form_element.insertBefore(select_element, form_element.firstChild);
}

const update_highlight = () => {
    let selected_index = (document.getElementById("select_seats")?.value || 0) - 1;
    if (selected_index < 0) {
        clear_selected_seats()
        alert("There aren't that many free seats next to each other.")
        return;
    }
    let length = document.getElementById("input_number_seats").value;
    let seats = get_all_seats();

    for (let i = 0; i < seats.length; i++) {
        if (i >= selected_index && length > 0) {
            seats[i].src = "images/seat_select.png";
            length--;
        } else if (seats[i].src.endsWith("seat_select.png")) {
            seats[i].src = "images/seat_avail.png";
        }
    }
}

const book = () => {
    let book_index = document.getElementById("select_seats").value;

    if (! book_index) {
        alert("Please make a selection.");
        return;
    }

    reserve_selected_seats();

    find_seats();

    alert("Seat successfully reserved");
}

const clear_selected_seats = () => {
    for (let seat of get_all_seats()) {
        if (seat.src.endsWith("seat_select.png")) {
            seat.src = "images/seat_avail.png";
        }
    }
}

const reserve_selected_seats = () => {
    for (let seat of get_all_seats()) {
        if (seat.src.endsWith("seat_select.png")) {
            seat.src = "images/seat_unavail.png";
        }
    }
}

const get_all_seats = () => {
    return document.getElementsByTagName("img")
}

window.addEventListener("load", setup);