// run a single bot game verbosely: node tools/one.js seedIndex weeks
process.env.V = '1';
process.argv = [process.argv[0], process.argv[1], '1', process.argv[3] || '260', process.argv[4] || 'saas', process.argv[5] || 'normal'];
