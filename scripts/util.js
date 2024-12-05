function distance(x, y, dx = null, dy = null) {
    let dis;
    if(dx) {
        dis = Math.sqrt((x-dx)*(x-dx) + (y-dy)*(y-dy));
    } else {
        dis = Math.sqrt((x.x-y.x)*(x.x-y.x) + (x.y-y.y)*(x.y-y.y));
    }
    return dis;
}

function checkCatch(player = Player.instance, jellies= Jellyfish.instances) {
    let pos = player.pos;
    for(let i = 0; i < jellies.length; i++) {
        let j = jellies[i];
        if(!j.captured){
            let dis = distance(pos,j.pos);
            if(dis < player.drawsize + j.radius) {
                if(pos.y - j.pos.y > 38 && pos.y - j.pos.y < 47){
                    return j;
                }
            }
        }
    }
}


function checkStung(player = Player.instance, jellies= Jellyfish.instances) {
    let pos = player.pos;
    out:for(let i = 0; i < jellies.length; i++) {
        let jelly = jellies[i];
        for(let j = 0; j < jelly.stingers.length; j++) {
            let s = jelly.stingers[j];
            if(
                distance(pos.x, pos.y, jelly.pos.x, jelly.pos.y-s) < player.radius + jelly.radius/1.3
                && pos.y<jelly.pos.y) {
                return jelly;
            }
        }
    }
}


function getOffset(p,j) {
    return {
        x: j.pos.x - p.pos.x,
        y: j.pos.y - p.pos.y,
    }
}