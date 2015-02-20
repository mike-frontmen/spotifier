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

// function onPlayerNewTrack (trackData) {

//   player.playPause();
//   player.prev();

//   var duration = moment(trackData.length, 'm:ss');
//   var durationMs = duration.millisecond();

//   console.log(durationMs);

//   // If we where recording before, stop and record new track.
//   if (isRecording === true && lastRecordedTrack !== null) {
//     showNotification('Stopped recording: ' + lastRecordedTrack.fileName);
//     recorder.stop();
//     isRecording = false;

//     var oldTrack = lastRecordedTrack;

//     // Get track information, download cover and write id3 data.
//     track.getInfo(oldTrack.id, function (trackInfo) {
//       var coverFileName =  decode(oldTrack.artist + ' - ' + oldTrack.name + '.png');

//       console.log('Downloading cover for: ' + oldTrack.fileName);
//       track.downloadCover(trackInfo.coverUrl, coverFileName, 'covers', function (error, coverFilePath) {

//         console.log('Writing metadata and cover image for: ' + oldTrack.fileName);
//         track.writeMetaData(trackInfo.name, trackInfo.artistName, trackInfo.albumName, trackInfo.trackNumber, oldTrack.fileName, coverFilePath, function (error) {
//           showNotification('Finished song: ' + oldTrack.fileName);
//         });
//       });
//     });
//   }

//   // Assign track file name
//   var trackFileName = decode('tracks/' + trackData.artist + ' - ' + trackData.name + '.mp3');
//   trackData.fileName = trackFileName;

//   // Start recording
//   recorder.start(trackFileName);
//   showNotification('Started recording: ' + trackFileName);
//   lastRecordedTrack = trackData;
//   isRecording = true;
// }

// function deleteTrackFile (trackFileName, callback) {
//   del([trackFileName], callback);
// };

// function onDisconnect () {
//   showNotification('Browser extension disconnected.');

//   if (isRecording === true && lastRecordedTrack !== null) {
//     showNotification('Removing incomplete track recording: ' + lastRecordedTrack.fileName);
//     recorder.stop();
//     isRecording = false;

//     deleteTrackFile(lastRecordedTrack.fileName, function (error, files) {
//       showNotification('Removed: ' + lastRecordedTrack.fileName);
//     });
//   }
// }

// function onPlayerPause () {
//   showNotification('Player got paused.');
// }


//   var trackFileName = decode('tracks/' + trackData.artist + ' - ' + trackData.name + '.mp3');
//   trackData.fileName = trackFileName;

//   // Start recording
//   recorder.start(trackFileName);
//   showNotification('Started recording: ' + trackFileName);
//   lastRecordedTrack = trackData;
//   isRecording = true;
  // track.getInfo(track)

//     // Get track information, download cover and write id3 data.
//     track.getInfo(oldTrack.id, function (trackInfo) {
//       var coverFileName =  decode(oldTrack.artist + ' - ' + oldTrack.name + '.png');

//       console.log('Downloading cover for: ' + oldTrack.fileName);
//       track.downloadCover(trackInfo.coverUrl, coverFileName, 'covers', function (error, coverFilePath) {

//         console.log('Writing metadata and cover image for: ' + oldTrack.fileName);
//         track.writeMetaData(trackInfo.name, trackInfo.artistName, trackInfo.albumName, trackInfo.trackNumber, oldTrack.fileName, coverFilePath, function (error) {
//           showNotification('Finished song: ' + oldTrack.fileName);
//         });
//       });
//     });

function onPlayerStartRecording (trackId) {
  track.getInfo(trackId, function (info) {
    var fileName = 'recordings/' + info.artistName + ' - ' + info.name + '.mp3';

    showNotification('Recording: ' + fileName);
    recorder.start(fileName);

    io.emit('player-continue-recording');
  });
}

function onPlayerStopRecording (trackId) {
  recorder.stop();

  io.emit('player-stopped-recording');

  // // Get track information, download cover and write id3 data.
  // track.getInfo(oldTrack.id, function (trackInfo) {
  //   var coverFileName =  decode(oldTrack.artist + ' - ' + oldTrack.name + '.png');

  //   console.log('Downloading cover for: ' + oldTrack.fileName);
  //   track.downloadCover(trackInfo.coverUrl, coverFileName, 'covers', function (error, coverFilePath) {

  //     console.log('Writing metadata and cover image for: ' + oldTrack.fileName);
  //     track.writeMetaData(trackInfo.name, trackInfo.artistName, trackInfo.albumName, trackInfo.trackNumber, oldTrack.fileName, coverFilePath, function (error) {
  //       showNotification('Finished song: ' + oldTrack.fileName);
  //     });
  //   });
  // });
}

io.on('connection', function (socket) {
  showNotification('Browser extension connected.');
  socket.on('player-start-recording', onPlayerStartRecording);
  socket.on('player-stop-recording', onPlayerStopRecording);
});

http.listen(3000, function () {
  showNotification('Recorder started.');
});