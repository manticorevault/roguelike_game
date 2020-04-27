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
    if(gameState === "running" || gameState === "dead") {
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

        drawText("Floor: " + level, 30, false, 40, "black");

    }
}

function tick() {
    for(let k = monsters.length - 1; k >= 0; k--) {
        if(!monsters[k].dead) {
            monsters[k].update();

        } else {
            monsters.splice[k, 1];
        }
    }

    if(player.dead) {
        gameState = "dead";
    }

    spawnCounter--;
    if(spawnCounter <= 0) {
        spawnMonster();
        spawnCounter = spawnRate;
        spawnRate--;
    }
}

function showTitle() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    gameState = "title";

    drawText("TOMB OF THE", 40, true, canvas.height / 2 - 80, "white");
    drawText("DWARVEN QUEENS", 50, true, canvas.height / 2 - 10, "white");
}

function startGame() {
    level = 1;
    startLevel(startingHp);

    gameState = "running";
}

function startLevel(playerHp) {
    spawnRate = 15;
    spawnCounter = spawnRate;

    generateLevel();

    player = new Player(randomPassableTile());
    player.hp = playerHp;

    randomPassableTile().replace(Stairs);
}

function drawText(text, size, centered, textY, color){
    ctx.fillStyle = color;
    ctx.font = size + "px serif";
    let textX;
    if (centered) {
        textX = (canvas.width-ctx.measureText(text).width) / 2;
    } else {
        textX = canvas.width-uiWidth*tileSize + 25;
    }

    ctx.fillText(text, textX, textY);
}