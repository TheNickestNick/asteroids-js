define(['./ship'], function(Ship) {
  var Game = function(width, height) {
    this.width = width;
    this.height = height;
    this.ship = new Ship(width / 2, height / 2);
    this.time = 0;
  };

  Game.STEP_TIME_MS = 1000 / 30; // 30 fps

  Game.prototype.draw = function(graphics) {
    this.ship.draw(graphics);
  };

  Game.prototype.start = function(startTime) {
    this.time = startTime;
  };

  Game.prototype.step = function() {
    this.ship.update();
    this.ship.wrap(this.width, this.height);
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

  Game.prototype.shoot = function() {
  };

  return Game;
});
