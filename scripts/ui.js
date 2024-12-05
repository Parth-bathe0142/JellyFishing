class UI {
    static initiate() {
        this.score = 0;
        this.count = 0;
        this.maxhealth = 5;
        this.health = 5;

        this.div = document.getElementById("ui");
        this.gameover = document.getElementById("gameover");
        this.gameover.style.display = "none";  

        this.updateDisplay();
    }

    static damage() {
        this.health--;
        this.updateDisplay();
        if(this.health == 0) {
            togglePause();
            //document.removeEventListener("keydown");
            //document.removeEventListener("keyup");
            this.gameover.style.display = "block";   
        }
    }

    static sell(jelly) {
        this.count++;
        if(!jelly.bonus) {
            this.scoreInc(50);
        } else {
            this.scoreInc(100);
            switch(jelly.bonus[0]) {
                case "health":
                    this.health = Math.min(++this.health, this.maxhealth);
                    break;
                case "immunity":
                    Player.instance.immunity += 800;
                    break;
                case "score":
                    this.scoreInc(100);
                    break;
                default:
                    break;
            }
        }
    }

    static scoreInc(int) {
        this.score += int;
        this.updateDisplay();
    }

    static updateDisplay() {
        document.getElementById("score").innerText = this.score;
        document.getElementById("health").innerText = this.health;
        document.getElementById("count").innerText = this.count;
    }
}