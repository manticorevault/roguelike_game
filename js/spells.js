spells = {
    TELEPORT: function() {
        player.move(randomPassableTile());
    },

    DASH: function() {
        let newTile = player.tile;
        while(true) {
            let testTile = newTile.getNeighbor(player.lastMove[0], player.lastMove[1]);
            if(testTile.passable && !testTile.monster) {
                newTile = testTile;
    
            } else {
                break;
            }
        }

        if(player.tile != newTile) {
            player.move(newTile);
            newTile.getAdjacentNeighbors().forEach(t => {
                if(t.monster) {
                    t.setEffect(14);
                    t.monster.stunned = true;
                    t.monster.hit(1);
                }
            });
        }
    },

    BRAVERY: function() {
        player.shield = 2;
        for(let counter = 0; counter < monsters.length; counter++) {
            monsters[counter].stunned = true;
        }
    }

};
