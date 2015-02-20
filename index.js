var fs = require('fs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var decode = require('ent/decode');

var recorder = require('./recorder');
var player = require('./player')(io);
var track = require('./track');

var isRecording = false;
var lastRecordedTrack = null;

function showNotification (message) {
  console.log('Spotifier: ' + message);
}

function getTrackFileName (trackData) {
  return decode('tracks/' + trackData.artist + ' - ' + trackData.name + '.mp3');
}

io.on('connection', function (socket) {
  showNotification('Browser extension connected.');

  socket.on('player-new-track', function (trackData) {

    // If we where recording before, stop and record new track.
    if (isRecording === true && lastRecordedTrack !== null) {
      showNotification('Stopped recording: ' + lastRecordedTrack.fileName);
      recorder.stop();
      isRecording = false;

      var oldTrack = lastRecordedTrack;

      // Get track information, download cover and write id3 data.
      track.getInfo(oldTrack.id, function (trackInfo) {
        var coverFileName =  decode(oldTrack.artist + ' - ' + oldTrack.name + '.png');

        console.log('Downloading cover for: ' + oldTrack.fileName);
        track.downloadCover(trackInfo.coverUrl, coverFileName, 'covers', function (error, coverFilePath) {

          console.log('Writing metadata and cover image for: ' + oldTrack.fileName);
          track.writeMetaData(trackInfo.name, trackInfo.artistName, trackInfo.albumName, trackInfo.trackNumber, oldTrack.fileName, coverFilePath, function (error) {

            showNotification('Finished song: ' + oldTrack.fileName);
          });
        });
      });
    }

    // Assign track file name
    var trackFileName = getTrackFileName(trackData);
    trackData.fileName = trackFileName;

    // Start recording
    recorder.start(trackFileName);
    showNotification('Started recording: ' + trackFileName);
    lastRecordedTrack = trackData;
    isRecording = true;
  });
});

http.listen(3000, function () {
  showNotification('Recorder started.');
});