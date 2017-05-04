/**
 * Created by wenjin on 2017/4/28.
 */

//in the html, load the js file, must follow the inherit chain! By order!
// let testBox = new Box(1, 2, 3, 4);
$(document).ready(function () {

    //load models
    LoadModels();
    var playerID = 1;
    setTimeout(function() {
        let gameManager = new GameManager(playerID);
        //start chatroom
        startChatRoom(playerID);

    }, 1000);


    function LoadModels() {
        createWoodenShip();
        createRecruit();
        createBulletSphere();
        createDoor(13, 1.7, 121, 12, 4, 4, 3.5);
    }
});