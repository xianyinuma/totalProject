/**
 * Created by Victor on 2017/4/25.
 */

class Bullet extends MovableObject {
    constructor(playerID, damage, speed) {
        super(playerID);
        //this.boat = boat;//to do
        this.damage = damage;
        this.horizontalSpeed = speed;//to do
        this.verticalSpeed = speed * 0.1;
        this.gravity = - 0.05;//to do

        //for test (need to change)
        // let geometry = new THREE.SphereGeometry(0.5);
        // geometry.computeBoundingSphere();
        // let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        // this.mesh = new THREE.Mesh(geometry, material);

        // this.mesh.position.x = -5;
        // this.mesh.position.y = 0;
        this.mesh = BULLETSPHERE.clone();
        this.radius = 1;

    }

    Move() {
        //Bullet Move
        this.mesh.translateZ(this.horizontalSpeed);
        this.verticalSpeed += this.gravity;
        this.mesh.translateY(this.verticalSpeed);
    }

}
