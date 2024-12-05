/**@class*/
class Player {
    constructor(config = {}) {
        this.radius = config.radius || 40;
        this.drawsize = this.radius;
        this.pos = config.pos || {x:50,y:50};

        this.vel = config.pos || {x:0,y:0};
        this.jumpStrength = config.jumpStrength || 10;
        this.tilt = 0;
        this.speed = 5;
        this.jumptick = 0;
        this.open = false;
        this.stung = false;
        this.cought = [];
        this.immunity = -1;

        this.frames = [[1,0],[1,1],[1,2],[1,1],[1,3]];
        this.animtick = 0;

        this.keysHeld = [];
        //this.control();
    }
    /** @type {Player} */
    static instance;

    get tv() {
        return (this.open ? 2 : 8) - this.cought.length / 3;
    }

    control() {
        this.press = document.addEventListener("keydown", e => {
            e.preventDefault();
            if(e.key.search(/Arrow/) == 0)  // if key is any arrow key
                if(!this.keysHeld.includes(e.key)) // if key not registered
                    this.keysHeld.push(e.key);
        });
        this.leave = document.addEventListener("keyup", e => {
            this.keysHeld = this.keysHeld.filter(s => s.localeCompare(e.key));
            // remove matching name
        });
    }

    toggleOpen(j = true) {
        this.open = j && !this.open;
        this.jumptick = this.open ? 0 : 30 ;
        this.radius = this.open ? this.drawsize : this.drawsize/1.5 ;
        if(!this.open && j && this.pos.y < CANVAS.height) this.jump();
    }

    update(check = true) {
        this.jumptick++;
        this.immunity > -1 ? this.immunity-- : 0;
        this.gravity();

        if(this.animtick != 0)
            this.animtick = ++this.animtick % 12;

        if(!this.stung){
            if(this.keysHeld.includes("ArrowUp") && this.jumptick >30) 
                this.toggleOpen();
            if(this.keysHeld.includes("ArrowDown"))
                this.toggleOpen(false);
            if(this.keysHeld.includes("ArrowLeft") && !this.keysHeld.includes("ArrowRight"))
                this.tilt = -2, this.vel.x = Math.min(++this.vel.x, this.speed);
            else if(!this.keysHeld.includes("ArrowLeft") && this.keysHeld.includes("ArrowRight"))
                this.tilt = 2, this.vel.x = Math.max(--this.vel.x, -this.speed);
            else //if(!this.keysHeld.includes("ArrowLeft") && !this.keysHeld.includes("ArrowRight")){
            {   
                this.tilt = 0;
                this.vel.x -= this.vel.x != 0 ? this.vel.x > 0 ? 0.5 : -0.5 : 0;
            }
        }   

        if(this.pos.x<20) this.vel.x = -Math.abs(this.vel.x);
        if(this.pos.x>CANVAS.width-20) this.vel.x = Math.abs(this.vel.x);

        this.pos.y -= this.vel.y;
        this.pos.x -= this.vel.x;
        
        if(!this.stung && check) {
            let captured = checkCatch();
            if(captured) this.catch(captured);

            if(this.immunity != -1 || this.pos.y <= this.radius) 
                return;

            let stinger = checkStung();
            if(stinger) {
                this.toggleOpen(false);
                this.release();
                this.stung = true;
                UI.damage();
            }
        }
    }
    
    gravity() {
        if(this.pos.y > this.drawsize) {
            if(this.vel.y<this.tv) this.vel.y += this.tv/8;
            else if(this.vel.y>this.tv) this.vel.y -= this.tv/8
        } else if(this.pos.y == this.drawsize) {

        } else {
            this.pos.y = this.drawsize;
            this.vel.y = 0;
            if(this.cought.length)
                this.catch();
            if(this.stung) {
                this.stung = false;
            }
        }
    }
    /**@param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        
        this.cought.forEach(j => {
            j.jelly.draw(ctx);
        })

        const newy = CANVAS.height - this.pos.y;
        let frame;
        if(this.stung) frame = 4;
        else if(!this.open && !this.animtick) frame = 2;
        else frame = parseInt(this.animtick/3);
        ctx.moveTo(this.pos.x - this.drawsize, newy - this.drawsize);
        ctx.drawImage(
            IMG,
            100 * this.frames[frame][1],
            100,
            100,
            100,
            this.pos.x - this.drawsize,
            newy - this.drawsize,
            this.drawsize * 2,
            this.drawsize * 2
        );

        if(this.immunity > -1) {
            ctx.beginPath();
            ctx.arc(
                this.pos.x,
                newy,
                this.radius,
                0,
                7
            );
            ctx.closePath();
            if(this.immunity > 200)
                ctx.strokeStyle = "#eeeeee";
            else ctx.strokeStyle = "#ee5555";
            ctx.stroke();
        }
    }
    
    jump() {
        let ratio = 1 - Math.abs(this.tilt)/10;

        this.vel.y = -this.jumpStrength * ratio; // values
        this.vel.x = this.jumpStrength * (1-ratio);

        this.vel.x = -(this.vel.x * this.tilt) / Math.abs(this.tilt) || 0; // direction

        this.release();

        this.animtick++;
    }
    /** @param {Jellyfish} jelly  */
    catch(jelly = null) { // overload
        if(jelly){ // catch one
            Jellyfish.instances = Jellyfish.instances.filter(j => j!==jelly);
            jelly.captured = true;
            this.cought.push({jelly,off:getOffset(this,jelly)});
        } else { // sell all
            UI.scoreInc(this.cought.length * this.cought.length * 10 / 2)
            this.cought.forEach(j => {
                j.jelly.die();
                UI.sell(j.jelly);

            });
            this.cought = [];
        }
    }

    updateCatch() {
        this.cought.forEach(j => {
            j.jelly.pos = {
                x: this.pos.x + j.off.x,
                y: this.pos.y + j.off.y,
            }
        })
    }

    release() {
        for (let i = 0; i < this.cought.length; i++) {
            let jelly = this.cought.pop().jelly;
            jelly.captured = false;
            Jellyfish.instances.push(jelly);
        }
    }
}