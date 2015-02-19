var exec = require('child_process').exec;
var rec = null;

exports.start = function (fileName, callback) {
  var cmd = 'rec -C 320 -q -t mp3 "' + fileName + '"';
  rec = exec(cmd, callback);
};

exports.stop = function () {
  if (rec !== null) {
    rec.kill();
  }
};