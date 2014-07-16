define(['./ship', './asteroid', './quadtree', './meshes', './array'], 
    function(Ship, Asteroid, Quadtree, meshes, array) {
  function drawEach(arr, graphics) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].draw(graphics);
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
        Asteroid.create().init(Math.random() * this.width, Math.random() * this.height,
          Math.random(), Math.random()));
    }
  };

  Game.prototype.stepEach = function(arr) {
    for (var i = 0; i < arr.length; i++) {
      var ent = arr[i];
      ent.update();
      ent.wrap(this.width, this.height);

      if (ent.isDead()) {
        array.remove(arr, i);
        i--;

        // TODO: hack, remove
        if (typeof ent.free == 'function') {
          ent.free();
        }
      }
    }
  };

  // TODO: audit the order of these updates.
  Game.prototype.step = function() {
    this.ship.update();
    this.ship.wrap(this.width, this.height);

    this.stepEach(this.asteroids);
    this.stepEach(this.bullets);

    this.quadtree.rebuild(this.asteroids);

    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      var hit = this.quadtree.findFirstIsecWithPoint(b.x, b.y);
      
      if (hit && hit.constructor == Asteroid) {
        hit.die();
        b.free();
        array.remove(this.bullets, i);
        i--;

        this.points += 10 * hit.size;
        // TODO: move this into the asteroid class so that we can have different behaviors.
        if (hit.size > 1) {
          this.asteroids.push(
              Asteroid.create().init(hit.x, hit.y, Math.random(), Math.random(), hit.size-1));
          this.asteroids.push(
              Asteroid.create().init(hit.x, hit.y, Math.random(), Math.random(), hit.size-1));
        }
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
