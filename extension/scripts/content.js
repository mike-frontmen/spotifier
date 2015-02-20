chrome.extension.onMessage.addListener(function (data) {
  var type = data.type;

  if (type == 'play-pause') {
    player.pressPlayPauseBtn();
  } else if (type === 'next') {
    player.pressNextBtn();
  } else if (type === 'prev') {
    player.pressPrevBtn();
  } else if (type === 'started-recording') {
    onStartedRecording();
  } else if (type === 'stopped-recording') {
    onStoppedRecording();
  }
});

// Gets triggered when the recorder is actually recording...
function onStartedRecording () {
  // Continue playing.
  player.pressPlayPauseBtn();
}

function onStoppedRecording () {
  console.log('should stop now!');

  setTimeout(function () {
    player.pressPlayPauseBtn();
  }, 400);
}

function showPageAction () {
  chrome.extension.sendMessage({
    type: 'show-page-action'
  });
}

var firstTime = true;

player.onReady(function () {
  showPageAction();

  player.onPlayPauseBtnChange(function (isPlaying, firstPlay) {
    if (firstPlay) {

      // Pause the track.
      player.pressPlayPauseBtn();

      // Make the recorder start recording, 
      // the extension receives 'started-recording' when
      // it is recording audio. (onStartedRecording)
      chrome.extension.sendMessage({
        type: 'start-recording',
        trackId: player.getTrackId()
      });
    }
  });

  player.onNewTrack(function () {
    if (firstTime === true) {
      firstTime = false;
      return;
    }

    player.pressPlayPauseBtn();

    // // Make the recorder stop recording
    // // the extension receives 'stopped-recording' when
    // // it is finished with the track. (onStoppedRecording)
    chrome.extension.sendMessage({
      type: 'stop-recording',
      trackId: player.getTrackId()
    });
  });
});