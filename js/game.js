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
        x*tileSize + shakeX,
        y*tileSize + shakeY,
        tileSize,
        tileSize
    );
}

function draw() {
    if(gameState === "running" || gameState === "dead") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        screenshake();

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
       /* 
        drawText("Spells: ", 20, false, 100, "black");
        
        for(let counter = 0; counter < player.spells.length; counter++) {
            let spellText = (counter + 1) + ") " + (player.spells[counter] || "");                        
            drawText(spellText, 15, false, 120 + counter*40, "red");   
        
        }
        */

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

    player.update();

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

    drawText("TOMB OF THE", 40, true, canvas.height / 2 - 140, "white");
    drawText("DWARVEN QUEENS", 50, true, canvas.height / 2 - 90, "white");
    drawText("press enter", 30, true, canvas.height / 2 - 45, "white")

    drawScores();
}

function deadScreen() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    gameState = "title";

    drawText("YOU ARE", 40, true, canvas.height / 2 - 140, "white");
    drawText("DEAD", 50, true, canvas.height / 2 - 90, "red");
    drawText("Ayreon's spirit got trapped inside the Tomb of The Dwarven Queens,", 15, true, canvas.height / 2 - 40, "white");
    drawText("alongside the other damned souls. ", 15, true, canvas.height / 2 - 20, "white");
    drawText("press enter", 30, true, canvas.height / 2 + 10, "white")

}

function endScreen(){
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    gameState = "title";

    drawText("As Ayreon reached the last room of the Tomb of the Dwarven Queens,", 15, true, canvas.height / 2 - 40, "white");
    drawText("he uncovered the shield that once belonged to the great Queen ꝥora...", 15, true, canvas.height / 2 - 20, "white");
    drawText("As he walked back to the surface, the monsters he slayed in his journey", 15, true, canvas.height / 2 + 0, "white");
    drawText("laid still, a pile of bones and cloth...", 15, true, canvas.height / 2 + 20, "white");
    drawText("As he reached to the first level, he could already see the light", 15, true, canvas.height / 2 + 40, "white");
    drawText("as the sun greeted him, finally, once more", 15, true, canvas.height / 2 + 60, "white");
    drawText("with its golden dawn.", 15, true, canvas.height / 2 + 80, "goldenrod");
    drawText("press enter", 30, true, canvas.height / 2 + 105, "red")
}

function startGame() {

    level = 1;
    score = 0;
    numSpells = 1;
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

function screenshake() {
    if (shakeIntensity) {
        shakeIntensity--;
    }

    let shakeAngle = Math.random()*Math.PI*2;
    shakeX = Math.round(Math.cos(shakeAngle)*shakeIntensity);
    shakeY = Math.round(Math.sin(shakeAngle)*shakeIntensity);
}