class Jellyfish {
    constructor(config = Jellyfish.default) {
        this.radius = config.radius;
        this.pos = config.pos || {x:0,y:0};
        this.vel = {x:0,y:0};
        this.jumpStrength = config.jumpStrength;
        this.tv = config.tv;
        this.activity = config.activity;
        this.agility = config.agility;
        this.tick = 0;
        this.tilt = 0;
        this.jumpat = 0;
        

        this.stingers = [];
        for(let i = config.length; i>0; i-= this.radius/1.2) {
            this.stingers.push(i);
        }


        this.captured = false;
        this.frames = [[0,0],[0,1],[0,2],[0,1],[0,3]];
        this.animtick = 0;
    }

    /**@type {Jellyfish[]} */
    static instances = [];
    static chance = 200
    static spawn() {
        if(this.instances.length + Player.instance.cought.length > 7) return;
        let c = parseInt(Math.random() * 10000);
        if(c < this.chance) {
            this.chance-=150;
            let spawned = Math.random() > 0.4 ? new Jellyfish() : new BonusJelly();
            spawned.teleport();
            this.instances.push(spawned);
        } else this.chance++;
    }


    static get default() {
        return {
            radius:20,
            jumpStrength:3.5,
            tv:1.2,
            activity:20,
            agility:12,
            length:15
        }
    }



    teleport() {
        //let x = parseInt(Math.random() * (CANVAS.width-100) + 50);
        let x = Math.random() > 0.5 ? -30 : CANVAS.width + 30;
        let y = parseInt(Math.random() * (CANVAS.height-100) + 50);
        this.pos = {x,y};
    }



    decision() {
        if(this.captured) return;
        let tiltChoice = this.tilt / 2 + parseInt(Math.random() * this.agility - this.agility/2);
        if(this.pos.x<100) tiltChoice++;
        if(this.pos.x>600) tiltChoice--;

        let jumpChoice = parseInt(Math.random() * (this.activity*0.6) - (this.activity*0.5));
        if(this.pos.y<200) jumpChoice+=this.activity*0.5;
        if(this.pos.y>350) jumpChoice-=this.activity*0.8;

        this.jumpat = Math.round(jumpChoice);
        this.tilt = tiltChoice;
    }



    update() {
        this.gravity();

        this.tick = (this.tick+1) % this.activity;
        if(this.tick==this.activity-1) this.decision();
        if(this.tick == this.jumpat) this.jump();
        if(this.animtick != 0)
            this.animtick = ++this.animtick % 12;


        if(this.pos.x<20) this.vel.x = -Math.abs(this.vel.x);
        if(this.pos.x>CANVAS.width-20) this.vel.x = Math.abs(this.vel.x);
        if(this.vel.y == this.tv) this.tilt = 0;
        this.pos.y -= this.vel.y;
        this.pos.x -= this.vel.x;

        if(isNaN(this.pos.x)) throw new Error("nan x");
    }



    gravity() {
        if(this.pos.y > 0) {
            if(this.vel.y<this.tv) this.vel.y += this.tv/8;
        } else {
            this.vel.y = 0;
        }
    }



    die() {

    }



    jump() {
        this.jumpat = -1;
        let ratio;
        ratio = 1 - Math.abs(this.tilt)/10;

        this.vel.y = -this.jumpStrength * ratio; // values
        this.vel.x = this.jumpStrength * (1-ratio);

        this.vel.x = -(this.vel.x * this.tilt) / Math.abs(this.tilt) || 0; // direction

        this.animtick++;
    }
    

    /**@param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        const newy = CANVAS.height - this.pos.y;
        let frame;
        if(this.captured) frame = 4;
        else frame = parseInt(this.animtick/3);
        false && this.stingers.forEach(s =>{
            ctx.beginPath();
            ctx.arc(
                this.pos.x,
                newy + s,
                this.radius/1.3,
                0,
                7
            );
            ctx.closePath();
            ctx.strokeStyle = "#eeeeee";
            ctx.stroke();
        });
        ctx.moveTo(this.pos.x - this.radius, newy - this.radius);
        ctx.drawImage(
            IMG,
            100 * this.frames[frame][1],
            0,
            100,
            100,
            this.pos.x - this.radius * 1.5,
            newy - this.radius * 1.5,
            this.radius * 3,
            this.radius * 3
        )

    }
}

class BonusJelly extends Jellyfish{
    static bonuses = [["health", "#ee1144"], ["immunity","#444488"], ["score","#989b32"]];
    constructor(config = Jellyfish.default) {
        config.jumpStrength += parseInt(Math.random() * 3) + 1;
        config.radius += 5;
        super(config);
        this.bonus = BonusJelly.bonuses[parseInt(Math.random() * BonusJelly.bonuses.length)];
    }
    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        super.draw(ctx);
        ctx.moveTo(this.pos.x, this.pos.y + this.radius + 8);
        ctx.beginPath();
        ctx.arc(
            this.pos.x,
            (CANVAS.height - this.pos.y),
            this.radius + 5,
            0,
            7
        );
        ctx.strokeStyle = this.bonus[1];
        ctx.lineWidth = 4;
        ctx.closePath();
        ctx.stroke();
    }
}







