var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => {
                if (!(s.store && s.store.energy >= creep.carryCapacity)) return false;

                if (s.structureType == STRUCTURE_CONTAINER) {
                    if (!Memory.structures) Memory.structures = {};
                    if (!Memory.structures[s.id]) Memory.structures[s.id] = {};
                    if (!Memory.structures[s.id].mine) Memory.structures[s.id].mine = false;
                    return Memory.structures[s.id].mine == false;
                }
                if (s.structureType == STRUCTURE_STORAGE) return true;

                return false;
            }});
            if (source && creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            } else {
                if (Game.flags['RallyUpgraders']) {
                    creep.moveTo(Game.flags['RallyUpgraders']);
                    creep.say('💤');
                }
            }
        }
    }
};

module.exports = roleUpgrader;