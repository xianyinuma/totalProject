/**
 * Created by wenjin on 2017/4/29.
 */
class GameManager {
    constructor(playerID, boatType) {
        var socket = io();

        var playerID = playerID;
        var currentPlayer = new Player(playerID);
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
        //组队
        var team = new Team(playerID);

        currentBoat = new Boat(playerID, boatType);

        //
        let tower = null;

        staticArray.set(0, tower);

        //get the boat
        socket.emit('start', {
            playerID: playerID,
            boatType: boatType
        });
        socket.on('get boat', function(boatData) {
            if (playerID == boatData.playerID) {
                currentBoat.update(boatData);
            } else {
                var boat = new Boat(boatData.playerID, boatData.boatType);
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
        var cameraTarget = new THREE.Vector3();
        var renderer = new THREE.WebGLRenderer();

        //camera初始化
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000000);
        camera.position.set(50, 40, -50);
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.maxPolarAngle = 1.3; //限制视角海平面以上
        controls.maxDistance = 300;
        controls.minDistance = 30;

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

        let gamers = $("#gamers");
        gamers.html(`
    <ul class="list-group">
        <li class="list-group-item" id="gamers-list-title">
            <span class="glyphicon glyphicon-sort-by-order-alt"></span>
            Gamers List:
        </li>

        <span id="gamers-user-list">
        </span>
    </ul>`);


        var statusPlayerID = $("#status-playerID");
        var statusHealth = $("#status-health");
        var statusLevel = $("#status-level");
        var orderedUserList = $("#ordered-user-list");
        var gamersUserList = $("#gamers-user-list");

        var map = new Map(output, renderer, camera);

        function UpdateOutput(currentBoat, boatArray, bulletArray, staticArray) {

            adjustWindowSize();
            UpdateStatusPanel();
            UpdateGamersPanel();
            sinkBullet(bulletArray);
            let feedback = currentBoat.BoatCheck(bulletArray, staticArray, boatArray);
            if (feedback.static !== null) {
                //collision with static object
                feedback.static.Operate(currentBoat);
                if (feedback.static instanceof Portal) {
                    portalAnimate();
                }
                // staticArray.removeValue(feedback.static); //@author mjt
                if (!(feedback.static instanceof UnmovableNPC))
                    socket.emit("delete static", feedback.static.id);
            }
            if (feedback.bullet !== null) {
                //非队友子弹才造成伤害
                if (!team.isTeammate(feedback.bullet.playerID)) {
                    currentBoat.ChangeHealth(-feedback.bullet.damage);
                    if (currentBoat.health === 0) {
                        //died

                        let killerId = feedback.bullet.playerID;
                        deadAnimate(killerId);
                        //send back the giveExp to do
                        if (!isNPC(killerId))
                            socket.emit('killed', {
                                giveExp: currentBoat.giveExp,
                                killerID: killerId
                            });
                    }
                    bulletArray.removeValue(feedback.bullet);
                }
            }
            if (feedback.boat !== null) {
                //船与船碰撞
                // currentBoat.ChangeHealth(-1);
                // currentBoat.curSpeed = currentBoat.curSpeed === 0 ? -10 : -currentBoat.curSpeed;
            }
            map.UpdateStatus(boatArray, bulletArray, mapWidth, mapHeight);
            map.UpdateOutput(currentBoat, boatArray, bulletArray, staticArray);
        }


        // self.setInterval(function() {
        //     UpdateOutput(currentBoat, boatArray, bulletArray, staticArray);
        // }, 50);

        var clock = new THREE.Clock();

        function animate() {
            var delta = clock.getDelta();
            requestAnimationFrame(animate);
            UpdateOutput(currentBoat, boatArray, bulletArray, staticArray);
            currentBoat.updateBoatModel(delta);

            // if (npcBoat && npcBoat.detect(currentBoat, delta)) {
            //     NPCFire(npcBoat);
            // }

            if (tower && tower.detect(currentBoat)) {
                unmovableNPCFire(tower);
            }

            CameraUpdate();
        }



        //boat info update
        self.setInterval(function() {
            //发送改变的信息
            if (currentBoat !== undefined) {
                socket.emit('update', currentBoat.getData());
            }
        }, 30);
        socket.on('load', function(data) {
            var boatMap = data.boatMap;
            // update the boats info
            var i = 0;

            for (var id in boatMap) {
                if (boatMap.hasOwnProperty(id)) {
                    if (playerID == id) {
                        boatArray.set(i, currentBoat);
                    } else {
                        if (boatArray.get(i) === null || boatArray.get(i).playerID != id)
                            boatArray.set(i, new Boat(id, boatMap[id].boatType));
                        boatArray.get(i).update(boatMap[id]);
                    }
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

        socket.on('static update', (staticMap) => {
            var i = 0,
                j;
            var len = ((Object.getOwnPropertyNames(staticMap).length) - 1) / 13;
            tower = new UnmovableNPC("NPC1");
            // let tower = new UnmovableNPC("NPC1");

            tower.mesh.position.x = staticMap[i].x;
            tower.mesh.position.y = -10;
            tower.mesh.position.z = staticMap[i].z;
            staticArray.set(0, tower);
            for (i = 1; i < len * 5 + 1; i++) {
                staticArray.set(i, new Box(i, 1, 0, staticMap[i].x, staticMap[i].z));
            }
            for (; i < len * 10 + 1; i++) {
                staticArray.set(i, new Box(i, 0, 1, staticMap[i].x, staticMap[i].z));
            }
            for (; i < len * 13 + 1; i++) {
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
        socket.on('get exp', function(data) {
            console.log('get exp: ' + data.giveExp);
            if (playerID == data.killerID)
                currentBoat.ChangeExp(data.giveExp);
        });

        // 发送队伍请求
        $('#team-request-send').click(function() {
            var to = $('#team-request-to').val();
            alert(to);
            if (team.isTeammate(to))
                alert('该玩家已是你的队友');
            else {
                alert('请求已发送');

                socket.emit('request team', playerID, to, team.teammates);
            }
        });
        // socket.emit('request team', playerID, '你要发送的对象', team.teammates);
        // 发送离队请求
        // socket.emit('leave team', playerID, team.teammates);

        //申请组队
        socket.on('request team', function(from, teammates) {
            //todo 弹窗 若答应
            // socket.emit('team ok', teammates, team.teammates);
            //若不答应
            // socket.emit('team no', playerID, from);
        });
        //加入队伍
        socket.on('team ok', function(teammates) {
            team.addTeammates(teammates);
            console.log(team.teammates);
        });
        //申请被拒绝
        socket.on('team no', function(from) {
            //todo 展示from拒绝了你
        });
        //接收离队请求
        socket.on('leave team', function(from) {
            team.deleteTeammate(from);
            console.log(team.teammates);
            //todo 展示from已离队
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

        function UpdateGamersPanel() {
            gamersUserList.html("");
            let orderedBoatArray = sortBoatArray();
            for (let i = 0; i < orderedBoatArray.size(); i++) {
                gamersUserList.append(`
            <li class="list-group-item">
            <span class="glyphicon glyphicon-user"></span>
            Username:` + orderedBoatArray.get(i).playerID + `
            <span class="glyphicon glyphicon-star"></span>
            Level:` + orderedBoatArray.get(i).level + `
            </li>`);
            }
        }

        function sortBoatArray() {
            let bubbleSort = function(arr) {
                let ret;
                for (let i = 0; i < arr.size() - 1; i++) {
                    for (let j = i + 1; j < arr.size(); j++) {
                        if (arr.get(i).level < arr.get(j).level) { //如果前面的数据比后面的大就交换
                            arr.switchElement(i, j);
                        } else if (arr.get(i).level == arr.get(j).level && arr.get(i).playerID > arr.get(j).playerID)
                            arr.switchElement(i, j);
                    }
                }
                ret = arr;
                return ret;
            };

            let ret = new ArrayList();

            let sortedArray = bubbleSort(boatArray);
            for (let i = 0; i < sortedArray.size(); i++) {
                if (ret.size() >= 5) return ret;
                let temp = sortedArray.get(i);
                if (!isNPC(temp.playerID)) {
                    ret.add(temp);
                }
                // ret.add(temp);
            }

            // console.log(ret);

            return ret;
        }

        function onKeyUp(event) {
            var keyValue = String.fromCharCode(event.keyCode).toLowerCase();
            switch (keyValue) {
                case 'w':
                    currentBoat.controlBoat.moveForward = false;
                    break;
                case 'a':
                    currentBoat.controlBoat.moveLeft = false;
                    break;
                case 's':
                    currentBoat.controlBoat.moveBackward = false;
                    break;
                case 'd':
                    currentBoat.controlBoat.moveRight = false;
                    break;
            }
        }

        function onKeyDown(event) {
            var keyValue = String.fromCharCode(event.keyCode).toLowerCase();
            switch (keyValue) {
                case 'w':
                    currentBoat.controlBoat.moveForward = true;
                    break;
                case 'a':
                    currentBoat.controlBoat.moveLeft = true;
                    break;
                case 's':
                    currentBoat.controlBoat.moveBackward = true;
                    break;
                case 'd':
                    currentBoat.controlBoat.moveRight = true;
                    break;
                case 'f':
                    curBoatFire();
                    break;
            }
        }

        function portalAnimate() {
            let tpDiv = $("#tp-info");
            tpDiv.css("z-index", "10");
            tpDiv.css("opacity", "1");
            setTimeout(function() {
                tpDiv.css("opacity", "0");
                setTimeout(function() {
                    tpDiv.css("z-index", "-10");
                }, 1500);
            }, 2000);
        }

        function deadAnimate(killerId) {

            let message;

            if (!isNPC(killerId)) {
                message = "你被" + killerId + "杀死了!" +
                    "<br> 正在重生.....";
            } else {
                message = "你被NPC杀死了！" +
                    "<br> 正在重生.....";
            }

            let messageDiv = $("#display-info");
            messageDiv.html(message);
            messageDiv.css("opacity", "1");
            messageDiv.css("z-index", "11");

            deathTransport(currentBoat);

            setTimeout(function() {
                messageDiv.css("opacity", "0");
                setTimeout(function() {
                    messageDiv.html("");
                    messageDiv.css("z-index", "-11");
                }, 5000);
            }, 5000);
        }

        function isNPC(id) {
            id = id.substr(0, 3);
            return (id === "NPC");
        }

        function deathTransport(boat) {
            let newX = Math.random() * 2000;
            let newZ = Math.random() * 2000;

            boat.mesh.position.x = newX;
            boat.mesh.position.z = newZ;

            boat.level = 1;
            boat.RefreshInfo();
        }

        //冷却射弹
        function curBoatFire() {
            let date = new Date();
            let t = date.getTime();
            if (t - currentBoat.fireTime > 1000) {
                socket.emit('fire', currentBoat.Fire().getData());
                currentBoat.fireTime = t;
            }
        }

        function unmovableNPCFire(b) {
            let date = new Date();
            let t = date.getTime();
            if (t - b.fireTime > 5000) {
                let bullets = b.Fire();
                for (let i in bullets) {
                    socket.emit('fire', bullets[i].getData());
                }
                b.fireTime = t;
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

            controls.target.set(currentBoat.mesh.position.x, currentBoat.mesh.position.y, currentBoat.mesh.position.z);
            controls.update();
        }

        animate();

    }
}