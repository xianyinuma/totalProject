/**
 * Created by wenjin on 2017/4/30.
 */
class Player {
    constructor(playerID) {
        this.playerID = playerID;
        //access the player data by playerID
        this.name = null;


    }
    InitialBoat() {
        this.boat = new Boat(this.playerID);
        return this.boat;
    }
    Login() {
        //inform the server
    }
    Logout() {
        //inform the server
    }
}