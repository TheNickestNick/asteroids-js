define(['./ship', './asteroid', './quadtree'], function(Ship, Asteroid, Quadtree) {
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

    this.asteroids = [];

    this.quadtree = new Quadtree(0, 0, width, height, 2);
  };

  Game.STEP_TIME_MS = 1000 / 30; // 30 fps

  Game.prototype.draw = function(graphics) {
    if (window.debug_draw_quadtree) {
      this.quadtree.draw(graphics);
    }

    drawEach(this.asteroids, graphics);
    drawEach(this.bullets, graphics);
    this.ship.draw(graphics);
  };

  Game.prototype.start = function(startTime) {
    this.time = startTime;

    for (var i = 0; i < 10; i++) {
      this.asteroids.push(
        new Asteroid(Math.random() * this.width, Math.random() * this.height,
          Math.random(), Math.random()));
    }
  };

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

    this.quadtree.clear();
    this.quadtree.add(this.ship);

    // TODO: we need a way to track objects and update which leaf they are in,
    // instead of building a new quadtree each frame.
    for (var i = 0; i < this.asteroids.length; i++) {
      this.quadtree.add(this.asteroids[i]);
    }


    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      var isec = this.quadtree.findFirstIsecWithPoint(b.x, b.y);
      
      if (isec && isec.constructor == Asteroid) {
        console.log('BAM!');
      }
    }


    // TODO: add a way to single-step from the console
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
