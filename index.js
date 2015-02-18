var process = require('child_process');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var decode = require('ent/decode');
var request = require('superagent');
var id3 = require('id3-writer');
var Download = require('download');

var writer = new id3.Writer();

var recorder = null;
var currentTrack = null;

function showMessage (msg) {
  console.log('Spotifier: ' + msg);
}

function getTrackId (track) {
  return track.uri.replace('spotify:track:', '');
}

function writeId3Data (track, fileName, coverFileName, callback) {
  var file = new id3.File(fileName);
  var coverImage = new id3.Image(coverFileName);

  var meta = new id3.Meta({
    artist: track.info.artistName,
    title: track.info.name,
    album: track.info.albumName,
    track: track.info.trackNumber
  }, [coverImage])

  writer.setFile(file).write(meta, function (error) {
    if (error) {
      return callback(error);
    }

    callback();
  });
}

function getTrackCover (track, callback) {
  var download = new Download()
    .get(track.info.coverUrl)
    .rename(decode(track.name + ' - ' + track.artist + '.png'))
    .dest('covers');

  download.run(function (error, files) {
    if (error) {
      return callback(error);
    }

    var file = files[0].path;

    callback(null, file);
  });
}

function getTrackInfo (track, callback) {
  var requestUrl = 'https://api.spotify.com/v1/tracks/' + track.id;

  request.get(requestUrl, function (res) {
    var info = JSON.parse(res.text);
    var album = info.album
    var albumType = album.album_type;
    var images = album.images;
    var albumName = album.name;
    var artists = info.artists[0];
    var artistName = artists.name;
    var discNumber = info.disc_number;
    var durationMs = info.duration_ms;
    var explicit = info.explicit;
    var name = info.name;
    var trackNumber = info.track_number;

    // 300 x 300 image (which is the default for id3 tags)
    var coverUrl = images[1].url;

    callback({
      albumType: albumType,
      albumName: albumName,
      artistName: artistName,
      discNumber: discNumber,
      durationMs: durationMs,
      name: name,
      trackNumber: trackNumber,
      coverUrl: coverUrl
    });
  });
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
  currentTrack = track;
}

function onFinishedRecording () {
  var track = currentTrack;
  var fileName = createFileName(track);

  getTrackInfo(track, function (info) {
    track.info = info;

    getTrackCover(track, function (error, coverFileName) {
      writeId3Data(track, fileName, coverFileName, function (error) {
        console.log(error);
      });
    });
  });
}

function stopRecord () {
  if (recorder !== null) {
    recorder.kill();
    onFinishedRecording();
  }
}

function playerPlayPause () {
  io.emit('player-play-pause');
}

function playerPrev () {
  io.emit('player-prev');
}

function playerNext () {
  io.emit('player-next');
}

io.on('connection', function (socket) {
  showMessage('user connected.');

  socket.on('player-new-track', function (track) {
    stopRecord();
    startRecord(track);

    setTimeout(function () {
      playerPlayPause();
      console.log('pause');

      setTimeout(function () {
        playerPlayPause();
        console.log('pause');

        setTimeout(function () {
          playerNext();

          setTimeout(function () {
            playerPrev();
          }, 5000);
        }, 5000);
      }, 3000);
    }, 2000);
  });
});

http.listen(3000, function () {
  showMessage('server started.');
});
