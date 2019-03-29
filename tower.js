module.exports = {
    run: function(tower) {

        var res;
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            res = tower.attack(closestHostile);
            if (res == ERR_NOT_ENOUGH_ENERGY) return; // Don't do anything else if there is a hostile but not enough energy to kill it
            // Later this should be smarter somehow.
        }
        
        var structures = tower.room.find(FIND_STRUCTURES, { filter: (s) => {
            if (s.structureType == STRUCTURE_WALL) return s.hits < 10000;
            return s.hits < s.hitsMax;
        }});
        structures.sort((a, b) => { return a.hits - b.hits; });
        // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => structure.hits < structure.hitsMax
        // });
        var closestDamagedStructure = structures[0];
        if(structures.length > 0) {
            tower.repair(structures[0]);
        }
    }
};