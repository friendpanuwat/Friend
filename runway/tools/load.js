// Loads the simulation core into Node (no DOM).
const path = require('path');
const FILES = [
  'core/util.js', 'core/ledger.js', 'core/data.js', 'core/team.js', 'core/founder.js',
  'core/funding.js', 'core/world.js', 'core/events.js', 'core/engine.js', 'core/actions.js',
  'models/saas.js', 'models/ecom.js', 'models/fnb.js'
];
module.exports = function load(extra) {
  for (const f of FILES.concat(extra || [])) require(path.join(__dirname, '..', 'src', f));
  return globalThis.RW;
};
module.exports.FILES = FILES;
