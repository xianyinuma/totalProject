$(document).ready(function() {

    createShip("kawayi2");
    createShip("kawayi");
    createShip("NPC");

    setTimeout(function() {
        // alert("Choose your ship");
        var renderer1 = new THREE.WebGLRenderer({
            canvas: document.getElementById('ship1')
        });

        var renderer2 = new THREE.WebGLRenderer({
            canvas: document.getElementById('ship2')
        });

        var renderer3 = new THREE.WebGLRenderer({
            canvas: document.getElementById('ship3')
        });
        renderer1.setClearColor(0xFFFFFF); // black
        renderer2.setClearColor(0xFFFFFF); // black
        renderer3.setClearColor(0xFFFFFF); // black


        var scene1 = new THREE.Scene();
        var scene2 = new THREE.Scene();
        var scene3 = new THREE.Scene();

        var camera1 = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000);
        camera1.position.set(0, 0, 5);
        camera1.lookAt(new THREE.Vector3(0, 0, 0));

        var camera2 = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000);
        camera2.position.set(0, 0, 5);
        camera2.lookAt(new THREE.Vector3(0, 0, 0));

        var camera3 = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000);
        camera3.position.set(0, 0, 5);
        camera3.lookAt(new THREE.Vector3(0, 0, 0));

        scene1.add(camera1);
        scene2.add(camera2);
        scene3.add(camera3);

        var ambiColor = "#0c0c0c";
        var ambientLight1 = new THREE.AmbientLight(ambiColor);
        var ambientLight2 = new THREE.AmbientLight(ambiColor);
        var ambientLight3 = new THREE.AmbientLight(ambiColor);
        scene1.add(ambientLight1);
        scene2.add(ambientLight2);
        scene3.add(ambientLight3);

        var pointColor = "#ccffcc";
        var pointLight = new THREE.PointLight(pointColor);
        pointLight.distance = 100;
        pointLight.intensity = 1;

        var pointLight2 = new THREE.PointLight(pointColor);
        pointLight2.distance = 100;
        pointLight2.intensity = 1;

        var pointLight3 = new THREE.PointLight(pointColor);
        pointLight3.distance = 100;
        pointLight3.intensity = 1;
        scene1.add(pointLight);
        scene2.add(pointLight2);
        scene3.add(pointLight3);

        var first = BOAT1.clone();
        first.scale.set(0.5, 0.5, 1);
        scene1.add(first);
        first.position.set(0, -1, -1);
        var second = BOAT2.clone();
        second.scale.set(0.6, 0.6, 1);
        scene2.add(second);
        second.position.set(-0.8, -0.5, -1);
        var third = BOAT3.clone();
        third.scale.set(0.02, 0.02, 0.05);
        scene3.add(third);
        third.position.set(0, -0.5, -1);

        render();

        function render() {
            // rotate the cubes around its axes
            first.rotation.y += 0.02;
            // first.position.x +=0.02;
            second.rotation.y += 0.02;
            third.rotation.y += 0.02;
            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer1.render(scene1, camera1);
            renderer2.render(scene2, camera2);
            renderer3.render(scene3, camera3);
        }
    }, 1000);
    console.log("waawawaawa");

})