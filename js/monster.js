class Monster {
    constructor(tile, sprite, hp) {
        this.move(tile);
        this.sprite = sprite;
        this.hp = hp;
        this.teleportCounter = 2;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    heal(damage) {
        this.hp = Math.min(maxHp, this.hp + damage);
    }

    update() {
        this.teleportCounter--;
        if(this.stunned || this.teleportCounter > 0) {
            this.stunned = false;
            return;
        }

        this.doStuff();
    }

    doStuff() {
        let neighbors = this.tile.getAdjacentPassableNeighbors();

        neighbors = neighbors.filter(t => !t.monster || t.monster.isPlayer);

        if(neighbors.length) {
            neighbors.sort((a, b) => a.dist(player.tile) - b.dist(player.tile));
            let newTile = neighbors[0];
            this.tryMove(newTile.x - this.tile.x, newTile.y - this.tile.y);
        }
    }

    // Reinforce character animation by showing the apparent position.
    getDisplayX() {
        return this.tile.x + this.offsetX;
    }

    getDisplayY() {
        return this.tile.y + this.offsetY;
    }

    draw() {
        if(this.teleportCounter > 0) {
            drawSprite(10, this.getDisplayX(), this.getDisplayY());
        } else {
            drawSprite(this.sprite, this.getDisplayX(), this.getDisplayY());
            this.drawHp();
        }

        // Animate the transitions from the apparent position to the actual position.
        // with a cool sliding effect.

        this.offsetX -= Math.sign(this.offsetX)*(1/8);
        this.offsetY -= Math.sign(this.offsetY)*(1/8);
    }

    drawHp(){
        for(let counter = 0; counter < this.hp; counter++){
            drawSprite(
                9,
                this.getDisplayX() + (counter%3)*(5/16),
                this.getDisplayY() - Math.floor(counter/3)*(5/16)
            );
        }
    }

    tryMove(dx, dy) {
        let newTile = this.tile.getNeighbor(dx, dy);
        if (newTile.passable) {
            if(!newTile.monster) {
                this.move(newTile);
            } else {
                if(this.isPlayer !== newTile.monster.isPlayer) {
                    this.attackedThisTurn = true;
                    newTile.monster.stunned = true;
                    newTile.monster.hit(1)

                    shakeIntensity = 5;

                    this.offsetX = (newTile.x - this.tile.x)/2;         
                    this.offsetY = (newTile.y - this.tile.y)/2;  
                }
            }

            return true;
        }
    }

    hit(damage) {
        this.hp -= damage;
        if(this.hp <= 0) {
            this.die()
        }
    }

    die() {
        this.dead = true;
        this.tile.monster = null;
        this.sprite = 1;
    }

    move(tile) {
        if (this.tile) {
            this.tile.monster = null;

            // Smooth character movement applied.
            this.offsetX = this.tile.x - tile.x;
            this.offsetY = this.tile.y - tile.y;
        }

        this.tile = tile;
        tile.monster = this;

        tile.stepOn(this);
    }
}

class Player extends Monster {
    constructor(tile) {
        super(tile, 0, 3);
        this.isPlayer = true;
        this.teleportCounter = 0;
    }

    tryMove(dx, dy) {
        if(super.tryMove(dx, dy)) {
            tick();
        }
    }
}

class Skeleton extends Monster {
    constructor(tile) {
        super(tile, 4, 2)
    }
}

class Reaper extends Monster {
    constructor(tile) {
        super(tile, 5, 3)
    }

    // This mechanic helps him heal by destroying walls. 
    // Use it as inspiration to create a mechanic that lets him
    // Heal by destroying corpses.
    doStuff() {
        let neighbors = this.tile.getAdjacentPassableNeighbors().filter(t => !t.passable && insideBorders(t.x, t.y));
        if(neighbors.length) {
            neighbors[0].replace(Floor);
            this.heal(0.5);
        } else {
            super.doStuff();
        }
    }
}

class Ghost extends Monster {
    constructor(tile) {
        super(tile, 6, 2)
    }

    doStuff() {
        let neighbors = this.tile.getAdjacentPassableNeighbors();
        if(neighbors.length) {
            this.tryMove(neighbors[0].x - this.tile.x, neighbors[0].y - this.tile.y);
        }
    }

}

class Cultist extends Monster {
    constructor(tile) {
        super(tile, 7, 1)
    }

    doStuff() {
        this.attackedThisTurn = false;
        super.doStuff();

        if(!this.attackedThisTurn) {
            super.doStuff();
        }
    }
}

class Shielded extends Monster {
    constructor(tile) {
        super(tile, 8, 5)
    }

    update() {
        let startedStunned = this.stunned;
        super.update();
        if(!startedStunned) {
            this.stunned = true;
        }
    }
}