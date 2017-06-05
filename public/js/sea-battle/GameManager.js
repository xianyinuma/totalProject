/**
 * Created by wenjin on 2017/4/29.
 */
class GameManager {
    constructor(playerID) {
        var socket = io();

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
        bulletArray = new ArrayList();
        staticArray = new ArrayList();

        currentBoat = new Boat(playerID);
        // boatArray.add(currentBoat);

        //get the boat
        socket.emit('start', playerID);
        socket.on('get boat', function(boatData) {
            if (playerID == boatData.playerID) {
                currentBoat.update(boatData);
            } else {
                var boat = new Boat(boatData.playerID);
                boat.update(boatData);
                // boatArray.add(boat);
                console.log(boatData.playerID + " start");
            }
        });

        //dynamic construct the camera
        var mapWidth;
        var mapHeight;
        adjustWindowSize();

        var camera, controls;
        var renderer = new THREE.WebGLRenderer();

        //camera初始化
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000000);
        camera.position.set(0, 20, 100);
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        let statusList = $("#status-list");
        statusList.html(`<ul class="list-group">
        <li class="list-group-item" id="status-list-title">
            <span class="glyphicon glyphicon-stats"></span>
            Status List:
        </li>

        <li class="list-group-item">
            <span class="glyphicon glyphicon-user"></span>
            Username:
            <span id="status-playerID"></span>
        </li>

        <li class="list-group-item">
            <span class="glyphicon glyphicon-heart-empty"></span>
            Health:
            <span id="status-health"></span>
        </li>

        <li class="list-group-item">
            <span class="glyphicon glyphicon-star"></span>
            Level:
            <span id="status-level"></span>
        </li>
        </ul>`);
        let rankingList = $("#ranking-list");
        rankingList.html(`
    <ul class="list-group">
        <li class="list-group-item" id="ranking-list-title">
            <span class="glyphicon glyphicon-sort-by-order-alt"></span>
            Ranking List:
        </li>

        <span id="ordered-user-list">
        </span>
    </ul>`);


        var statusPlayerID = $("#status-playerID");
        var statusHealth = $("#status-health");
        var statusLevel = $("#status-level");
        var orderedUserList = $("#ordered-user-list");

        var map = new Map(output, renderer, camera);

        function UpdateOutput(currentBoat, boatArray, bulletArray, staticArray) {

            adjustWindowSize();
            UpdateStatusPanel();
            sinkBullet(bulletArray);
            let feedback = currentBoat.BoatCheck(bulletArray, staticArray);
            if (feedback.static != null) {
                //collision with static object
                feedback.static.Operate(currentBoat);
                // staticArray.removeValue(feedback.static); //@author mjt
                socket.emit("delete static", feedback.static.id);
            }
            if (feedback.bullet != null) {
                currentBoat.ChangeHealth(-feedback.bullet.damage);
                if (currentBoat.health == 0) {
                    //died
                    boatArray.removeValue(currentBoat);
                    //send back the giveExp to do

                }
                bulletArray.removeValue(feedback.bullet);
            }
            map.UpdateStatus(boatArray, bulletArray, mapWidth, mapHeight);
            map.UpdateOutput(currentBoat, boatArray, bulletArray, staticArray);
        }


        self.setInterval(function() {
            UpdateOutput(currentBoat, boatArray, bulletArray, staticArray);
        }, 50);

        // console.log(currentBoat.mesh.position);

        //boat info update
        self.setInterval(function() {
            //发送改变的信息
            if (currentBoat !== undefined) {
                socket.emit('update', currentBoat.getData());
            }
        }, 50);
        socket.on('load', function(data) {
            var boatMap = data.boatMap;
            // update the boats info
            var i = 0;

            for (var id in boatMap) {
                if (boatMap.hasOwnProperty(id)) {
                    if (playerID != id) {
                        if (!boatArray.contains(i)) {
                            boatArray.set(i, new Boat(id));
                        }
                        boatArray.get(i).update(boatMap[id]);
                    } else
                        boatArray.set(i, currentBoat);
                }
                i++;
            }
        });

