const CANVAS = document.querySelector("canvas");
const CTX = CANVAS.getContext("2d");
let IMG = new Image();
    IMG.src = "images/Sprites tr.png";
    

let pause = false;
let played = false;
addEventListener("click", start = function() {
    removeEventListener("click",this);
    if(!played) {
        played = true;
        initialise();
    }
})
let tutorial = new Image();
tutorial.src = "images/Tutorial.png";
setTimeout(() => CTX.drawImage(tutorial,0,0,CANVAS.width,CANVAS.height), 20);

let play = () => {
    Jellyfish.instances.forEach(f => f.update());
    Player.instance.update();
    Player.instance.updateCatch();
    draw();
    Jellyfish.spawn();
    if(!pause) requestAnimationFrame(play);
};

function initialise() {
    if(!pause)
        togglePause();

    Jellyfish.instances = [];
    for (let i = 0; i < 4; i++) {
            Jellyfish.instances[i] = new Jellyfish();
            Jellyfish.instances[i].teleport();
    }
    Player.instance = new Player();
    Player.instance.control();
    UI.initiate();

    setTimeout(() => {
        togglePause();
    },50);
}

function togglePause() {
    pause = !pause;
    if(!pause) play()
}


function draw() {
    CTX.clearRect(0,0,CANVAS.width,CANVAS.height);
    Jellyfish.instances.forEach(f => f.draw(CTX));
    Player.instance.draw(CTX);
}


