/**
 * Created by wenjin on 2017/4/29.
 */
class GameManager {
    constructor(playerID) {

        var playerID = playerID;
        var currentPlayer = new Player(playerID); //todo
        var currentBoat = currentPlayer.InitialBoat();

        //adjust size by window
        var output = $("#map-output");
        //access the map data by playerID
        var boatArray = null;
        var bulletArray = null;
        var staticArray = null;

        boatArray = new ArrayList();
        boatArray.add(currentBoat);

        bulletArray = new ArrayList();
        let bullet = new Bullet(1,1,0);
        bullet.mesh.position.y = 40;
        bulletArray.add(bullet);

        staticArray = new ArrayList();
        
        // let box = new Box(1, 0);
        // box.mesh.position.set(100, 0, 100);
        // staticArray.add(box);
        // staticArray.add(new Portal(300, 1200, 900));

        //dynamic construct the camera
        var length = 1200;
        var width = 700;
        
        var camera, controls;
        var renderer = new THREE.WebGLRenderer();

        //camera初始化
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000000);
        camera.position.set(0, 20, 100);
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        var map = new Map(output, length, width, renderer, camera);

        UpdateOutput(currentBoat, boatArray, bulletArray, staticArray);//todo

        function UpdateOutput(currentBoat, boatArray, bulletArray, staticArray) {
            sinkBullet(bulletArray);
            let feedback = currentBoat.BoatCheck(bulletArray, staticArray);
            if (feedback.static != null) {
                //collision with static object
                feedback.static.Operate(currentBoat);
                staticArray.removeValue(feedback.static);
            }
            if (feedback.bullet != null) {
                // alert(-feedback.bullet.damage);
                // alert(currentBoat.health);
                currentBoat.ChangeHealth(-feedback.bullet.damage);
                // alert(currentBoat.health);
                if (currentBoat.health == 0) {
                    //died
                    boatArray.removeValue(currentBoat);
                    //send back the giveExp to do

                }
                bulletArray.removeValue(feedback.bullet);
            }
            
            map.UpdateStatus(boatArray, bulletArray);
            map.UpdateOutput(currentBoat, boatArray, bulletArray, staticArray);
            
            document.getElementById("debug").innerHTML = "bullet size:\n" + bulletArray.size() +
                "\nboat size:\n" + boatArray.size() + "\nboat health:\n" + boatArray.get(0).health;
        }



        function sinkBullet(bulletArray) {
            for (let i = 0; i < bulletArray.size(); i++) {
                let temp_bullet = bulletArray.get(i);
                if(temp_bullet.mesh.position.y <= 0) {
                    bulletArray.removeValue(temp_bullet)
                }
            }
        }

        self.setInterval(function () {
            UpdateOutput(currentBoat, boatArray, bulletArray, staticArray, camera);
            //camera更新
            //CameraUpdate();
        }, 50);
        // self.setInterval(function () {
        //     CameraUpdate()
        // }, 5);

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);

        function onKeyUp(event) {
            var value = String.fromCharCode(event.keyCode).toLowerCase();

            //currentBoat.control(value, 'keyup');
            if (value == "w" || value == "s" || value == "a" || value=="d") {
                currentBoat.control(value, 'keyup');
            }
        }

        function onKeyDown(event) {
            if(event.keyCode == 32) {
                //space bar, sync the camera by the space bar
                CameraUpdate();
            }
            else {
                var value = String.fromCharCode(event.keyCode).toLowerCase();
                if(value == "f"){
                    let bullet = currentBoat.Fire();
                    bulletArray.add(bullet);
                }
                else if (value == "w" || value == "s" || value == "a" || value=="d") {
                    currentBoat.control(value, 'keydown');
                }

            }
        }


        function CameraUpdate() {
            var cameraY = camera.position.y;
            var rad = Math.PI / 180;

            camera.position.x += currentBoat.curSpeed * Math.sin(rad * currentBoat.theta);
            camera.position.z += currentBoat.curSpeed * Math.cos(rad * currentBoat.theta);
            camera.position.y = cameraY;
            camera.lookAt({
                x: currentBoat.mesh.position.x,
                y: currentBoat.mesh.position.y,
                z: currentBoat.mesh.position.z
            });

            controls.target.set(currentBoat.mesh.position.x, currentBoat.mesh.position.y, currentBoat.mesh.position.z);
            controls.update();
        }
        //镜头跟踪，用户按下space bar空格键同步，模拟LOL视角控制
    }
}