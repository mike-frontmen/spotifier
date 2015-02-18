var process = require('child_process');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ent = require('ent');
var decode = require('ent/decode');

var recorder = null;

function showMessage (msg) {
  console.log('Spotifier: ' + msg);
}

function createFileName (track) {
  return decode('tracks/' + track.name + ' - ' + track.artist + '.mp3');
}

function getProcessCmd (fileName) {
  return 'rec -C 320 -t mp3 "' + fileName + '"';
}

function startRecord (track) {
  var fileName = createFileName(track);
  var processCmd = getProcessCmd(fileName);

  showMessage('now recording: ' + fileName);
  recorder = process.exec(processCmd);
}

function stopRecord () {
  if (recorder !== null) {
    recorder.kill();
  }
}

io.on('connection', function (socket) {
  showMessage('user connected.');

  socket.on('player-new-track', function (track) {
    startRecord(track);
  });
});

http.listen(3000, function () {
  showMessage('server started.');
});
