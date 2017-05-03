/**
 * Created by HaoqiWu on 4/29/17.
 * How to use it:
 * for example: var something = SHIP.clone();
 *              something.position.set(x,y,z);
 */
var BULLET, RECRUIT, DOOR, BOAT, BULLETSPHERE;

//German Ship
function createGermanShip() {
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    var texture = new THREE.Texture();

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {
    };


    var loader = new THREE.ImageLoader(manager);
    loader.load('../../assets/models/ship/german ship/TT1024X1024.jpg', function (image) {

        texture.image = image;
        texture.needsUpdate = true;

    });

    // model

    var loader = new THREE.OBJLoader(manager);

    loader.load('../../assets/models/ship/german ship/ZHANJIAN.obj', function (object) {

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                child.material.map = texture;

            }

        });
        object.scale.set(3, 3, 3);
        object.position.set(10, 0, 0);

        BOAT = object;
    }, onProgress, onError);
}
//Very big ship
function createLargeShip() {
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    var texture = new THREE.Texture();

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {
    };


    var loader = new THREE.ImageLoader(manager);
    loader.load('../../assets/models/ship/fan ship/ship_boat/Wood_Bamboo_Dark.jpg', function (image) {

        texture.image = image;
        texture.needsUpdate = true;

    });

    // model

    var loader = new THREE.OBJLoader(manager);

    loader.load('../../assets/models/ship/fan ship/ship_boat.obj', function (object) {
        var material = new THREE.MeshLambertMaterial({color: 0x5C3A21});
        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                child.material.map = texture;

            }

        });
        object.scale.set(0.01, 0.01, 0.01);
        object.position.set(0, 0, 0);

        BOAT = object;
    }, onProgress, onError);
}

//Small wooden ship
function createWoodenShip() {
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {
    };

    // model

    var loader = new THREE.OBJLoader(manager);

    loader.load('../../assets/models/pangea3dgalleon.obj', function (object) { //todo

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                child.material = new THREE.MeshLambertMaterial({color: 0x5C3A21});
                child.rotation.y = -1.54;
            }

        });
        object.scale.set(0.2, 0.2, 0.2);
        // object.rotation.y = 1.54;

        // object.geometry.computeBoundingSphere();

        BOAT = object;
    }, onProgress, onError);
}


//Supplies
function createRecruit() {
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    var texture = new THREE.Texture();

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {
    };


    var loader = new THREE.ImageLoader(manager);
    loader.load('../../assets/models/recruit/weapon box/content/58pic_53cf8ab9c2ae0.png', function (image) {

        texture.image = image;
        texture.needsUpdate = true;

    });

    // model

    var loader = new THREE.OBJLoader(manager);
    loader.load('../../assets/models/recruit/weapon box/content/58pic_53cf8ab9c2317.obj', function (object) {

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                child.material.map = texture;

            }

        });
        object.scale.set(0.1, 0.1, 0.1);
        object.position.set(0, -4, 0);
        RECRUIT = object;
    }, onProgress, onError);

}
//The bullet which is normal
function createBullet() {
    var manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {

        console.log(item, loaded, total);

    };

    var texture = new THREE.Texture();

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function (xhr) {
    };


    var loader = new THREE.ImageLoader(manager);
    loader.load('../../assets/models/bullet/9mm_texture.jpg', function (image) {

        texture.image = image;
        texture.needsUpdate = true;

    });

    // model

    var loader = new THREE.OBJLoader(manager);

    loader.load('../../assets/models/bullet/file.obj', function (object) {

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                child.material.map = texture;

            }

        });
        object.scale.set(0.1, 0.1, 0.1);
        object.position.set(0, 0, 0);

        BULLET = object;
    }, onProgress, onError);

    //return scene.getChildByName("bullet");
}
//The bullet which is round
function createBulletSphere() {
    var geometry = new THREE.SphereGeometry(3, 50, 50);

    var material = new THREE.MeshPhongMaterial({
        color: 0x000000,
        specular: 0xffffff,
        shininess: 30
    });

    var sphere = new THREE.Mesh(geometry, material);
    BULLETSPHERE = sphere;
}

//The Portal
function createDoor(radius, tube, vertical, horizontal, p, q, heightScale) {
    var geom = new THREE.TorusKnotGeometry(radius, tube,
        Math.round(vertical), Math.round(horizontal),
        Math.round(p), Math.round(q), heightScale);
    var door = createPointCloud(geom);
    //door.rotation.x+=1;
    door.rotation.x += 2.5;
    door.position.y += 15;
    DOOR = door;

}
function generateSprite() {

    var canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;

    var context = canvas.getContext('2d');
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;

}
function createPointCloud(geom) {
    var material = new THREE.PointCloudMaterial({
        color: 0xffffff,
        size: 3,
        transparent: true,
        blending: THREE.AdditiveBlending,
        map: generateSprite()
    });

    var cloud = new THREE.PointCloud(geom, material);
    cloud.sortParticles = true;
    return cloud;
}