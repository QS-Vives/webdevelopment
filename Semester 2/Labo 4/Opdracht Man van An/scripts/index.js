const setup = () => {
    document.getElementById("count").addEventListener("click", update);

    update();
}

const update = () => {
    document.getElementById("index_of").innerText
        = via_index_of(document.getElementById("input_text").value);

    document.getElementById("last_index_of").innerText
        = via_last_index_of(document.getElementById("input_text").value);
}

const via_index_of = (input_text, search_string="an") => {
    let count = -1;
    let last_matched_index = -1 - search_string.length;

    while (last_matched_index !== -1 ) {
        last_matched_index = input_text.toLowerCase().indexOf(search_string, last_matched_index + search_string.length);
        count++;
    }

    return count.toString()
}

const via_last_index_of = (input_text, search_string="an") => {
    let count = -1;
    let last_matched_index = input_text.length + search_string.length + 1;
    let previous_last_matched_index = 0;

    while (last_matched_index !== -1) {
        previous_last_matched_index = last_matched_index;
        last_matched_index = input_text.toLowerCase().lastIndexOf(search_string, last_matched_index - search_string.length);
        if (last_matched_index === previous_last_matched_index) last_matched_index = -1;
        count++;
    }

    return count.toString();
}

window.addEventListener("load", setup);