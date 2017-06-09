/**
 * Created by Victor on 2017/4/27.
 */
var MovableObject = require('./MovableObject');

class Boat extends MovableObject {
    constructor(objectID, boatType) {
        super(objectID);

        this.level = 1;
        this.damage = Math.pow(2, this.level - 1);
        this.horizontalSpeed = 100000 / this.level;
        this.exp = 0;
        this.maxExp = 10 * Math.pow(2, this.level - 1);
        this.giveExp = this.maxExp / 2;
        this.maxHealth = 3 * Math.pow(2, this.level - 1);
        this.health = this.maxHealth;


        this.acc = 0.05; //加速度

        //hyz added
        this.wheelOrientation = 0;
        this.boatOrientation = 0;
        this.controlBoat = {
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false
        };
        this.MAX_SPEED = 100;
        this.MAX_REVERSE_SPEED = -78;

        this.MAX_WHEEL_ROTATION = 5;

        this.FRONT_ACCELERATION = 12.5;
        this.BACK_ACCELERATION = 15;

        this.WHEEL_ANGULAR_ACCELERATION = 3.0;

        this.FRONT_DECCELERATION = 7.5;
        this.WHEEL_ANGULAR_DECCELERATION = 2.0;

        this.STEERING_RADIUS_RATIO = 0.0023;

        this.MAX_TILT_SIDES = 0.05;
        this.MAX_TILT_FRONTBACK = 0.015;
        // hyz added

        this.curSpeed = 0;

        this.fireTime = 0;

        this.mesh = { position: { x: 0, y: 0, z: 0 }, quaternion: { x: 0, y: 0, z: 0, w: 1 } };
        this.radius = 20;
        this.boatType = boatType;
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

    Fire() {
        let bullet = new Bullet(this.playerID, this.damage, this.level * 10);
        bullet.mesh.rotation.set(this.mesh.rotation.x, this.mesh.rotation.y, this.mesh.rotation.z);

        //debug
        bullet.mesh.position.x = this.mesh.position.x;
        bullet.mesh.position.y = 30;
        bullet.mesh.position.z = this.mesh.position.z;
        return bullet;

    }


    ChangeHealth(add_health) {
        var after_change = this.health + add_health;
        if (after_change > this.maxHealth) {
            this.health = this.maxHealth
        } else if (after_change <= 0) {
            this.health = 0;
        } else {
            this.health = after_change;
        }
    }

    ChangeExp(add_exp) {
        // some problem
        if (!this.LevelUp(add_exp)) {
            this.exp += add_exp;
        }
    }

    LevelUp(added_exp) {
        var after_exp = this.exp + added_exp;
        if (after_exp > this.maxExp) {
            this.level += 1;
            this.damage = Math.pow(2, this.level - 1);
            this.horizontalSpeed = 10 / this.level;
            this.exp = after_exp - this.maxExp;
            this.maxExp = 10 * Math.pow(2, this.level - 1);
            this.giveExp = this.maxExp / 2;
            this.maxHealth = 3 * Math.pow(2, this.level - 1);
            this.health = this.maxHealth;
            return true;
        } else {
            return false;
        }
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

            this.wheelOrientation = THREE.Math.clamp(this.wheelOrientation + delta * this.WHEEL_ANGULAR_ACCELERATION, -this.MAX_WHEEL_ROTATION, this.MAX_WHEEL_ROTATION);

        }

        if (this.controlBoat.moveRight) {

            this.wheelOrientation = THREE.Math.clamp(this.wheelOrientation - delta * this.WHEEL_ANGULAR_ACCELERATION, -this.MAX_WHEEL_ROTATION, this.MAX_WHEEL_ROTATION);

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

            if (this.wheelOrientation > 0) {

                this.wheelOrientation = THREE.Math.clamp(this.wheelOrientation - delta * this.WHEEL_ANGULAR_DECCELERATION, 0, this.MAX_WHEEL_ROTATION);

            } else {

                this.wheelOrientation = THREE.Math.clamp(this.wheelOrientation + delta * this.WHEEL_ANGULAR_DECCELERATION, -this.MAX_WHEEL_ROTATION, 0);

            }

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

        this.mesh.rotation.z = this.MAX_TILT_SIDES * this.wheelOrientation * (this.curSpeed / this.MAX_SPEED);
        this.mesh.rotation.x = -this.MAX_TILT_FRONTBACK * this.acc;

    }

    exponentialEaseOut(k) {

        return k === 1 ? 1 : -Math.pow(2, -10 * k) + 1;

    }

    //for net update @author mjt
    getData() {
        return {
            playerID: this.playerID,
            boatType: this.boatType,
            mesh: {
                position: this.mesh.position,
                quaternion: this.mesh.quaternion
            },
            level: this.level,
            damage: this.damage,
            exp: this.exp,
            maxExp: this.maxExp,
            giveExp: this.giveExp,
            maxHealth: this.maxHealth,
            health: this.health,
        };
    }
    update(data) {

        this.boatType = data.boatType;
        this.mesh.position.x = data.mesh.position.x;
        this.mesh.position.z = data.mesh.position.z;
        this.mesh.quaternion.x = data.mesh.quaternion._x;
        this.mesh.quaternion.y = data.mesh.quaternion._y;
        this.mesh.quaternion.z = data.mesh.quaternion._z;
        this.mesh.quaternion.w = data.mesh.quaternion._w;
        this.level = data.level;
        this.damage = data.damage;
        this.exp = data.exp;
        this.maxExp = data.maxExp;
        this.giveExp = data.giveExp;
        this.maxHealth = data.maxHealth;
        this.health = data.health;
    }
}

module.exports = Boat;