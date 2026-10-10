// Ordered source list shared by the dev page and the bundler.
module.exports = {
  core: ['core/util.js', 'core/ledger.js', 'core/data.js', 'core/team.js', 'core/founder.js', 'core/funding.js', 'core/world.js', 'core/events.js', 'core/engine.js', 'core/actions.js'],
  models: ['models/saas.js'],
  ui: ['ui/core.js', 'ui/screens_a.js', 'ui/screens_b.js'],
  modelUI: ['models/saas_ui.js'],
  boot: ['ui/boot.js'],
  css: ['ui/styles.css']
};
