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

var isRecording = false;

function onStartedRecording () {
  player.play();
  isRecording = true;
}

function onStoppedRecording () {
  isRecording = false;
}

function showPageAction () {
  chrome.extension.sendMessage({
    type: 'show-page-action'
  });
}

player.onReady(function () {
  showPageAction();

  player.onPlayingChange(function (isPlaying) {
    if (isPlaying === false) {
      return;
    }
    
    setTimeout(function () {
      if (isRecording === true) {
        return;
      }

      player.pause();
      player.previous();

      chrome.extension.sendMessage({
        type: 'start-recording',
        trackId: player.getTrackId()
      });
    }, 10000);
  });

  player.onNewTrack(function () {
    chrome.extension.sendMessage({
      type: 'stop-recording',
      trackId: player.getTrackId()
    });
  });
});