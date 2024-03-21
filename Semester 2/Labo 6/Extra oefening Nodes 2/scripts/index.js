const setup = () => {
    let list_items = document.querySelectorAll("li");
    for (let item of list_items) {
        item.classList.add("listitem");
    }

    let style_element = document.createElement("style");
    style_element.innerHTML = ".listitem {color: red;}";
    document.querySelector("head").appendChild(style_element);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request access to the webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Webcam access granted
                let video_element = document.createElement("video");
                video_element.srcObject = stream;
                video_element.autoplay = true;
                video_element.setAttribute("playsinline", ""); // For Safari

                document.querySelector("body").appendChild(video_element);
            })
            .catch(function(error) {
                console.error('Error accessing webcam:', error);
                let image_element = document.createElement("img");
                image_element.src = "images/no_webcam.png";
                image_element.alt = "";
                document.querySelector("body").appendChild(image_element);
            });
    } else {
        let image_element = document.createElement("img");
        image_element.src = "images/no_webcam.png";
        image_element.alt = "";
        document.querySelector("body").appendChild(image_element);
    }
}

window.addEventListener("load", setup);