define(['./ship'], function(Ship) {
  var Game = function() {
    this.ship = new Ship();
    this.time = 0;
  };

  Game.STEP_TIME_MS = 50; // 20 fps

  Game.prototype.draw = function(graphics) {
    this.ship.draw(graphics);
  };

  Game.prototype.start = function(startTime) {
    this.time = startTime;
  };

  Game.prototype.step = function() {
    this.ship.update();
    this.time += Game.STEP_TIME_MS;
  };
  
  Game.prototype.runUntil = function(time) {
    while (this.time + Game.STEP_TIME_MS < time) {
      this.step();
    }
  };

  Game.prototype.started = function() {
    return this.time != 0;
  };

  return Game;
});
