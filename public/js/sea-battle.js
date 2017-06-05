/**
 * Created by wenjin on 2017/4/28.
 */

//in the html, load the js file, must follow the inherit chain! By order!
// let testBox = new Box(1, 2, 3, 4);
$(document).ready(function() {
    //load models
    //get username from the url
    (function($) {
        $.getUrlParam = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
    })(jQuery);
    var playerID = $.getUrlParam('username');
    LoadModels();
    setTimeout(function() {
        let gameManager = new GameManager(playerID);
        //start chatroom
        startChatRoom(playerID);

    }, 3000);

    //when quit @author mjt
    window.onbeforeunload = function() {
        var socket = io();
        socket.emit('quit', playerID);
    };


    function LoadModels() {
        createWoodenShip();
        createRecruit();
        createBulletSphere();
        createDoor(13, 1.7, 121, 12, 4, 4, 3.5);
    }
});