var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.unloading && creep.carry.energy == 0) {
            delete creep.memory.sourceID;
            creep.memory.unloading = false;
            creep.say('Collect');
        }
        if(!creep.memory.unloading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.unloading = true;
            creep.say('Deliver');
        }
        if(!creep.memory.unloading) {
            creep.say('☀️');
            var source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (s) => s.resourceType == RESOURCE_ENERGY});
            var method = 'pickup';
            if (!source) {
                creep.say('🥃');
                method = 'withdraw';
                source = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => {
                    if (!(s.store && s.store.energy > 0)) return false;
    
                    if (s.structureType == STRUCTURE_CONTAINER) {
                        if (!Memory.structures) Memory.structures = {};
                        if (!Memory.structures[s.id]) Memory.structures[s.id] = {};
                        if (!Memory.structures[s.id].mine) Memory.structures[s.id].mine = false;
                        return Memory.structures[s.id].mine == true;
                    }
                    if (s.structureType == STRUCTURE_STORAGE) return true;
    
                    return false;
                }});
            }
            let res = creep[method](source, RESOURCE_ENERGY);
            if (source && res == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            } else if (source) {
                creep.memory.sourceID = source.id;
            }
            if (res == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.sourceID = source.id;
                creep.memory.unloading = true;
            }
            if (!source) {
                if (creep.carry.energy > 0) {
                    creep.memory.unloading = true;
                } else {
                    if (Game.flags['RallyHaulers']) {
                        creep.moveTo(Game.flags['RallyHaulers']);
                        creep.say('💤');
                    }
                }
            }
        }
        else {
            // let i = 0;
            // do {
            //     i++;
            // } while (i < 10);
            let target = findDeliveryTarget(creep);
            if (target) {
                let res = creep.transfer(target, RESOURCE_ENERGY);
                if (res == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                } else if (res != OK) {
                    if (Game.flags['RallyHaulers']) {
                        creep.moveTo(Game.flags['RallyHaulers']);
                        creep.say('💤');
                    }
                }
            }
        }
    }
};

function findNearbyContainer(creep) {

}

/** @param {Creep} creep **/
function findDeliveryTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => {
            if (!isValidDelivery(Game.getObjectById(creep.memory.sourceID), s)) return false;
            // console.log('Found valid delivery:', Game.getObjectById(creep.memory.sourceID).structureType, s.structureType);
            if (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) {
                if (!Memory.structures) Memory.structures = {};
                if (!Memory.structures[s.id]) Memory.structures[s.id] = {};
                if (!Memory.structures[s.id].mine) Memory.structures[s.id].mine = false;
                return Memory.structures[s.id].mine == false;
            }
            if (s.structureType == STRUCTURE_CONTROLLER) {
                return s.progress < s.progressTotal;
            }
            if (s.structureType == STRUCTURE_STORAGE) {
                return s.store.energy < s.storeCapacity;
            }
            return (s.structureType == STRUCTURE_EXTENSION ||
                s.structureType == STRUCTURE_SPAWN ||
                s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity;
        }
    });
    return target;
}

function isValidDelivery(a, b) {
    if (!a || !b) return false;
    if (a.id == b.id) return false;
    if (a.structureType == STRUCTURE_STORAGE) {
        if (b.structureType == STRUCTURE_CONTAINER) {
            // Can transfer from Storage -> Normal Containers
            return Memory.structures[b.id] != 'miner';
        }
        if (b.structureType == STRUCTURE_EXTENSION ||
            b.structureType == STRUCTURE_SPAWN ||
            b.structureType == STRUCTURE_LINK ||
            b.structureType == STRUCTURE_TOWER) {
            return true;
        }
    }
    if (a.structureType == STRUCTURE_CONTAINER) {
        if (b.structureType == STRUCTURE_CONTAINER) {
            // Can transfer from Miner Containers -> Normal Containers
            return Memory.structures[a.id] == 'miner' && Memory.structures[b.id] != 'miner';
        }
    }
    if (a.structureType == STRUCTURE_CONTAINER) {
        if (b.structureType == STRUCTURE_EXTENSION ||
            b.structureType == STRUCTURE_SPAWN ||
            b.structureType == STRUCTURE_LINK ||
            b.structureType == STRUCTURE_TOWER ||
            b.structureType == STRUCTURE_STORAGE) {
            return true;
        }
    }
    return false;
}

module.exports = roleHauler;