var path = require('path');
var request = require('superagent');
var id3 = require('id3-writer');
var Download = require('download');

var writer = new id3.Writer();


exports.writeMetaData = function (name, artistName, albumName, trackNumber, fileName, coverFileName, callback) {
  fileName = path.resolve(fileName);

  var file = new id3.File('/' + fileName);
  var coverImage = new id3.Image(coverFileName);
  var metaData = new id3.Meta({
    title: name,
    artist: artistName,
    album: albumName,
    track: trackNumber
  }, [coverImage]);

  writer.setFile(file).write(metaData, function (error) {
    if (error) {
      return callback(error);
    }

    callback();
  });
};

exports.getInfo = function (trackId, callback) {
  var url = 'https://api.spotify.com/v1/tracks/' + trackId;

  request.get(url, function (res) {
    var info = JSON.parse(res.text);

    callback({
      name: info.name,
      artistName: info.artists[0].name,
      albumName: info.album.name,
      coverUrl: info.album.images[1].url, // 300x300 image
      trackNumber: info.track_number,
      discNumber: info.disc_number,
      durationMs: info.duration_ms
    })
  });
};

exports.downloadCover = function (coverUrl, fileName, destDir, callback) {
  var download = new Download()
    .get(coverUrl)
    .rename(fileName)
    .dest(destDir);

  download.run(function (error, files) {
    if (error) {
      return callback(error);
    }

    callback(null, files[0].path);
  });
};