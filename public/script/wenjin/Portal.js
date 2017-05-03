/**
 * Created by wenjin on 2017/4/28.
 */
class Portal extends StaticObject {
    constructor(lifeSpan, length, width) {
        super();
        this.radius = 20;
        this.lifeSpan = lifeSpan;
        
        this.mapLength = length;
        this.mapWidth = width;

        // var geometry = new THREE.SphereGeometry(0.5);
        // geometry.computeBoundingSphere();
        // var material = new THREE.MeshBasicMaterial({color: 0x0000ff});
        // this.mesh = new THREE.Mesh(geometry, material);
        // this.mesh.position.x = 5;
        // this.mesh.position.y = 0;
        this.mesh = DOOR.clone();
    }

    Operate(boat) {
        boat.mesh.position.set(this.mapLength * Math.random(), 0, this.mapLength * Math.random()); // to change
    }
}