module.exports.run = function(creep) {

    // Check if not where we are meant to be and move there
    
    // creep.memory.targetPosition will be our target location
    // creep.memory.targetSource will be our power source to mine

    if (creep.pos.x != creep.memory.targetPosition.x || creep.pos.y !== creep.memory.targetPosition.y) {
        creep.say('👣');
        creep.moveTo(creep.memory.targetPosition.x, creep.memory.targetPosition.y);
    } else {
        creep.say('⛏️');
        var s = creep.room.lookForAtArea(LOOK_SOURCES, creep.pos.y - 1, creep.pos.x - 1, creep.pos.y + 1, creep.pos.x + 1, true);
        creep.harvest(s[0].source);
    }

};