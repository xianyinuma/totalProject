function confirm(){
    var username = document.getElementById("username");
    var string = username.value;
    var head = string.substring(0,3).toLowerCase();
    if(head=="npc"){
        alert("Oops!You cannot have a username start with npc!");
        return false;
    }else{
        alert("注册成功");
    }
}