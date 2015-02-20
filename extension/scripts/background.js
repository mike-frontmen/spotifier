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

socket.on('player-continue-recording', function () {
  sendTabMessage('player-continue-recording');
});

function handleMessage (data) {
  if (data.type == 'player-start-recording') {
    socket.emit('player-start-recording', data.trackId);
  } else if (data.type === 'player-stop-recording') {
    socket.emit('player-stop-recording', data.trackId);
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