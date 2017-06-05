/**
 * Created by wenjin on 2017/4/28.
 */
class Portal extends StaticObject {
    constructor(id, length, width, x, z) {
        super(id);
        this.radius = 20;

        this.mapLength = length;
        this.mapWidth = width;

        // var geometry = new THREE.SphereGeometry(0.5);
        // geometry.computeBoundingSphere();
        // var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
        // this.mesh = new THREE.Mesh(geometry, material);
        // this.mesh.position.x = 5;
        // this.mesh.position.y = 0;
        this.mesh = DOOR.clone();
        this.mesh.position.set(x, 0, z);
    }

    Operate(boat) {
        boat.mesh.position.set(this.mapLength * Math.random(), 0, this.mapLength * Math.random()); // to change
    }
}