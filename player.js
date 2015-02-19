module.exports = function (io) {
  return {
    playPause: function () {
      io.emit('player-play-pause');
    },
    prev: function () {
      io.emit('player-prev');
    },
    next: function () {
      io.emit('player-next');
    }
  }
}