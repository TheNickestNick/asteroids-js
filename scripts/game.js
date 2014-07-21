define(
    ['./ship', './asteroid', './quadtree', './meshes', './array', './explosion', './debug', 
     './bullet'], 
    function(Ship, Asteroid, Quadtree, meshes, array, Explosion, debug, Bullet) {
  debug.define('pause', false);
  debug.define('pause_step', 0);
  debug.define('draw_quadtree', false);

  // TODO: can we somehow have a generic "updateable" list instead of keeping
  // track of separate arrays for each object type? What about a parent array of
  // the underlying arrays?
  var Game = function(width, height) {
    this.width = width;
    this.height = height;
    this.time = 0;
    this.points = 0;
    this.lives = 2;

    this.ship = null;
    this.bullets = [];
    this.fx = [];
    this.asteroids = [];

    this.ships = [];
    this.entities = [this.ships, this.bullets, this.fx, this.asteroids];

    this.respawnIn = null;

    this.quadtree = new Quadtree(0, 0, width, height, 3);
  };

  Game.STEP_TIME_MS = 1000 / 30; // 30 fps
  Game.SHIP_RESPAWN_TIME = 60;

  Game.prototype.start = function(startTime) {
    this.time = startTime;
    this.ship = Ship.create(this).init(this.width / 2, this.height / 2);
    for (var i = 0; i < 10; i++) {
      this.asteroids.push(
        Asteroid.create().init(Math.random() * this.width, Math.random() * this.height,
          Math.random(), Math.random()));
    }
  };

  Game.prototype.forAllEntities = function(fn) {
    
  };

  Game.prototype.updateAndWrap = function(ent) {
    ent.update();
    ent.wrap(this.width, this.height);
  };

  Game.prototype.drawEntity = function(ent, graphics) {
    ent.draw(graphics);
  };

  Game.prototype.eachEntity = function(fn, arg) {
    for (var i = 0; i < this.entities.length; i++) {
      var set = this.entities[i];
      
      for (var j = 0; j < set.length; j++) {
        var ent = set[j];
        fn.call(this, ent, arg);
      }
    }
  };

  Game.prototype.purgeDead = function() {
    for (var i = 0; i < this.entities.length; i++) {
      var set = this.entities[i];
      for (var j = 0; j < set.length; j++) {
        var ent = set[j];
        // TODO: make this part of updateAndWrap somehow?
        if (!ent.isAlive()) {
          array.remove(set, j);
          j--;

          // TODO: hack, remove
          if (typeof ent.free == 'function') {
            ent.free();
          }
        }
      }
    }
  };

  // TODO: audit the order of these updates.
  Game.prototype.step = function() {
    this.eachEntity(this.updateAndWrap);
    this.quadtree.rebuild(this.asteroids);
    this.stepShip();

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

        this.fx.push(Explosion.create().init(hit.x, hit.y, 5));
        this.fx.push(Explosion.create().init(b.x, b.y, 5));
      }
    }

    this.purgeDead();
    this.dirty = true;
  };

  Game.prototype.stepShip = function() {
    if (!this.ship || !this.ship.isAlive()) {
      // TODO: generalize the concept of a timer, or at least "in X steps, I want Y to happen"
      if (this.respawnIn > 0) {
        this.respawnIn--;
      }

      if (this.respawnIn == 0) {
        this.lives--;
        this.ship = Ship.create(this).init(this.width / 2, this.height / 2);
        this.respawnIn = null;
      }

      return;
    }

    this.ship.update();
    this.ship.wrap(this.width, this.height);

    if (!this.ship.invincible()) {
      var hit = this.quadtree.findFirstIsecWith(this.ship);
      if (hit) {
        this.fx.push(Explosion.create().init(this.ship.x, this.ship.y, 100, 70));
        // TODO: Can we consolidate dying and freeing?
        // Also, can we move the explosing spawning into the entity classes?
        this.ship.die();
        this.ship.free();
        this.ship = null;

        if (this.lives > 0) {
          this.respawnIn = Game.SHIP_RESPAWN_TIME;
        }
      }
    }
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

  Game.prototype.draw = function(graphics) {
    if (debug.vars.draw_quadtree) {
      this.quadtree.draw(graphics);
    }

    this.eachEntity(this.drawEntity, graphics);

    if (this.ship && this.ship.isAlive()) {
      this.ship.draw(graphics);
    }

    this.drawHud(graphics);
    this.dirty = false;
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

    // TODO: generalize text drawing into graphics class
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '22px Verdana';
    var textSize = ctx.measureText(this.points);
    ctx.fillText(this.points, this.width - textSize.width - 8, 58);
    ctx.restore();

    if (this.over()) {
      ctx.save();
      ctx.fillStyle = 'red';
      ctx.font = '50px Courier New';
      var textSize = ctx.measureText('game over');
      ctx.fillText('game over', this.width/2 - textSize.width/2, this.height/2);
      ctx.restore();
    }
  };

  Game.prototype.over = function() {
    return this.lives == 0 && this.ship == null;
  };

  Game.prototype.spawnBullet = function(x, y, velx, vely, dir) {
    this.bullets.push(Bullet.create().init(x, y, velx, vely, dir));
  };

  return Game;
});
