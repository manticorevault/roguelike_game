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
        drawText("Score: " + score, 30, false, 70, "black");

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
        addScore(score, false);
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

    drawText("TOMB OF THE", 40, true, canvas.height / 2 - 100, "white");
    drawText("DWARVEN QUEENS", 50, true, canvas.height / 2 - 50, "white");

    drawScores();
}

function startGame() {

    //TODO: Add a NewGame+ feature, incrementing the first level according to the number of runs.
    level = 1;
    score = 0;
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

function getScores() {
    if(localStorage["scores"]) {
        return JSON.parse(localStorage["scores"]);
    } else {
        return [];
    }
}

function addScore(score, won) {
    let scores = getScores();
    let scoreObject = { score: score, run: 1, totalScore: score, active: won };
    let lastScore = scores.pop();

    if(lastScore) {
        if(lastScore.active) {
            scoreObject.run = lastScore.run + 1;
            scoreObject.totalScore += lastScore.totalScore;
        } else {
            scores.push(lastScore);
        }
    }
    
    scores.push(scoreObject);

    localStorage["scores"] = JSON.stringify(scores);
}

function drawScores() {
    let scores = getScores();
    if(scores.length) {
        drawText(
            rightPad([ "RUN", "SCORE", "TOTAL" ]),
            15,
            true,
            canvas.height / 2,
            "white"
        );

        let newestScore = scores.pop();
        scores.sort(function(a, b) {
            return b.totalScore - a.totalScore;
        });

        scores.unshift(newestScore);

        for(let counter = 0; counter < Math.min(10, scores.length); counter++) {
            let scoreText = rightPad([scores[counter].run, 
                            scores[counter].score, 
                            scores[counter].totalScore]);

            drawText(
                scoreText,
                20,
                true,
                canvas.height / 2 + 24 + counter*24,
                counter === 0 ? "yellow" : "gray"
            );
        }
    }
}