        socket.on('fire', function(bulletData) {
            //实例化该子弹信息
            var bullet = new Bullet(bulletData.playerID, bulletData.damage, bulletData.speed);
            bullet.update(bulletData);
            bulletArray.add(bullet);
            console.log(bulletData.playerID + ' fire');
        });

        socket.on('static update', function(staticMap) {
            var i, j;
            var len = (Object.getOwnPropertyNames(staticMap).length) / 13;
            for (i = 0; i < len * 5; i++) {
                staticArray.set(i, new Box(i, 1, 0, staticMap[i].x, staticMap[i].z));
            }
            for (j = i; i < len * 10; i++) {
                staticArray.set(i, new Box(i, 0, 1, staticMap[i].x, staticMap[i].z));
            }
            for (j = i; i < len * 13; i++) {
                staticArray.set(i, new Portal(i, 1000, 1000, staticMap[i].x, staticMap[i].z));
            }

            console.log(staticArray);
        });
        socket.on('delete static', function(staticID) {
            for (var i = 0; i < staticArray.size(); i++) {
                if (staticArray.get(i).id == staticID) {
                    staticArray.remove(i);
                    break;
                }
            }
            console.log(staticArray);
        });

        socket.on('quit', function(playerID) {
            console.log(playerID + " quit");
            for (var i = 0; i < boatArray.size(); i++) {
                if (boatArray.get(i).playerID == playerID) {
                    boatArray.remove(i);
                    break;
                }
            }
        });

        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);

        function UpdateStatusPanel() {
            statusHealth.html(currentBoat.health);
            statusLevel.html(currentBoat.level);
            orderedUserList.html("");
            let orderedBoatArray = sortBoatArray();
            for (let i = 0; i < orderedBoatArray.size(); i++) {
                orderedUserList.append(`
            <li class="list-group-item">
            <span class="glyphicon glyphicon-user"></span>
            Username:` + orderedBoatArray.get(i).playerID + `
            <span class="glyphicon glyphicon-star"></span>
            Level:` + orderedBoatArray.get(i).level + `
            </li>`);
            }
        }

        function sortBoatArray() {
            var tempBoat;
            let bubbleSort = function(arr) {
                for (let i = 0; i < arr.size() - 1; i++) {
                    for (let j = i + 1; j < arr.size(); j++) {
                        if (arr.get(i).level < arr.get(j).level) { //如果前面的数据比后面的大就交换
                            arr.switchElement(i, j);
                        }
                    }
                }
                return arr;
            };
            return bubbleSort(boatArray);
        }

        function onKeyUp(event) {
            var value = String.fromCharCode(event.keyCode).toLowerCase();

            //currentBoat.control(value, 'keyup');
            if (value == "w" || value == "s" || value == "a" || value == "d") {
                currentBoat.control(value, 'keyup');
            }
        }

        function onKeyDown(event) {
            if (event.keyCode == 32) {
                //space bar, sync the camera by the space bar
                CameraUpdate();
            } else {
                var value = String.fromCharCode(event.keyCode).toLowerCase();
                if (value == "f") {
                    let bullet = currentBoat.Fire();
                    socket.emit('fire', bullet.getData());
                    // bulletArray.add(bullet);
                } else if (value == "w" || value == "s" || value == "a" || value == "d") {
                    currentBoat.control(value, 'keydown');
                }

            }
        }

        function sinkBullet(bulletArray) {
            for (let i = 0; i < bulletArray.size(); i++) {
                let temp_bullet = bulletArray.get(i);
                if (temp_bullet.mesh.position.y <= 0) {
                    bulletArray.removeValue(temp_bullet)
                }
            }
        }

        function adjustWindowSize() {
            if (window.innerWidth < 1000) {
                //small width, status display under the map
                mapWidth = 1000;
                mapHeight = 600;
            } else {
                mapWidth = window.innerWidth;
                mapHeight = window.innerHeight;
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