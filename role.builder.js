var Utils = require('./utils');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                creep.say('⚒️');
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
        else {
            creep.say('☀️');
            var source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (s) => s.resourceType == RESOURCE_ENERGY });
            var method = 'pickup';
            if (!source) {
                creep.say('🥃');
                source = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => {
                    if (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) {
                        return s.store[RESOURCE_ENERGY] > 0;
                    }
                    return false;
                }});
                method = 'withdraw';
            }
            if (!source) {
                creep.say('⛏️');
                source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                method = 'harvest';
            }
            if (source && creep[method](source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleBuilder;