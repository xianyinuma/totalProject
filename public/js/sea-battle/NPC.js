class NPC extends MovableObject {
    constructor(NPCID) {
        super(NPCID);

        this.playerID = NPCID;

        this.damage = 1;
        this.maxHealth = 999999;
        this.health = this.maxHealth;

        this.acc = 0.05;

        this.wheelOrientation = 0;
        this.boatOrientation = 0;
        this.controlBoat = {
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false
        };
        this.MAX_SPEED = 60;
        this.MAX_REVERSE_SPEED = -78;

        this.MAX_WHEEL_ROTATION = 5;

        this.FRONT_ACCELERATION = 12.5;
        this.BACK_ACCELERATION = 15;

        this.WHEEL_ANGULAR_ACCELERATION = 3.0;

        this.FRONT_DECCELERATION = 7.5;
        this.WHEEL_ANGULAR_DECCELERATION = 30.0;

        this.STEERING_RADIUS_RATIO = 0.0023;

        this.MAX_TILT_SIDES = 0.05;
        this.MAX_TILT_FRONTBACK = 0.015;

        this.curSpeed = 0;

        this.fireTime = 0;

        this.mesh = BOAT4.clone();
        this.radius = 20;

        this.turnTime = 0;

        this.target = null;

    }

    BoatCheck(bulletArray, staticArray) {
        var feedback = new Object();
        feedback.static = this.BoatCollisionArray(staticArray);
        feedback.bullet = this.BoatCollisionArray(bulletArray);

        return feedback;
    }

    BoatCollisionArray(collisionArray) {
        for (let i = 0; i < collisionArray.size(); i++) {
            if (this.BoatCollision(collisionArray.get(i)))
                return collisionArray.get(i);
        }
        return null;
    }

    BoatCollision(collisionBody) {
        let originPos = this.mesh.position.clone();
        let collisionBodyPos = collisionBody.mesh.position.clone();

        let distanceSquared = originPos.distanceTo(collisionBodyPos);

        let collisionBodyRadius = collisionBody.radius;

        let radius = this.radius;

        return (radius + collisionBodyRadius) >= distanceSquared;
    }


    detect(targetBoat, delta) {
        if (this.target !== null && this.target != targetBoat) return false;

        let boatX = targetBoat.mesh.position.x;
        let boatZ = targetBoat.mesh.position.z;

        let thisx = this.mesh.position.x;
        let thisz = this.mesh.position.z;


        let distance = Math.pow(thisx - boatX, 2) + Math.pow(thisz - boatZ, 2);
        distance = Math.sqrt(distance);

        // console.log(distance);

        if (distance < 1000) {
            this.target = targetBoat;
            this.moveTO(targetBoat, delta);
            return (distance < 500);
        } else {
            this.target = null;
        }

        this.move(delta);
        return false;
    }


    Fire() {
        //let bulletID = 123;
        let bullet = new Bullet(this.playerID, this.damage, 10);
        bullet.mesh.rotation.set(this.mesh.rotation.x, this.mesh.rotation.y, this.mesh.rotation.z);

        //debug
        bullet.mesh.position.x = this.mesh.position.x;
        bullet.mesh.position.y = 25;
        bullet.mesh.position.z = this.mesh.position.z;
        return bullet;

    }

    move(delta) {
        this.controlBoat.moveForward = true;

        let t = new Date();
        let time = t.getTime();
        if (time - this.turnTime > 2500) {
            this.controlBoat.moveLeft = true;

            if (time - this.turnTime > 5500) {
                this.controlBoat.moveLeft = false;
                this.turnTime = t.getTime();
            }
        }

        this.updateBoatModel(delta);

    }

    moveTO(moveToBoat, delta) {

        this.controlBoat.moveForward = true;

        let vec2 = new THREE.Vector3(moveToBoat.mesh.position.x - this.mesh.position.x, 0, moveToBoat.mesh.position.z - this.mesh.position.z);
        let vec1 = new THREE.Vector3(Math.sin(this.boatOrientation), 0, Math.cos(this.boatOrientation));


        let dir = vec1.cross(vec2);
        if (dir.y > 10) this.controlBoat.moveLeft = true;
        else if (dir.y < -10) this.controlBoat.moveRight = true;
        else {
            this.controlBoat.moveRight = false;
            this.controlBoat.moveLeft = false;

            this.wheelOrientation = 0;
        }

        this.updateBoatModel(delta);


    }

    changeRadius(radius) {
        let ret = radius;
        while (!(ret >= 0 && ret < Math.PI * 2)) {
            if (ret < 0) ret += Math.PI * 2;
            else ret -= Math.PI * 2;
        }

        return ret;


    }

    updateBoatModel(delta) {

        // speed and wheels based on controls

        if (this.controlBoat.moveForward) {

            this.curSpeed = THREE.Math.clamp(this.curSpeed + delta * this.FRONT_ACCELERATION, this.MAX_REVERSE_SPEED, this.MAX_SPEED);
            this.acc = THREE.Math.clamp(this.acc + delta, -1, 1);

        }

        if (this.controlBoat.moveBackward) {

            this.curSpeed = THREE.Math.clamp(this.curSpeed - delta * this.BACK_ACCELERATION, this.MAX_REVERSE_SPEED, this.MAX_SPEED);
            this.acc = THREE.Math.clamp(this.acc - delta, -1, 1);

        }

        if (this.controlBoat.moveLeft) {

            // this.wheelOrientation = THREE.Math.clamp(this.wheelOrientation + delta * this.WHEEL_ANGULAR_ACCELERATION, -this.MAX_WHEEL_ROTATION, this.MAX_WHEEL_ROTATION);
            this.wheelOrientation = 2.5;
        }

        if (this.controlBoat.moveRight) {

            // this.wheelOrientation = THREE.Math.clamp(this.wheelOrientation - delta * this.WHEEL_ANGULAR_ACCELERATION, -this.MAX_WHEEL_ROTATION, this.MAX_WHEEL_ROTATION);
            this.wheelOrientation = -2.5;
        }

        // speed decay

        if (!(this.controlBoat.moveForward || this.controlBoat.moveBackward)) {

            if (this.curSpeed > 0) {

                var k = this.exponentialEaseOut(this.curSpeed / this.MAX_SPEED);

                this.curSpeed = THREE.Math.clamp(this.curSpeed - k * delta * this.FRONT_DECCELERATION, 0, this.MAX_SPEED);
                this.acc = THREE.Math.clamp(this.acc - k * delta, 0, 1);

            } else {

                var k = this.exponentialEaseOut(this.curSpeed / this.MAX_REVERSE_SPEED);

                this.curSpeed = THREE.Math.clamp(this.curSpeed + k * delta * this.BACK_ACCELERATION, this.MAX_REVERSE_SPEED, 0);
                this.acc = THREE.Math.clamp(this.acc + k * delta, -1, 0);

            }


        }

        // steering decay

        if (!(this.controlBoat.moveLeft || this.controlBoat.moveRight)) {

            // if ( this.wheelOrientation > 0 ) {
            //
            //     this.wheelOrientation = THREE.Math.clamp( this.wheelOrientation - delta * this.WHEEL_ANGULAR_DECCELERATION, 0, this.MAX_WHEEL_ROTATION );
            //
            // } else {
            //
            //     this.wheelOrientation = THREE.Math.clamp( this.wheelOrientation + delta * this.WHEEL_ANGULAR_DECCELERATION, - this.MAX_WHEEL_ROTATION, 0 );
            //
            // }
            this.wheelOrientation = 0;

        }

        // car update

        var forwardDelta = this.curSpeed * delta;

        this.boatOrientation += (forwardDelta * this.STEERING_RADIUS_RATIO) * this.wheelOrientation;

        // displacement

        this.mesh.position.x += Math.sin(this.boatOrientation) * forwardDelta;
        this.mesh.position.z += Math.cos(this.boatOrientation) * forwardDelta;

        // steering

        this.mesh.rotation.y = this.boatOrientation;

        // tilt

        // this.mesh.rotation.z = this.MAX_TILT_SIDES * this.wheelOrientation * ( this.curSpeed / this.MAX_SPEED );
        // this.mesh.rotation.x = -this.MAX_TILT_FRONTBACK * this.acc;

    }

    exponentialEaseOut(k) {

        return k === 1 ? 1 : -Math.pow(2, -10 * k) + 1;

    }


}