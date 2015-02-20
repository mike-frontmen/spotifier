var socket = io('http://localhost:3000');

var playerTabId;

// If the tab gets closed.
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
  if (tabId === playerTabId) {
    socket.emit('closed'); 
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

socket.on('started-recording', function () {
  sendTabMessage('started-recording');
});

socket.on('stopped-recording', function () {
  sendTabMessage('stopped-recording');
});

function showPageAction () {
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

function handleMessage (data) {
  if (data.type == 'start-recording') {
    socket.emit('start-recording', data.trackId);
  } else if (data.type === 'stop-recording') {
    socket.emit('stop-recording', data.trackId);
  } else if (data.type === 'show-page-action') {
    showPageAction();
  }
}

chrome.extension.onMessage.addListener(handleMessage);