/**
 * Created by Victor on 2017/4/27.
 */

class Boat extends MovableObject {
    constructor(objectID) {
        super(objectID);

        this.level = 1;
        this.damage = Math.pow(2, this.level - 1);
        this.horizontalSpeed = 100000 / this.level;
        this.exp = 0;
        this.maxExp = 10 * Math.pow(2, this.level - 1);
        this.giveExp = this.maxExp / 2;
        this.maxHealth = 3 * Math.pow(2, this.level - 1);
        this.health = this.maxHealth;

            //for move
        this.speed = this.horizontalSpeed;
        this.wFlag = false;
        this.aFlag = false;
        this.sFlag = false;
        this.dFlag = false;
        this.speedTimeDecreaseFlag = false;
        this.theta = 0;
        this.curSpeed = 0;
        //move info
        this.time1;


        this.mesh = BOAT.clone();
        this.radius = 20;
    }

    BoatCheck(bulletArray, staticArray) {
        var feedback = new Object();
        feedback.static = this.BoatCollisionArray(staticArray);
        feedback.bullet = this.BoatCollisionArray(bulletArray);

        return feedback;
    }

    BoatCollisionArray(collisionArray) {
        for (let i = 0; i < collisionArray.size(); i++) {
            if (this.BoatCollision(collisionArray.get(i)))
                return collisionArray.get(i);
        }
        return null;
    }

    BoatCollision(collisionBody) {
        let originPos = this.mesh.position.clone();
        let collisionBodyPos = collisionBody.mesh.position.clone();

        let distanceSquared = originPos.distanceTo(collisionBodyPos);

        let collisionBodyRadius = collisionBody.radius;
        
        let radius = this.radius;

        return (radius + collisionBodyRadius) >= distanceSquared;
    }

    Fire() {
        //let bulletID = 123;
        let bullet = new Bullet(this.playerID, this.damage, this.level * 10);
        bullet.mesh.rotation.set(this.mesh.rotation.x, this.mesh.rotation.y, this.mesh.rotation.z);
        // bullet.mesh.position.x = this.mesh.position.x;
        // bullet.mesh.position.y = 10;
        // bullet.mesh.position.z = this.mesh.position.z + this.radius + bullet.radius + 1 ;
        // bullet.mesh.position.set(0,10,0);
        //debug
        bullet.mesh.position.x = this.mesh.position.x;
        bullet.mesh.position.y = 30;
        bullet.mesh.position.z = this.mesh.position.z;
        return bullet;

    }


    ChangeHealth(add_health) {
        var after_change = this.health + add_health;
        if (after_change > this.maxHealth) {
            this.health = this.maxHealth
        } else if (after_change <= 0) {
            this.health = 0;
        } else {
            this.health = after_change;
        }
    }

    ChangeExp(add_exp) {
        // some problem
        if (!this.LevelUp(add_exp)) {
            this.exp += add_exp;
        }
    }

    LevelUp(added_exp) {
        var after_exp = this.exp + added_exp;
        if (after_exp > this.maxExp) {
            this.level += 1;
            this.damage = Math.pow(2, this.level - 1);
            this.horizontalSpeed = 10 / this.level;
            this.exp = after_exp - this.maxExp;
            this.maxExp = 10 * Math.pow(2, this.level - 1);
            this.giveExp = this.maxExp / 2;
            this.maxHealth = 3 * Math.pow(2, this.level - 1);
            this.health = this.maxHealth;
            return true;
        } else {
            return false;
        }
    }


    //

    Move() {
        if (Date.now() - this.time1 >= 500) {
            this.speedTimeDecreaseFlag = true;
        }
        if (this.speedTimeDecreaseFlag) {
            if (this.curSpeed > 0) {
                if (this.curSpeed - 0.002 >= 0)
                    this.curSpeed -= 0.002;
                else {
                    this.curSpeed = 0;
                }
            } else {
                if (this.curSpeed + 0.002 <= 0)
                    this.curSpeed += 0.002;
                else {
                    this.curSpeed = 0;
                }
            }
        }


        // document.getElementById("debug").innerHTML = this.curSpeed + "\n" + this.mesh.position.x + "\n" + this.mesh.position.z;
        this.forward(this.curSpeed);

        // document.getElementById("debug").innerHTML = this.mesh.position.x + " " + this.mesh.position.z;

        // this.mesh.position.x += 1;

    }


    control(key, operation) {
        if (operation == 'keydown') {
            switch (key) {
                case 'w':
                    this.wFlag = true;
                    break;
                case 's':
                    this.sFlag = true;
                    break;
                case 'a':
                    this.aFlag = true;
                    break;
                case 'd':
                    this.dFlag = true;
                    break;
            }
        } else if (operation == 'keyup') {
            switch (key) {
                case 'w':
                    this.wFlag = false;
                    break;
                case 's':
                    this.sFlag = false;
                    break;
                case 'a':
                    this.aFlag = false;
                    break;
                case 'd':
                    this.dFlag = false;
                    break;
            }
        }


        if (this.wFlag) this.move('w');
        if (this.aFlag) this.move('a');
        if (this.sFlag) this.move('s');
        if (this.dFlag) this.move('d');
    }


    move(key) {
        switch (key) {
            case 'w':
                this.increaseSpd();
                this.time1 = Date.now();
                this.speedTimeDecreaseFlag = false;
                break;
            case 's':
                this.decreaseSpd();
                this.time1 = Date.now();
                this.speedTimeDecreaseFlag = false;
                break;
            case 'a':
                this.changeDir(0.5);
                break;
            case 'd':
                this.changeDir(-0.5);
                break;
        }
    }


