var roles = {
    'harvester': require('role.harvester'),
    'upgrader': require('role.upgrader'),
    'builder': require('role.builder'),
    'miner': require('role.miner'),
    'hauler': require('role.hauler')
};

var building = require('building');
var tower = require('tower');

module.exports.loop = function () {
    
    //if (Memory.nextMine == undefined) Memory.nextMine = 1;

    building.run(Game.spawns.Spawn1);

    var towers = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER, my: true}});
    towers.forEach(tower.run);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        // try {
            if (roles[creep.memory.role]){
                roles[creep.memory.role].run(creep);
            }
        // } catch (e) {
        //     console.log('Error running creep behaviour!', e);
        // }

    }
    
    // for (let f in Memory.flags) {
    //     if (!Game.flags[f]) {
    //         delete Memory.flags;
    //     }
    // }

    // Check for new mine flag
    if (Game.flags['NewMine']) {
        
        // Store the position, room, and remove the temporary flag
        var minePos = Game.flags['NewMine'].pos;
        var room = Game.flags['NewMine'].room;
        Game.flags['NewMine'].remove();
        
        // Get the next valid mine number
        var mineNo = 1;
        while (Game.flags['Mine' + mineNo]) mineNo++;
        
        // Make the mine name string
        var flagName = 'Mine' + mineNo;
        
        // Create the new flag
        var flag = room.createFlag(minePos, flagName, COLOR_YELLOW);
        Memory.flags[flagName] = { type: 'mine', slots: [] };
        
        console.log('Made flag memory.', Memory.flags[flagName]);
        
        // Get the Room.Terrain object for this room
        var terrain = room.getTerrain();
        
        // Loop over all adjacent tiles and remember those that are walkable
        var c = 0;
        for (var y = -1; y <= 1; y++) {
            for (var x = -1; x <= 1; x++) {
                if (terrain.get(minePos.x + x, minePos.y + y) != 1 && c < 1) {
                    Memory.flags[flagName].slots.push(new RoomPosition(minePos.x + x, minePos.y + y, room.name));
                    c++;
                }
            }
        }
        
    }
    
    for (let f in Game.flags) {
        let flag = Game.flags[f];
        
        if (!Memory.flags) Memory.flags = {};
        if (!Memory.flags[f]) Memory.flags[f] = {};
        
        switch (Memory.flags[f].type) {
            case 'newmine':
                break;
            case 'mine':
                break;
            default:
                
        }
    }
}