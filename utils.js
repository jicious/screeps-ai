let Utils = {};

/**
 * @callback structureFilterCallback
 * @param {Structure} structure The structure to include or exclude
 * @returns {Boolean} Whether or not to search for this structure
 */

/**
 * @param {String} type Type of object to search for.
 * @param {RoomPosition} from Starting position to search from
 * @param {structureFilterCallback} filter Filter function
 */
Utils.findNearest = (type, from, filter) => {

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
Utils.bodySort = (a, b) => {
  return BODY_VALUE[a] - BODY_VALUE[b];
};

/** @type {MoveToOpts} pathVis */
Utils.pathVis = {
  visualizePathStyle: {
    fill: 'transparent',
    stroke: '#fff',
    lineStyle: 'dashed',
    strokeWidth: .15,
    opacity: .1
  }
};

Utils.makePathVis = (opts) => {
  let v = {};
  for (let a in Utils.pathVis) {
    v[a] = Utils.pathVis[a];
  }
  for (let a in opts) {
    v[a] = opts[a];
  }
  /** @type {MoveToOpts} v */
  return v;
}

Utils.outline = function(obj, color) {
    if (obj !== undefined && obj.pos !== undefined && obj.room !== undefined) {
        new RoomVisual(obj.room.name).circle(obj.pos, { radius: 1, fill: 'transparent', stroke: color ? color : '#ffffff' });
    }
}

module.exports = Utils;