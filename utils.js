/**
 * @callback structureFilterCallback
 * @param {Structure} structure The structure to include or exclude
 * @returns {Boolean} Whether or not to search for this structure
 */

/**
 * @param {String} type Type of object to search for.
 * @param {RoomPosition} pos Starting position to search from
 * @param {structureFilterCallback} filter Filter function
 */
module.exports.findNearest = (type, from, filter) => {

};

var BODY_VALUE = {};
BODY_VALUE[WORK] = 10;
BODY_VALUE[MOVE] = 100;
BODY_VALUE[CARRY] = 11;
BODY_VALUE[ATTACK] = 16;
BODY_VALUE[RANGED_ATTACK] = 15;
BODY_VALUE[HEAL] = 14;
BODY_VALUE[CLAIM] = 1;
BODY_VALUE[TOUGH] = 0;
module.exports.bodySort = (a, b) => {
    return BODY_VALUE[a] - BODY_VALUE[b];
}