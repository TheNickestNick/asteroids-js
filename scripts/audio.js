define(['./debug'], function(debug) {
  var paths = {
    shoot: 'assets/shoot.wav',
    shoot2: 'assets/shoot2.wav',
    crash: 'assets/crash.wav',
    bonus: 'assets/bonus.wav',
    bonus2: 'assets/bonus2.wav',
    missile: 'assets/missile.wav'
  };

  function loadSound(context, name, url, callback) {
    console.log('Audio: Loading ' + url);
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.responseType = 'arraybuffer';
    req.onerror = function() {
      console.log('Audio: Error loading ' + url);
      callback(false);
    };
    req.onload = function() {
      context.decodeAudioData(req.response, function(buffer) {
        console.log('Audio: Loaded ' + url);
        audio.sounds[name] = buffer;
        callback(true); 
      }, function() {
        console.log('Audio: Error decoding' + url);
        callback(false);
      });
    }
    req.send();
  }

  var audio = {
    init: function(callback) {
      var AC = window.AudioContext || window.webkitAudioContext;
      this.context = new AC();
      this.muted = false;

      var outstanding = 0;
      for (var k in paths) {
        outstanding++;
        loadSound(this.context, k, paths[k], function() {
          outstanding--;

          if (outstanding == 0) {
            callback();
          }
        });
      }

      if (outstanding == 0) {
        callback();
      }
    },

    mute: function(shouldMute) {
      this.muted = typeof shouldMute === 'boolean' ? !!shouldMute : true;
    },

    play: function(buffer, offset) {
      if (this.muted) {
        return;
      }

      // TODO: should we be caching these instead of (or in addition to?) buffers?
      var source = this.context.createBufferSource();
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start(0, offset || 0); 
    },

    sounds: {}
  };

  debug.define('mute', function(m) {
    audio.mute(m);
  });

  return audio;
});
