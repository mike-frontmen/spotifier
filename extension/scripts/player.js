function getPlayPauseBtn () {
  return $('body').find('#play-pause');
}

function getNextBtn () {
  return $('body').find('#next');
}

function getPreviousBtn () {
  return $('body').find('#previous');
}

function getTrackLength () {
  return $('body').find('#track-length').html();
}

function getCurrentTime () {
  return $('body').find('#track-current').html();
}

function getTrackId () {
  var uri = $('body').find('#cover-art a').attr('data-itemuri');
  return uri.replace('spotify:track:', '');
}

function getTrackName () {
  return $('body').find('#track-name a').html();
}

function isPlaying () {
  var $btn = getPlayPauseBtn();
  return $btn.hasClass('playing');
}

function play () {
  var $btn = getPlayPauseBtn();

  if (isPlaying() === true) {
    return;
  }

  $btn.trigger('click');
}

function pause () {
  var $btn = getPlayPauseBtn();

  if (isPlaying() === false) {
    return;
  }

  $btn.trigger('click');
}

function previous () {
  return getPreviousBtn().trigger('click');
}

function next () {
  return getNextBtn().trigger('click');
}

function onPlayingChange (callback) {
  var self = this;
  var lastCheckPlaying = isPlaying();

  setInterval(function () {
    var currentPlayingStatus = isPlaying();

    if (lastCheckPlaying !== currentPlayingStatus) {
      lastCheckPlaying = currentPlayingStatus;
      callback(currentPlayingStatus);
    }
  }, 50);
}

function onTrackTime (time, callback) {
  var self = this;
  var interval = setInterval(onTrackTimeInterval, 100);

  function onTrackTimeInterval () {
    var currentTime = getCurrentTime();

    if (time === currentTime) {
      clearInterval(interval);
      return callback();
    }
  }
}

function onReady (callback) {
  var self = this;
  var interval = setInterval(onReadyInterval, 100);

  function onReadyInterval () {
    if (getPlayPauseBtn().visible()) {

      setTimeout(function () {
        callback();
      }, 4000);

      clearInterval(interval);
    }
  }
}

function onNewTrack (callback) {
  var self = this;
  var lastTrackName = getTrackName();

  setInterval(function () {
    if (isPlaying() === true) {
      var newTrackName = getTrackName();

      if (newTrackName !== lastTrackName) {
        lastTrackName = newTrackName;
        callback();
      }
    }
  }, 100);
}

var player = {
  onReady: onReady,
  onTrackTime: onTrackTime,
  onPlayingChange: onPlayingChange,
  onNewTrack: onNewTrack,
  getTrackId: getTrackId,
  play: play,
  pause: pause,
  previous: previous,
  next: next
};