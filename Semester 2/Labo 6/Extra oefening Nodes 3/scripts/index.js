const setup = () => {
    let div_element = document.getElementById("myDIV")
    let paragraph_element = document.createElement("p");

    paragraph_element.innerText = "some text"
    div_element.appendChild(paragraph_element)
}

window.addEventListener("load", setup);