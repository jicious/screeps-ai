var utils = require('utils');

// Calculate the energy cost of making a body
/** @param {String[]} body */
function calcBodyCost(body) {
    return _.reduce(body, (sum, part) => sum + BODYPART_COST[part], 0);
}

// Make an array of body parts according to a pattern
function makeBody(start, iteration, max) {
    if (max === undefined) max = MAX_CREEP_SIZE;
    // Set up a new body array
    var body = [].concat(start);
    // Keep adding parts until we hit the energy limit or creep size limit
    while(calcBodyCost(body) + calcBodyCost(iteration) <= Game.spawns.Spawn1.room.energyAvailable &&
          body.length + iteration.length <= max) {
        // Add new parts to the body
        body = body.concat(iteration);
    }
    return body;
}

// Sum up all the stored energy in a room
function energyInStorage(room) {
    // Find all the energy storage structures
    var storage = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE ||
                structure.structureType == STRUCTURE_CONTAINER);
        }
    });
    
    // Keep count of total energy
    var total = 0;
    // Loop over storage structures
    for (var s in storage){
        // Add stored energy to total
        var store = storage[s];
        total += storage[s].store.energy;
    }

    return total;
}

function countRoles(role) {
    var count = 0;
    for (var c in Game.creeps) {
        if (Game.creeps[c].memory.role == role) count++;
    }
    return count;
}

/** @param {Spawn} spawn */
exports.run = function(spawn) {
    // Clean up creep memories of dead creeps.
    for (let c in Memory.creeps) {
        if (!Game.creeps[c]) delete Memory.creeps[c];
    }

    var workerBody = [], bodyIteration = [CARRY,WORK,MOVE,MOVE];
    while(calcBodyCost(workerBody) + calcBodyCost(bodyIteration) <= Game.spawns.Spawn1.room.energyAvailable &&
          workerBody.length + bodyIteration.length <= MAX_CREEP_SIZE) {
        workerBody = workerBody.concat(bodyIteration);
    }
    workerBody.sort(utils.bodySort);

    spawn.spawnCreep(workerBody, 'u1', {memory: {role: 'upgrader'}});
    spawn.spawnCreep(workerBody, 'u2', {memory: {role: 'upgrader'}});
    spawn.spawnCreep(workerBody, 'u3', {memory: {role: 'upgrader'}});
    if(spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0) spawn.spawnCreep(workerBody, 'b1', {memory: {role: 'builder'}});
    //if(spawn.room.find(FIND_CONSTRUCTION_SITES).length > 2) spawn.spawnCreep(workerBody, 'b2', {memory: {role: 'builder'}});
    //if(spawn.room.find(FIND_CONSTRUCTION_SITES).length > 5) spawn.spawnCreep(workerBody, 'b3', {memory: {role: 'builder'}});
    //spawn.createCreep(workerBody, 'h3', {role: 'harvester'});
    // spawn.createCreep(workerBody, 'h2', {role: 'harvester'});
    // spawn.createCreep(workerBody, 'h1', {role: 'harvester'});

    var minerCount = 0;
    for (let name in Game.creeps) {
        if (Game.creeps[name].memory.role == 'miner') minerCount++;
    }

    for (var name in Game.flags) {
        var flag = Game.flags[name];
        if (flag.memory.type == 'mine') {
            for (var s in flag.memory.slots) {
                var slot = flag.memory.slots[s];
                var minerName = 'miner' + slot.x + 'x' + slot.y;
                if (!Game.creeps[minerName]) {
                    var iteration = [MOVE, WORK];
                    var threshold = spawn.room.energyCapacityAvailable - calcBodyCost(iteration);
                    var body = makeBody([MOVE, WORK], iteration, 10);
                    if (body.length >= 10 || calcBodyCost(body) >= threshold || minerCount == 0 || Memory.forceMiner == true) {
                        res = spawn.createCreep(body.sort(utils.bodySort), minerName, {role: 'miner', targetPosition: slot });
                        delete Memory.forceMiner;
                    }
                }
            }
        }
    }

    // If there's too much energy in storage
    if (energyInStorage(spawn.room) > 2000 && countRoles('hauler') < 6) {
        spawnHauler(spawn, spawn.room.energyCapacityAvailable);
    }

    if (spawn.room.energyAvailable >= 600 && countRoles('hauler') < 3) {
        spawnHauler(spawn, spawn.room.energyAvailable);
    }

    if (spawn.room.energyAvailable <= 300 && countRoles('hauler') == 0) {
        spawnHauler(spawn, spawn.room.energyAvailable);
    }
}

function spawnHauler(spawn, size) {
    // Get the next valid creep number
    var haulerno = 1;
    while (Game.creeps['Hauler' + haulerno]) haulerno++;

    // Make the creep name string
    var haulerName = 'Hauler' + haulerno;

    var iteration = [MOVE, CARRY];
    var threshold = size - calcBodyCost(iteration);        
    var body = makeBody([], iteration).sort(utils.bodySort);

    if (calcBodyCost(body) >= threshold || body.length == MAX_CREEP_SIZE) {
        spawn.spawnCreep(body, haulerName, { memory: { role: 'hauler' }});
    }
}