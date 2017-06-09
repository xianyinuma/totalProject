/**
 * Created by HaoqiWu on 4/29/17.
 * How to use it:
 * for example: var something = SHIP.clone();
 *              something.position.set(x,y,z);
 */
var BULLET, RECRUIT, DOOR, BOAT1, BOAT2, BOAT3, BOAT4, UNNPC, BULLETSPHERE;

function createOBJShip(param) {
    let manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {
        console.log(item, loaded, total);
    };

    let texture = new THREE.Texture();

    let onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            let percentCompelete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentCompelete, 2) + '% downloaded');
        }
    };

    let onError = function(xhr) {
        console.log("Loading Error!!!");
    };

    //Loading model With .OBJ File
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    let mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(param.path);
    mtlLoader.load(param.mtlName, function(materials) {

        materials.preload();

        let objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(param.path);
        objLoader.load(param.objName, function(object) {

            object.traverse(function(child) {

                if (child instanceof THREE.Mesh) {
                    child.rotation.y = param.rotation;
                }
            });

            object.scale.set(param.scalex, param.scaley, param.scalez);
            object.position.set(param.initX, param.initY, param.initZ);

            switch (param.boat) {
                case 1:
                    BOAT1 = object;
                    break;
                case 2:
                    BOAT2 = object;
                    break;
                case 3:
                    BOAT3 = object;
                    break;
                case 4:
                    BOAT4 = object;
                    break;
                case 5:
                    UNNPC = object;
                    return;
            }

        }, onProgress, onError);

    });
}

function createShip(shipType) {


    let param;
    switch (shipType) {
        case "unNPC":
            param = {
                boat: 5,
                path: '../../assets/models/ship/UNNPC/',
                mtlName: 'high.mtl',
                objName: 'high.obj',
                rotation: 0,
                scalex: 100,
                scaley: 100,
                scalez: 100,
                initX: 10,
                initY: 0,
                initZ: 0
            };
            break;
        case "kawayi2":
            param = {
                boat: 3,
                path: '../../assets/models/ship/kawayi2/',
                mtlName: 'boat.mtl',
                objName: 'boat.obj',
                rotation: 0,
                scalex: 0.75,
                scaley: 0.75,
                scalez: 0.75,
                initX: 10,
                initY: -10,
                initZ: 0
            };
            break;

        case "kawayi":
            param = {
                boat: 1,
                path: '../../assets/models/ship/kawayi ship/',
                mtlName: 'boat.mtl',
                objName: 'boat.obj',
                rotation: 0,
                scalex: 10,
                scaley: 10,
                scalez: 10,
                initX: 10,
                initY: -6,
                initZ: 0
            };
            break;
        case "german":
            param = {
                boat: 4,
                path: '../../assets/models/ship/german ship/',
                mtlName: 'ZHANJIAN.mtl',
                objName: 'ZHANJIAN.obj',
                rotation: -1.54,
                scalex: 7,
                scaley: 10,
                scalez: 6,
                initX: 10,
                initY: 0,
                initZ: 0
            };
            break;
        case "NPC":
            param = {
                boat: 2,
                path: '../../assets/models/ship/NPCboat/',
                mtlName: 'Model.mtl',
                objName: 'Model.obj',
                rotation: 0,
                scalex: 10,
                scaley: 10,
                scalez: 10,
                initX: 10,
                initY: 0,
                initZ: 0
            };
            break;

        default:
            param = {
                boat: 1,
                path: '../../assets/models/ship/kawayi ship/',
                mtlName: 'boat.mtl',
                objName: 'boat.obj',
                rotation: 0,
                scalex: 10,
                scaley: 10,
                scalez: 10,
                initX: 10,
                initY: -6,
                initZ: 0
            };
            break;

    }
    createOBJShip(param);
}


//Supplies
function createRecruit() {
    var manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {

        console.log(item, loaded, total);

    };

    var texture = new THREE.Texture();

    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function(xhr) {};


    var loader = new THREE.ImageLoader(manager);
    loader.load('../../assets/models/recruit/weapon box/content/58pic_53cf8ab9c2ae0.png', function(image) {

        texture.image = image;
        texture.needsUpdate = true;

    });

    // model

    var loader = new THREE.OBJLoader(manager);
    loader.load('../../assets/models/recruit/weapon box/content/58pic_53cf8ab9c2317.obj', function(object) {

        object.traverse(function(child) {

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
    manager.onProgress = function(item, loaded, total) {

        console.log(item, loaded, total);

    };

    var texture = new THREE.Texture();

    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function(xhr) {};


    var loader = new THREE.ImageLoader(manager);
    loader.load('../../assets/models/bullet/9mm_texture.jpg', function(image) {

        texture.image = image;
        texture.needsUpdate = true;

    });

    // model

    var loader = new THREE.OBJLoader(manager);

    loader.load('../../assets/models/bullet/file.obj', function(object) {

        object.traverse(function(child) {

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
        color: 0x330033,
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