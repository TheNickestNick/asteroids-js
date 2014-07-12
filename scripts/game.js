define(['./ship'], function(Ship) {
  var Game = function(width, height) {
    this.width = width;
    this.height = height;
    this.ship = new Ship(width / 2, height / 2);
    this.bullets = [];
    this.time = 0;
  };

  Game.STEP_TIME_MS = 1000 / 30; // 30 fps

  Game.prototype.draw = function(graphics) {
    for (var i = 0; i < this.bullets.length; i++) {
      this.bullets[i].draw(graphics);
    }

    this.ship.draw(graphics);
  };

  Game.prototype.start = function(startTime) {
    this.time = startTime;
  };

  // TODO: can we make the update process more generic?
  Game.prototype.step = function() {
    this.ship.update();
    this.ship.wrap(this.width, this.height);

    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      b.update();
      b.wrap(this.width, this.height);

      if (b.shouldDie()) {
        b.free();
        this.bullets.splice(i, 1);
        i--;
      }
    }

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
    var bullet = this.ship.shoot();
    
    if (bullet) {
      this.bullets.push(bullet);
    }
  };

  return Game;
});
