var process = require('child_process');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var currentTrack = null;
var recorder;
var history = [];

function addTrackToHistory (track) {
  history.push(track.uri);
}

function isTrackInHistory (track) {
  var index = history.indexOf(track.uri);

  if (index === -1) {
    return false;
  } else {
    return true;
  }
}

function createFileName (track) {
  return 'tracks/' + track.name + ' - ' + track.artist + '.mp3';
}

function record (track) {
  if (isTrackInHistory(track)) {
    return;
  }

  addTrackToHistory(track.uri);

  var fileName = createFileName(track);
  console.log('recording file: ' + fileName);  
  recorder = process.exec('rec -C 320 -t mp3 "' + fileName + '"');
}

function stopRecording () {
  if (recorder !== undefined) {
    recorder.kill();
  }
}

io.on('connection', function (socket) {
  console.log('user connected to spotifier.');

  socket.on('recorder-start', function (track) {
    record(track);
  });

  socket.on('recorder-stop', function (data) {
    stopRecording();
  });
});

http.listen(3000, function () {
  console.log('spotifier server started.');
});

