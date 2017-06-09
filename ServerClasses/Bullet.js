/**
 * Created by Victor on 2017/4/25.
 */
var MovableObject = require('./MovableObject');
var THREE = require('three');


class Bullet extends MovableObject {
    constructor(playerID, damage, speed) {
        super(playerID);
        //this.boat = boat;//to do
        this.damage = damage;
        this.horizontalSpeed = speed; //to do
        this.verticalSpeed = speed * 0.1;
        this.gravity = -0.05; //to do

        this.id = generateBulletId(playerID);

        function generateBulletId(uid) {
            var date = new Date();
            var t = date.getTime();
            t = (t << 4 >>> 14) + (uid << 20);
            return t;
        }

        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());

        this.radius = 1;

    }

    Move() {
        //Bullet Move
        this.mesh.translateZ(this.horizontalSpeed);
        this.verticalSpeed += this.gravity;
        this.mesh.translateY(this.verticalSpeed);
    }


    getData() {
        return {
            playerID: this.playerID,
            id: this.id,
            damage: this.damage,
            horizontalSpeed: this.horizontalSpeed,
            verticalSpeed: this.verticalSpeed,
            mesh: {
                position: this.mesh.position,
                quaternion: this.mesh.quaternion,
            }
        };
    }

    update(data) {
        this.playerID = data.playerID;
        this.id = data.id;
        this.damage = data.damage;
        this.horizontalSpeed = data.horizontalSpeed;
        this.verticalSpeed = data.verticalSpeed;
        this.mesh.position.x = data.mesh.position.x;
        this.mesh.position.y = data.mesh.position.y;
        this.mesh.position.z = data.mesh.position.z;
        this.mesh.quaternion.x = data.mesh.quaternion._x;
        this.mesh.quaternion.y = data.mesh.quaternion._y;
        this.mesh.quaternion.z = data.mesh.quaternion._z;
        this.mesh.quaternion.w = data.mesh.quaternion._w;
    }

}

module.exports = Bullet;