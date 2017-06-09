/**
 * Created by wenjin on 2017/4/28.
 */
class Portal extends StaticObject {
    constructor(id, length, width, x, z) {
        super(id);
        this.radius = 20;

        this.mapLength = length;
        this.mapWidth = width;


        this.mesh = DOOR.clone();
        this.mesh.position.set(x, 0, z);
    }

    Operate(boat) {
        let y = boat.mesh.position.y;
        let l = this.mapLength;
        let w = this.mapWidth;
        boat.curSpeed = 0;
        setTimeout(() => {
            boat.mesh.position.set(l * Math.random(), y, w * Math.random());
            boat.curSpeed = 0;
        }, 2000);
    }
}