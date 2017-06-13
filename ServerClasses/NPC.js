var MovableObject = require('./MovableObject');
var THREE = require('three');
var Bullet = require('./Bullet');

class NPC extends MovableObject {
    constructor(NPCID) {
        super(NPCID);

        this.playerID = NPCID;

        this.level = 1;
        this.damage = 1;
        this.maxHealth = 999999;
        this.health = this.maxHealth;

        this.exp = 0;
        this.maxExp = 1;
        this.giveExp = 0;
        this.maxHealth = 1;
        this.health = 1;
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

        //用正方体在服务器模拟船体的移动
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
        this.mesh.position.set(1500, 0, 1500);
        this.boatType = "4";

        this.radius = 20;

        this.turnTime = 0;

        this.target = null;
        this.face2Target = false;

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

    //这三个函数 是外部要调用的
    detectTarget(boatMap) {
        //有目标时 并可追踪时
        if (this.target && boatMap[this.target] !== undefined && this.distance2(boatMap[this.target]) < 1000) {
            return;
        } else {
            this.target = null;
        }

        //寻找目标
        for (var id in boatMap) {
            if (this.distance2(boatMap[id]) < 1000 && id != this.playerID) {
                this.target = id;
                return;
            }
        }
    }

    move(delta, boatMap) {
        if (this.target) {
            this.moveTo(boatMap[this.target], delta);
        } else
            this.moveAround(delta);
    }

    detectFire(boatMap) {
        if (this.target && this.face2Target) {
            var distance2Target = this.distance2(boatMap[this.target])
            if (distance2Target < 600 && distance2Target > 400)
                return true;
        }
        return false;
    }

    //

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

    moveAround(delta) {
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


    moveTo(moveToBoat, delta) {

        this.controlBoat.moveForward = true;

        let vec2 = new THREE.Vector3(moveToBoat.mesh.position.x - this.mesh.position.x, 0, moveToBoat.mesh.position.z - this.mesh.position.z);
        let vec1 = new THREE.Vector3(Math.sin(this.boatOrientation), 0, Math.cos(this.boatOrientation));

        //判断是否在船体前方
        if (vec1.angleTo(vec2) < Math.PI / 4) this.face2Target = true;
        else this.face2Target = false;

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
    distance2(boat) {
        let boatX = boat.mesh.position.x;
        let boatZ = boat.mesh.position.z;

        let thisx = this.mesh.position.x;
        let thisz = this.mesh.position.z;


        let distance = Math.pow(thisx - boatX, 2) + Math.pow(thisz - boatZ, 2);
        distance = Math.sqrt(distance); //todo 可优化
        return distance;
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



    //for net update @author mjt
    getData() {
        return {
            playerID: this.playerID,
            boatType: this.boatType,
            mesh: {
                position: this.mesh.position,
                quaternion: {
                    x: this.mesh.quaternion.x,
                    y: this.mesh.quaternion.y,
                    z: this.mesh.quaternion.z,
                    w: this.mesh.quaternion.w
                }
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
module.exports = NPC;