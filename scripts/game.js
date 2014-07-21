define(
    ['./ship', './asteroid', './quadtree', './meshes', './array', './explosion', './debug', 
     './bullet'], 
    function(Ship, Asteroid, Quadtree, meshes, array, Explosion, debug, Bullet) {
  debug.define('pause', false);
  debug.define('pause_step', 0);
  debug.define('draw_quadtree', false);

  function drawEach(arr, graphics) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].draw(graphics);
    }
  }
  
  var Game = function(width, height) {
    this.width = width;
    this.height = height;
    this.ship = Ship.create(this).init(width / 2, height / 2);
    this.bullets = [];
    this.time = 0;
    this.points = 0;
    this.lives = 2;

    this.fx = [];
    this.asteroids = [];

    this.quadtree = new Quadtree(0, 0, width, height, 3);
  };

  Game.STEP_TIME_MS = 1000 / 30; // 30 fps

  Game.prototype.draw = function(graphics) {
    if (debug.vars.draw_quadtree) {
      this.quadtree.draw(graphics);
    }

    drawEach(this.asteroids, graphics);
    drawEach(this.bullets, graphics);
    drawEach(this.fx, graphics);
    this.ship.draw(graphics);

    this.drawHud(graphics);
    this.dirty = false;
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
    this.stepEach(this.fx);

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

        this.fx.push(Explosion.create().init(hit.x, hit.y));
        this.fx.push(Explosion.create().init(b.x, b.y));
      }
    }

    var hit = this.quadtree.findFirstIsecWith(this.ship);
    if (hit) {
      console.log('Ship hit!');
    }

    this.dirty = true;
  };

  Game.prototype.needsToDraw = function() {
    return this.dirty;
  };
  
  Game.prototype.runUntil = function(time) {
    while (this.time + Game.STEP_TIME_MS < time) {
      this.time += Game.STEP_TIME_MS;

      if (!debug.vars.pause) { 
        this.step();
      }
    }

    if (debug.vars.pause) {
      for (; debug.vars.pause_step > 0; debug.vars.pause_step--) {
        this.step();
      }
    }
  };

  Game.prototype.started = function() {
    return this.time != 0;
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

  Game.prototype.spawnBullet = function(x, y, velx, vely, dir) {
    this.bullets.push(Bullet.create().init(x, y, velx, vely, dir));
  };

  return Game;
});
