$(document).ready(function() {
    
    createWoodenShip();
    createGermanShip();
    
    setTimeout(function(){
        alert("Choose your ship");
        var renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('ship1')
    });
    renderer.setClearColor(0xFFFFFF); // black
      
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);

    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff // white
    });
    var triGeo = new THREE.Geometry();
    triGeo.vertices = [new THREE.Vector3(0, -0.8, 0),new THREE.Vector3(-2, -0.8, 0), new THREE.Vector3(-1, 0.8, 0)];
    triGeo.faces.push(new THREE.Face3(0, 2, 1));
    var triangle = new THREE.Mesh(triGeo, material);

    var first = BOAT.clone();
        first.scale.set(0.015, 0.015, 0.015);
        scene.add(first);
    // scene.add(triangle);
    
    render();
    function render() {
            // rotate the cubes around its axes
            first.rotation.y +=0.02;

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            renderer.render(scene, camera);
    }
        
    }, 3000);
    console.log("waawawaawa");
    
})
    

