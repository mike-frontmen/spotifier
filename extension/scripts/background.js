var socket = io('http://localhost:3000');

var playerTabId;

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  if (tabId === playerTabId) {
    socket.emit('player-closed'); 
  }
});

function sendTabMessage (messageType) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabs) {
    var tab = tabs[0];
    var url = tab.url;

    chrome.tabs.sendMessage(tab.id, {
      type: messageType
    });
  });
}

socket.on('player-play-pause', function() {
  sendTabMessage('player-play-pause');
});

socket.on('player-next', function() {
  sendTabMessage('player-next');
});

socket.on('player-prev', function () {
  sendTabMessage('player-prev');
});

function onPlayerNewTrack (track) {
  socket.emit('player-new-track', track);
}

function onPlayerPause (track) {
  socket.emit('player-pause', track);
}

function handleMessage (data) {
  if (data.type == 'player-new-track') {
    onPlayerNewTrack(data.track);
  } else if (data.type === 'player-pause') {
    onPlayerPause(data.track);
  } else if (data.type === 'activate') {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, function (tabs) {
      var tab = tabs[0];
      var url = tab.url;
      playerTabId = tab.id;
      chrome.pageAction.show(tab.id);
    });
  }
}

chrome.extension.onMessage.addListener(handleMessage);