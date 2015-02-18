var socket = io('http://localhost:3000');

function onPlayerNewTrack (track) {
  socket.emit('player-new-track', track);
}

function handleMessage (data) {
  if (data.type == 'player-new-track') {
    onPlayerNewTrack(data.track);
  } else if (data.type === 'activate') {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function (tabs) {
      var tab = tabs[0];
      var url = tab.url;
      chrome.pageAction.show(tab.id);
    });
  }
}

chrome.extension.onMessage.addListener(handleMessage);