class UnmovableNPC extends MovableObject {

    constructor(UNPCid) {
        super(UNPCid);
        this.playerID = UNPCid;
        this.mesh = UNNPC.clone();
        this.DAMAGE = 1;
        this.BULLETSPEED = 15;

        this.fireTime = 0;

    }

    detect(currentBoat) {
        let boatX = currentBoat.mesh.position.x;
        let boatZ = currentBoat.mesh.position.z;

        let towerX = this.mesh.position.x;
        let towerZ = this.mesh.position.z;
        let distance = Math.pow(towerX - boatX, 2) + Math.pow(towerZ - boatZ, 2);
        distance = Math.sqrt(distance);

        if (distance < 500) {
            this.mesh.lookAt(currentBoat.mesh.position);
            return true;
        } else {
            return false;
        }
    }

    Fire() {
        //let bulletID = 123;
        let bullets = {};
        for (let i = 0; i < 6; i++) {
            let bullet = new Bullet(this.playerID, this.DAMAGE, this.BULLETSPEED);
            bullet.mesh.rotation.set(this.mesh.rotation.x, this.mesh.rotation.y + Math.PI * i / 3, this.mesh.rotation.z);

            //debug
            bullet.mesh.position.x = this.mesh.position.x;
            bullet.mesh.position.y = 25;
            bullet.mesh.position.z = this.mesh.position.z;

            bullets[i] = bullet;
        }

        return bullets;

    }

    Operate(boat) {
        // boat.ChangeExp(this.exp);
        // boat.ChangeHealth(-1);
    }



}