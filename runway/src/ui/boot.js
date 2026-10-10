/* RUNWAY — boot (supports live-update snapshots when hosted as an artifact) */
(function (RW) {
  'use strict';
  var hot = window.claude && window.claude.hot;
  function start(data) { RW.UI.boot(data || {}); }
  if (hot && hot.snapshot) {
    try { hot.snapshot(function () { return { state: RW.UI.s, tab: RW.UI.tab }; }); } catch (e) { }
  }
  if (hot && hot.ready) hot.ready(start); else start(hot && hot.data ? hot.data : {});
})(globalThis.RW);
