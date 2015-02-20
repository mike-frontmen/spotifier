chrome.extension.onMessage.addListener(function (data) {
  var type = data.type;

  if (type == 'player-play-pause') {
    player.pressPlayPauseBtn();
  } else if (type === 'player-next') {
    player.pressNextBtn();
  } else if (type === 'player-prev') {
    player.pressPrevBtn();
  } else if (type === 'player-continue-recording') {
    var currentTime = player.getTrackCurrentTime();

    if (currentTime !== '0:00') {
      player.pressPrevBtn();
    }

    player.pressPlayPauseBtn();
  }
});

function activate () {
  chrome.extension.sendMessage({
    type: 'activate'
  });
}

player.onReady(function () {
  activate();

  player.onPlayPauseBtnChange(function (isPlaying, firstPlay) {
    if (firstPlay) {
      player.pressPlayPauseBtn();
      // player.pressPrevBtn();

      chrome.extension.sendMessage({
        type: 'player-start-recording',
        trackId: player.getTrackId()
      });
    }
  });

  player.onNewTrack(function () {
    player.pressPlayPauseBtn();

    chrome.extension.sendMessage({
      type: 'player-stop-recording',
      trackId: player.getTrackId()
    });
  });
});