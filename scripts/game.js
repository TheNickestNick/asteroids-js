define(
    ['./ship', './asteroid', './quadtree', './meshes', './array', './explosion', './debug', 
     './bullet', './hud', './bonus'], 
    function(Ship, Asteroid, Quadtree, meshes, array, Explosion, debug, Bullet, hud, Bonus) {
  debug.define('pause', false);
  debug.define('pause_step', 0);
  debug.define('draw_quadtree', false);

  // TODO: we need the concept of a Player at some point.
  var Game = function(width, height) {
    this.width = width;
    this.height = height;
    this.time = 0;
    this.points = 0;
    this.lives = 2;
    this.xp = 0;
    this.level = 1;

    this.ship = null;
    this.bullets = [];
    this.fx = [];
    this.asteroids = [];
    this.bonuses = [];
    // TODO: somehow make ship part of this
    this.entities = [this.bullets, this.asteroids, this.fx, this.bonuses];

    this.respawnIn = null;
    this.quadtree = new Quadtree(0, 0, width, height, 3);
  };

  Game.STEP_TIME_MS = 1000 / 30; // 30 fps
  Game.SHIP_RESPAWN_TIME = 60;
  Game.BONUS_SPAWN_CHANCE = 1.0;

  Game.prototype.start = function(startTime) {
    this.time = startTime;
    this.startLevel();
  };

  Game.prototype.stepAndWrap = function(ent) {
    ent.step();
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
        // TODO: make this part of stepAndWrap somehow?
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

  Game.prototype.startLevel = function() {
    this.ship = Ship.create(this).init(this.width / 2, this.height / 2);

    for (var i = 0; i < this.level; i++) {
      this.asteroids.push(
          Asteroid.create(this).init(Math.random() * this.width, Math.random() * this.height,
              Math.random(), Math.random()));
    }
  };

  // TODO: audit the order of these updates.
  Game.prototype.step = function() {
    this.eachEntity(this.stepAndWrap);
    this.quadtree.rebuild(this.asteroids);
    this.stepShip();

    for (var i = 0; i < this.bullets.length; i++) {
      var b = this.bullets[i];
      var hit = this.quadtree.findFirstIsecWithPoint(b.x, b.y);
      
      if (hit && hit.constructor == Asteroid) {
        hit.die();
        b.die();
        this.points += 10 * hit.size;
        this.xp += 10;
        this.fx.push(Explosion.create().init(hit.x, hit.y, 5));
        this.fx.push(Explosion.create().init(b.x, b.y, 5));

        // TODO: push into asteroid class?
        if (Math.random() < Game.BONUS_SPAWN_CHANCE) {
          this.bonuses.push(Bonus.create(this).init(hit.x, hit.y));
        }
      }
    }

    this.purgeDead();

    if (this.asteroids.length === 0) {
      this.level++;
      this.startLevel();
    }
    
    this.dirty = true;
  };

  Game.prototype.stepShip = function() {
    if (!this.ship || !this.ship.isAlive()) {
      if (this.respawnIn == 0) {
        this.lives--;
        this.ship = Ship.create(this).init(this.width / 2, this.height / 2);
        this.respawnIn = null;
      }

      // TODO: generalize the concept of a timer, or at least "in X steps, I want Y to happen"
      if (this.respawnIn > 0) {
        this.respawnIn--;
      }

      return;
    }

    this.ship.step();
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

    hud.draw(graphics.context(), this);
    this.dirty = false;
  };

  Game.prototype.over = function() {
    return this.lives == 0 && this.ship == null;
  };

  Game.prototype.spawnBullet = function(x, y, velx, vely, dir) {
    this.bullets.push(Bullet.create(this).init(x, y, velx, vely, dir));
  };

  Game.prototype.spawnAsteroid = function(asteroid) {
    this.asteroids.push(asteroid);
    asteroid.spawner = this;
  };

  return Game;
});
