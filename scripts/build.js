var exec = require('child_process').exec;
var package = require('../package.json');

var COMMAND_PREFIX = 'rm -fr pkg; mkdir pkg; zip -r';

var target = ' pkg/' + package.name + '_' + package.version +'.zip';
var main = ' index.js config.json lib';

for (var mod in package.dependencies) {
  main = main + ' node_modules/' + mod;
}

exec(COMMAND_PREFIX + target + main, function (error, stdout, stderr) {
  if (stdout)
  {
    console.log('stdout: ' + stdout);
  }
  if (stderr)
  {
    console.log('stderr: ' + stderr);
  }
  if (error !== null)
  {
    console.log('error: ' + error);
  }
});
