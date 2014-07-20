define(function() {
  var Timer = function(callback, duration) {
    this.callback = callback;
    this.duration = duration || 0;
    this.ticks = -1;
    this.running = false;
  };

  Timer.prototype.start = function(duration) {
    this.duration = duration || this.duration;
    this.ticks = this.duration;
    this.running = true;
  };

  Timer.prototype.tick = function() {
    if (!this.running) {
      return;
    }

    this.ticks--;

    if (this.ticks === 0) {
      this.callback();
    }
  };
});
