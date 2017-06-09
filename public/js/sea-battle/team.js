class Team {
    constructor(playerID) {
        this.playerID = playerID;

        this.teammates = {};
        this.teammates[playerID] = true;
    }

    isTeammate(id) {
        return (this.teammates[id] !== undefined);
    }

    addTeammates(teammates) {
        for (var id in teammates)
            this.teammates[id] = true;
    }

    deleteTeammate(id) {
        delete this.teammates[id];
    }

    quitTeam() {
        this.teammates = {};
        this.teammates[playerID] = true;
    }
}