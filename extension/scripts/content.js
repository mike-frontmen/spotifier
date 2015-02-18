(function () {

  var $appPlayer = $('#app-player');
  var $playPauseBtn = $('#play-pause');
  var $prevBtn = $('#previous');
  var $nextBtn = $('#next');
  var $trackLength = $('#track-length');
  var isPlaying = false;
  var currentTrackName = null;

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

  function pressPlayBtn () {
    $playPauseBtn[0].click();
  }

  function pressPrevBtn () {
    $prevBtn[0].click();
  }

  function pressNextBtn () {
    $nextBtn[0].click();
  }

  function getCurrentTrack () {
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

  function showMessage (message) {
    console.log('Spotifier: ' + message);
  }

  function activate () {
    showMessage('initialized. Listening for user interactions.');
    chrome.extension.sendMessage({
      type: 'activate'
    });
  }

  function onPlayerStartPlaying () {
    startListeningForNewTrack();
  }

  function onPlayerStopPlaying () {
    stopListeningForNewTrack();
  }

  function onPlayerNewTrack () {
    showMessage('new track detected.');
    chrome.extension.sendMessage({
      type: 'player-new-track',
      track: getCurrentTrack()
    });
  }

  var newTrackListener = null;

  function startListeningForNewTrack () {
    newTrackListener = setInterval(function () {
      var newTrackName = getCurrentTrackName();
      
      if (currentTrackName !== newTrackName) {
        currentTrackName = newTrackName;
        onPlayerNewTrack();
      }
    }, 100);
  }

  function stopListeningForNewTrack () {
    clearInterval(newTrackListener);
  }

  function startListeningToPlayButtonState () {
    setInterval(function () {
      var hasPlayingClass = $playPauseBtn.hasClass('playing');

      // If the player wasn't playing before, but is now playing a track.
      if (isPlaying === false && hasPlayingClass === true) {
        isPlaying = true;
        onPlayerStartPlaying();

      // If the player was playing before, but it has stopped.
      } else if (isPlaying === true && hasPlayingClass == false) {
        isPlaying = false;
        onPlayerStopPlaying();
      }
    }, 100);
  }

  function initialize () {
    activate();
    startListeningToPlayButtonState();
  }

  function appPlayerReadyWatcher () {
    if ($playPauseBtn.visible()) {
      setTimeout(function () {
        initialize();
      }, 4000);

      clearInterval(appPlayerLoadWatcher);
    }
  }

  var appPlayerLoadWatcher = setInterval(appPlayerReadyWatcher);
})();