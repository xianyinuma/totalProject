/**
 * Created by wenjin on 2017/4/29.
 */
class Map {
    constructor(output, length, width, renderer, camera) {
        this.output = output;
        this.length = length;
        this.width = width;

        this.renderer = renderer;
        this.camera = camera;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0xaabbbb, 0.0001);

        this.water = null;
        this.AddMirrorMesh();
        this.AddSkyBox();
    }

    UpdateStatus(boatArray, bulletArray) {
        for (let i = 0; i < boatArray.size(); i++) {
            boatArray.get(i).Move();
        }
        for (let i = 0; i < bulletArray.size(); i++) {
            bulletArray.get(i).Move();
        }
    }

    UpdateOutput(currentBoat, boatArray, bulletArray, staticArray) {
        //alert(boatArray.size());
        for (let i = 0; i < boatArray.size(); i++) {
            this.scene.add(boatArray.get(i).mesh)
        }
        for (let i = 0; i < bulletArray.size(); i++) {
            this.scene.add(bulletArray.get(i).mesh)
        }
        for (let i = 0; i < staticArray.size(); i++) {
            this.scene.add(staticArray.get(i).mesh)
        }

        this.water.material.uniforms.time.value += 1.0 / 60.0;
        this.water.render();
        this.renderer.setSize(this.length, this.width);
        this.output.html(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);

        for (let i = 0; i < boatArray.size(); i++) {
            this.scene.remove(boatArray.get(i).mesh)
        }
        for (let i = 0; i < bulletArray.size(); i++) {
            this.scene.remove(bulletArray.get(i).mesh)
        }
        for (let i = 0; i < staticArray.size(); i++) {
            this.scene.remove(staticArray.get(i).mesh)
        }
    }

    AddMirrorMesh() {
        this.scene.add(new THREE.AmbientLight(0x444444));

        var light = new THREE.DirectionalLight(0xffffbb, 1);
        light.position.set(-1, 1, -1);
        this.scene.add(light);

        let parameters = {
            width: 2000,
            height: 2000,
            widthSegments: 250,
            heightSegments: 250,
            depth: 1500,
            param: 4,
            filterparam: 1
        };

        let waterNormals = new THREE.TextureLoader().load('../../assets/textures/waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

        this.water = new THREE.Water(this.renderer, this.camera, this.scene, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha: 1.0,
            sunDirection: light.position.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 50.0,
            fog: this.scene.fog != undefined
        });


        let mirrorMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500),
            this.water.material
        );

        mirrorMesh.add(this.water);
        mirrorMesh.rotation.x = -Math.PI * 0.5;

        this.scene.add(mirrorMesh);
    }

    AddSkyBox() {
        var cubeMap = new THREE.CubeTexture([]);
        cubeMap.format = THREE.RGBFormat;

        var loader = new THREE.ImageLoader();
        loader.load('../../assets/textures/skyboxsun25degtest.png', function (image) {

            var getSide = function (x, y) {

                var size = 1024;

                var canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;

                var context = canvas.getContext('2d');
                context.drawImage(image, -x * size, -y * size);

                return canvas;

            };

            cubeMap.images[0] = getSide(2, 1); // px
            cubeMap.images[1] = getSide(0, 1); // nx
            cubeMap.images[2] = getSide(1, 0); // py
            cubeMap.images[3] = getSide(1, 2); // ny
            cubeMap.images[4] = getSide(1, 1); // pz
            cubeMap.images[5] = getSide(3, 1); // nz
            cubeMap.needsUpdate = true;

        });

        var cubeShader = THREE.ShaderLib['cube'];
        cubeShader.uniforms['tCube'].value = cubeMap;

        var skyBoxMaterial = new THREE.ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });

        var skyBox = new THREE.Mesh(
            new THREE.BoxGeometry(1000000, 1000000, 1000000),
            skyBoxMaterial
        );

        this.scene.add(skyBox);
    }

}