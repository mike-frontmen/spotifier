var socket = io('http://localhost:3000');

function handleMessage (data) {
  if (data.type == 'recorder-start') {
    socket.emit('recorder-start', {
      name: data.name,
      artist: data.artist,
      length: data.length,
      uri: data.uri
    });
  } else if (data.type === 'recorder-stop') {
    socket.emit('recorder-stop');
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