    increaseSpd() {
        if (this.curSpeed < this.speed) {
            if (this.curSpeed + 0.002 <= this.speed) {
                this.curSpeed += 0.002;
            } else {
                this.curSpeed = this.speed;
            }
        } else {
            this.curSpeed = this.speed;
        }
    }

    decreaseSpd() {
        if (this.curSpeed > -this.speed) {
            if (this.curSpeed - 0.002 >= -this.speed) {
                this.curSpeed -= 0.002;
            } else {
                this.curSpeed = -this.speed;
            }
        } else {
            this.curSpeed = -this.speed;
        }
    }

    changeDir(dir) {
        if (this.curSpeed != 0) {
            this.theta += dir;
            if (this.theta >= 360) {
                this.theta -= 360;
            }

            if (this.theta <= -360) {
                this.theta += 360;
            }
        }

        var rad = Math.PI / 180;
        this.mesh.rotation.y = rad * this.theta;
    }

    forward(dist) {


        var xDir = this.mesh.position.x;
        var zDir = this.mesh.position.z;
        var rad = Math.PI / 180;

        // var distance = Math.sqrt(xDir * xDir + zDir * zDir);
        //
        // distance += dist;

        zDir = zDir + dist * Math.cos(rad * this.theta);
        xDir = xDir + dist * Math.sin(rad * this.theta);


        this.mesh.position.x = xDir;
        this.mesh.position.z = zDir;

        // this.mesh.traverse(function (child) {
        //
        //     if (child instanceof THREE.Mesh) {
        //
        //         child.position.x = xDir;
        //         child.position.z = zDir;
        //
        //     }
        //
        // });


    }


//     var speedTimeDecreaseFlag = false;
//
//     var theta = 0;
//     var curSpeed = 0;
//     //move info
//     var time1, time2;
//
//
//
//     var wFlag,aFlag,sFlag,dFlag = false;
//
//    
//
//     timeExecute(){
//         if(Date.now() - time1 >= 500){
//             speedTimeDecreaseFlag = true;
//         }
//         if(speedTimeDecreaseFlag){
//             if (curSpeed > 0){
//                 if (curSpeed - 0.002 >= 0)
//                     curSpeed -= 0.002;
//                 else{
//                     curSpeed = 0;
//                 }
//             }else{
//                 if (curSpeed + 0.002 <= 0)
//                     curSpeed += 0.002;
//                 else{
//                     curSpeed = 0;
//                 }
//             }
//         }
//
//
//         forward(curSpeed);
//
//     };
//
//     control(key,operation){
//     if (operation == 'keydown'){
//         switch (key){
//             case 'w':
//                 wFlag = true;
//                 break;
//             case 's':
//                 sFlag = true;
//                 break;
//             case 'a':
//                 aFlag = true;
//                 break;
//             case 'd':
//                 dFlag = true;
//                 break;
//         }
//     }else if(operation == 'keyup'){
//         switch (key){
//             case 'w':
//                 wFlag = false;
//                 break;
//             case 's':
//                 sFlag = false;
//                 break;
//             case 'a':
//                 aFlag = false;
//                 break;
//             case 'd':
//                 dFlag = false;
//                 break;
//         }
//     }
//
//
//     if (wFlag) move('w');
//     if (aFlag) move('a');
//     if (sFlag) move('s');
//     if (dFlag) move('d');
// }
//
//
//     var move = function(key){
//         switch(key){
//             case 'w':
//                 increaseSpd();
//                 // time1 = Date.now();
//                 speedTimeDecreaseFlag = false;
//                 break;
//             case 's':
//                 decreaseSpd();
//                 // time1 = Date.now();
//                 speedTimeDecreaseFlag = false;
//                 break;
//             case 'a':
//                 changeDir(1);
//                 break;
//             case 'd':
//                 changeDir(-1);
//                 break;
//         }
//     };
//
//     var increaseSpd = function(){
//         if(curSpeed < speed){
//             if (curSpeed + 0.002 <= speed){
//                 curSpeed += 0.002;
//             }else{
//                 curSpeed = speed;
//             }
//         }else{
//             curSpeed = speed;
//         }
//     };
//
//     var decreaseSpd = function(){
//         if (curSpeed > -speed){
//             if (curSpeed - 0.002 >= -speed){
//                 curSpeed -= 0.002;
//             }else{
//                 curSpeed = -speed;
//             }
//         }else{
//             curSpeed = -speed;
//         }
//     };
//
//     var changeDir = function(dir){
//         if (curSpeed != 0){
//             theta += dir;
//             if (theta >= 360){
//                 theta -= 360;
//             }
//
//             if (theta <= -360){
//                 theta += 360;
//             }
//         }
//
//         var rad = Math.PI / 180;
//         body.rotation.y = rad * theta;
//     };
//
//     var forward = function(dist){
//
//
//         var xDir = body.position.x;
//         var zDir = body.position.z;
//         var rad = Math.PI / 180;
//
//         // var distance = Math.sqrt(xDir * xDir + zDir * zDir);
//         //
//         // distance += dist;
//
//         zDir = zDir + dist * Math.cos(rad * theta);
//         xDir = xDir + dist * Math.sin(rad * theta);
//
//         body.position.z = zDir;
//         body.position.x = xDir;
//
//
//     };


}
