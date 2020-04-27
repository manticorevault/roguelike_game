function generateLevel() {
    //generateTiles();

    tryTo("generate map", function() {
        return generateTiles() === randomPassableTile().getConnectedTiles().length;
    });

    generateMonsters();
}

function generateTiles(){
    let passableTiles = 0;
    tiles = [];
    
    for(let counter = 0; counter < numTiles; counter++){
        tiles[counter] = [];
        for(let innerCounter = 0; innerCounter < numTiles; innerCounter++){
            if(Math.random() < 0.3 || !insideBorders(counter, innerCounter)){
                tiles[counter][innerCounter] = new Wall(counter, innerCounter);
            } else {
                tiles[counter][innerCounter] = new Floor(counter, innerCounter);
                passableTiles++;
            }
        }
    }

    return passableTiles;
}

function insideBorders(x, y) {
    return x > 0 && y > 0 && x < numTiles-1 && y < numTiles-1; 
}

function placeTile(x, y) {
    if(insideBorders(x, y)) {
        return tiles[x][y];
    } else {
        return new Wall(x, y);
    }
}

function randomPassableTile() {
    let tile;
    tryTo("get random passable tile", function() {
        let x = randomRange(0, numTiles - 1);
        let y = randomRange(0, numTiles - 1);

        tile = placeTile(x, y);
        return tile.passable && !tile.monster;

    });

    return tile;
}

function generateMonsters() {
    monsters = [];
    let numMonsters = level+2;
    for(let counter = 0; counter < numMonsters; counter++){
        spawnMonster();
    }
}

function randomize(array) {
    for(let counter = array.length - 1; counter > 0; counter--) { 
        const randomizer = Math.floor(Math.random() * (counter + 1));
        [array[counter], array[randomizer]] = [array[randomizer], array[counter]];
    }

    return array;
}

function spawnMonster() {
    let monsterType = randomize([Skeleton, Ghost, Cultist, Reaper, Shielded])[0]
    let monster = new monsterType(randomPassableTile());
    monsters.push(monster);
}