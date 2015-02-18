(function () {

  var isPlaying = false;

  function activate () {
    chrome.extension.sendMessage({
      type: 'activate'
    });
  }

  function stopRecording () {
    chrome.extension.sendMessage({
      type: 'recorder-stop'
    });
  }

  function startRecording (name, artist, length, uri) {
    chrome.extension.sendMessage({
      type: 'recorder-start',
      name: name,
      artist: artist,
      length: length,
      uri: uri
    });
  }

  activate();

  // function playTrack (trackName, trackArtist) {
  //   isPlaying = !isPlaying;

  //   if (isPlaying) {

  //   } else {
  //     chrome.extension.sendMessage({
  //       type: 'player-stop'
  //     });
  //   }
  // }
  
  var INTERVAL_SPEED = 100;

  var $playPauseBtn = $('#play-pause');
  var $trackLength = $('#track-length');
  var isPlaying = false;
  var currentTrackName = '';
  
  function getCurrentTrackLength () {
    return $('#track-length').html();
  }

  function getCurrentTrackName () {
    return $('#track-name a').html();
  }

  function getCurrentTrackArtist () {
    return $('#track-artist a').html();
  }

  function getCurrentTrackUri () {
    return $('#cover-art a').attr('data-itemuri');
  }

  function getCurrentTrackInfo () {
    var name = getCurrentTrackName();
    var artist = getCurrentTrackArtist();
    var length = getCurrentTrackLength();
    var uri = getCurrentTrackUri();

    return {
      name: name,
      artist: artist,
      length: length,
      uri: uri
    }
  };

  function onPlayingChange () {
    if (isPlaying) {
      stopRecording();
      var newTrackInfo = getCurrentTrackInfo();
      startRecording(newTrackInfo.name, newTrackInfo.artist, newTrackInfo.length, newTrackInfo.uri);
    } else {
      stopRecording();
    }
  }

  setInterval(function () {
    var hasPlayingClass = $playPauseBtn.hasClass('playing');

    // If the player wasn't playing before, but is now playing a track (a new track)
    if (isPlaying === false && hasPlayingClass === true) {
      isPlaying = true;
      onPlayingChange();
      currentTrackName = getCurrentTrackName();
      listenForTrackNameChanges();

    // If the player is playing a track, but it is now stopped playing (playing stopped)
    } else if (isPlaying === true && hasPlayingClass === false) {
      isPlaying = false;
      onPlayingChange();
      stopListeningForTrackNameChanges();
    }
  }, INTERVAL_SPEED);

  var trackNameListener = null;

  function listenForTrackNameChanges () {
    trackNameListener = setInterval(function () {
      var newTrackName = getCurrentTrackName();

      if (newTrackName !== currentTrackName) {
        currentTrackName = getCurrentTrackName();
        stopRecording();
        var newTrackInfo = getCurrentTrackInfo();
        startRecording(newTrackInfo.name, newTrackInfo.artist, newTrackInfo.length, newTrackInfo.uri);
      }
    });
  }

  function stopListeningForTrackNameChanges () {
    clearInterval(trackNameListener);
  }

  // var lastLength = null;

  // function onTrackChange () {
  //   stopRecording();
  //   var newTrackInfo = getCurrentTrackInfo();
  //   startRecording(newTrackInfo.name, newTrackInfo.artist, newTrackInfo.length, newTrackInfo.uri);
  // }

  // setInterval(function () {
  //   var currentLength = getCurrentTrackLength();

  //   if (lastLength !== currentLength) {
  //     lastLength = currentLength;
  //     onTrackChange();
  //   }
  // }, INTERVAL_SPEED);

})();