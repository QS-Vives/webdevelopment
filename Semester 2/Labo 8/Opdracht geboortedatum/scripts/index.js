const setup = () => {
    let now = new Date();
    let birth = new Date(2003, 0, 6);

    let diff = now - birth;

    let days = Math.floor(diff/1000/60/60/24);

    console.log(`${days} dagen`)
}

window.addEventListener("load", setup);