function setupCanvas() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");

    canvas.width = tileSize*(numTiles+uiWidth);
    canvas.height = tileSize*numTiles;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    ctx.imageSmoothingEnabled = false;
}

function drawSprite(sprite, x, y) {
    ctx.drawImage(
        spritesheet, 
        sprite*16,
        0,
        16,
        16,
        x*tileSize,
        y*tileSize,
        tileSize,
        tileSize
    );
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let counter = 0; counter < numTiles; counter++) {
        for(let innerCounter = 0; innerCounter < numTiles; innerCounter++) {
            placeTile(counter, innerCounter).draw();
        }
    }

    for(let counter = 0; counter < monsters.length; counter++) {
        monsters[counter].draw();
    }

    player.draw();
}

function tick() {
    for(let k = monsters.length - 1; k >= 0; k--) {
        if(!monsters[k].dead) {
            monsters[k].update();

        } else {
            monsters.splice[k, 1];
        }
    }
}