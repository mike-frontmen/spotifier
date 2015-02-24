var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var decode = require('ent/decode');
var del = require('del');
var open = require('open');
var moment = require('moment');

var recorder = require('./recorder');
var player = require('./player')(io);
var track = require('./track');

var isRecording = false;
var lastRecordedTrack = null;

function showNotification (message) {
  console.log('Spotifier: ' + message);
}

function onPlayerStartRecording (trackId) {
  track.getInfo(trackId, function (info) {
    var fileName = info.artistName + ' - ' + info.name + '.mp3';
    lastRecordedTrack = info;
    lastRecordedTrack.fileName = fileName;
    
    showNotification('Recording: ' + info.name + ' by ' + info.artistName);
    recorder.start('recordings/' + fileName);

    io.emit('started-recording');
  });
}

function onPlayerStopRecording (trackId) {
  if (lastRecordedTrack === null) {
    return;
  }
  
  var lastTrack = lastRecordedTrack;
  recorder.stop();
  showNotification('Finished: ' + lastTrack.name + ' by ' + lastTrack.artistName);
  io.emit('stopped-recording');
}

io.on('connection', function (socket) {
  showNotification('Browser extension connected.');
  socket.on('start-recording', onPlayerStartRecording);
  socket.on('stop-recording', onPlayerStopRecording);
});

http.listen(3000, function () {
  showNotification('Recorder started.');
});