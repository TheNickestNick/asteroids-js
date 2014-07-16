define(['./ship', './asteroid', './quadtree', './meshes'], function(Ship, Asteroid, Quadtree, meshes) {
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
    this.points = 0;
    this.lives = 2;

    this.asteroids = [];

    this.quadtree = new Quadtree(0, 0, width, height, 3);
  };

  Game.STEP_TIME_MS = 1000 / 30; // 30 fps

  Game.prototype.draw = function(graphics) {
    if (window.debug_draw_quadtree) {
      this.quadtree.draw(graphics);
    }

    drawEach(this.asteroids, graphics);
    drawEach(this.bullets, graphics);
    this.ship.draw(graphics);

    this.drawHud(graphics);
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
      var hit = this.quadtree.findFirstIsecWithPoint(b.x, b.y);
      
      if (hit && hit.constructor == Asteroid) {
        hit.die();
        b.free();
        this.bullets.splice(i, 1);
        i--;

        this.points += 100;
        // TODO: move this into the asteroid class so that we can have different behaviors.
        if (hit.size > 1) {
          this.asteroids.push(new Asteroid(hit.x, hit.y, Math.random(), Math.random(), hit.size-1));
          this.asteroids.push(new Asteroid(hit.x, hit.y, Math.random(), Math.random(), hit.size-1));
        }
      }
    }

    for (var i = 0; i < this.asteroids.length; i++) {
      if (this.asteroids[i].dead) {
        this.asteroids.splice(i, 1);
        i--;
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

  Game.prototype.drawHud = function(graphics) {
    var ctx = graphics.context();
    ctx.save();

    ctx.translate(this.width-3, 0);
    ctx.rotate(Math.PI);
    ctx.scale(0.8, 0.8);
    ctx.translate(0, -34);
    for (var i = 0; i < this.lives; i++) {
      ctx.translate(20, 0);
      graphics.drawMesh(meshes.ship, 'white');
      ctx.translate(12, 0);
    }

    ctx.restore();
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '22px Verdana';
    var textSize = ctx.measureText(this.points);
    ctx.fillText(this.points, this.width - textSize.width - 8, 58);
    ctx.restore();
  };

  return Game;
});
