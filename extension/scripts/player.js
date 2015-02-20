var player = {
  $playPauseBtn: $('#play-pause'),
  $prevBtn: $('#previous'),
  $nextBtn: $('#next'),
  $trackLength: $('#track-length'),
  $trackCurrentTime: $('#track-current'),
  isPlaying: false,
  trackName: null,
  firstPlay: true,
  firstNewTrack: true,
  getTrackName: function () {
    return $('#track-name a').html();
  },
  getTrackLength: function () {
    return this.$trackLength.html();
  },
  getTrackCurrentTime: function () {
    return this.$trackCurrentTime.html();
  },
  getTrackId: function () {
    var uri = $('#cover-art a').attr('data-itemuri');
    return uri.replace('spotify:track:', '');
  },
  pressPlayPauseBtn: function () {
    this.$playPauseBtn[0].click();
  },
  pressPrevBtn: function () {
    this.$prevBtn[0].click();
  },
  pressNextBtn: function () {
    this.$nextBtn[0].click();
  },
  onPlayPauseBtnChange: function (callback) {
    var self = this;

    setInterval(function () {
      var hasPlayingClass = self.$playPauseBtn.hasClass('playing');

      if (self.isPlaying === false && hasPlayingClass === true) {
        self.isPlaying = true;

        if (self.firstPlay === true) {
          self.firstPlay = false;
          callback(true, true);
        } else {
          callback(true, false);
        }
      } else if (self.isPlaying === true && hasPlayingClass == false) {
        self.isPlaying = false;
        callback(false, false);
      }
    }, 16);
  },
  onNewTrack: function (callback) {
    var self = this;

    setInterval(function () {

      // If we aren't playing, there can't be a new track.
      if (self.isPlaying === false) {
        return;
      }

      var newTrackName = self.getTrackName();

      if (self.currentTrackName !== newTrackName) {
        self.currentTrackName = newTrackName;
        callback();
      }
    }, 16);
  },
  onReady: function (callback) {
    var self = this;
    var onReadyWatcherInterval = setInterval(onReadyWatcher)

    function onReadyWatcher () {
      if (self.$playPauseBtn.visible()) {
        setTimeout(function () {
          callback();
        }, 4000);

        clearInterval(onReadyWatcherInterval);
      }
    }
  }
};