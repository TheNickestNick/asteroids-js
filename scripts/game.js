define(['./ship', './asteroid'], function(Ship, Asteroid) {
  function drawEach(arr, graphics) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].draw(graphics);
    }
  }

  function updateAndWrapEach(arr, w, h) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].update();
      arr[i].wrap(w, h);
    }
  }
  
  var Game = function(width, height) {
    this.width = width;
    this.height = height;
    this.ship = new Ship(width / 2, height / 2);
    this.bullets = [];
    this.time = 0;

    this.asteroids = [
      new Asteroid(50, 50, 1, 2)
    ];
  };

  Game.STEP_TIME_MS = 1000 / 30; // 30 fps

  Game.prototype.draw = function(graphics) {
    drawEach(this.asteroids, graphics);
    drawEach(this.bullets, graphics);

    this.ship.draw(graphics);
  };

  Game.prototype.start = function(startTime) {
    this.time = startTime;
  };

  // TODO: can we make the update process more generic?
  Game.prototype.step = function() {
    this.ship.update();
    this.ship.wrap(this.width, this.height);

    updateAndWrapEach(this.asteroids, this.width, this.height);
    updateAndWrapEach(this.bullets, this.width, this.height);

    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];

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
