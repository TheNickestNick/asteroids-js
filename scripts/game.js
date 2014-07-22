define(
    ['./ship', './asteroid', './quadtree', './meshes', './array', './explosion', './debug', 
     './bullet', './hud', './bonus', './audio', './missile', './explosion2'], 
    function(Ship, Asteroid, Quadtree, meshes, array, Explosion, debug, Bullet, hud, Bonus, 
             audio, Missile, Explosion2) {
  debug.define('pause', false);
  debug.define('pause_step', 0);
  debug.define('draw_quadtree', false);
  debug.define('step_time', null);

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
    this.projectiles = [];
    this.fx = [];
    this.asteroids = [];
    this.bonuses = [];
    this.missiles = [];
    this.explosions = [];
    // TODO: somehow make ship part of this
    this.entities = [this.projectiles, this.missiles, this.asteroids, this.fx, this.bonuses, 
        this.explosions];

    this.respawnIn = null;
    this.quadtree = new Quadtree(0, 0, width, height, 3);
  };

  Game.STEP_TIME_MS = 1000 / 30; // 30 fps
  Game.SHIP_RESPAWN_TIME = 60;
  Game.BONUS_SPAWN_CHANCE = 0.1;

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
    if (this.ship === null) {
      this.ship = Ship.create().init(this.width / 2, this.height / 2);
      this.ship.spawner = this;
    }
    else {
      this.ship.respawn(this.width/2, this.height/2);
    }

    for (var i = 0; i < this.level; i++) {
      this.spawn(Asteroid.create().init(Math.random() * this.width, Math.random() * this.height,
              Math.random(), Math.random()));
    }
  };

  Game.prototype.onExplosionHit = function(explosion, hit) {
    hit.die(); 
    this.spawn(Explosion2.create().init(hit.x, hit.y, hit.size * 10));
  };

  // TODO: audit the order of these updates.
  Game.prototype.step = function() {
    this.eachEntity(this.stepAndWrap);
    this.quadtree.clear();
    this.quadtree.addAll(this.asteroids);
    this.quadtree.addAll(this.bonuses);
    this.stepShip();

    for (var i = 0; i < this.projectiles.length; i++) {
      var p = this.projectiles[i];
      var hit = this.quadtree.findFirstIsecWith(p);
      
      if (hit && hit.constructor === Asteroid) {
        hit.die();
        p.die();
        this.points += 10 * hit.size;
        this.xp += 10;

        if (p.constructor === Bullet) {
          this.spawn(Explosion.create().init(hit.x, hit.y, 5));
          this.spawn(Explosion.create().init(p.x, p.y, 5));
        }
      }
    }

    // TODO: can we somehow consolidate the explosion and projectile handling? It's very similar.
    for (var i = 0; i < this.explosions.length; i++) {
      var e = this.explosions[i];
      this.quadtree.forEachIntersection(e, this.onExplosionHit, this);
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
        this.ship = Ship.create().init(this.width / 2, this.height / 2);
        this.ship.spawner = this;
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

    var hit = this.quadtree.findFirstIsecWith(this.ship);
    if (hit) {
      if (hit.constructor == Asteroid && !this.ship.invincible()) {
        this.fx.push(Explosion.create().init(this.ship.x, this.ship.y, 100, 70));
        // TODO: Can we consolidate dying and freeing?
        // Also, can we move the explosing spawning into the entity classes?
        this.ship.die();
        this.ship.free();
        this.ship = null;
        audio.play(audio.sounds.crash);

        if (this.lives > 0) {
          this.respawnIn = Game.SHIP_RESPAWN_TIME;
        }
      }
      else if (hit.constructor == Bonus) {
        hit.applyTo(this.ship, this);
        hit.die();
        audio.play(audio.sounds.bonus2);
      }
    }
  };

  Game.prototype.needsToDraw = function() {
    return this.dirty;
  };
  
  Game.prototype.runUntil = function(time) {
    var stepTime = debug.vars.step_time || Game.STEP_TIME_MS;
    while (this.time + stepTime < time) {
      this.time += stepTime;

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

  Game.prototype.spawn = function(ent) {
    if (ent.constructor === Asteroid) {
      this.asteroids.push(ent);
    }
    else if (ent.constructor === Explosion2) {
      this.explosions.push(ent);
    }
    else if (ent.constructor === Bullet) {
      this.projectiles.push(ent);
    }
    else if (ent.constructor === Missile) {
      this.projectiles.push(ent);
    }
    else if (ent.constructor === Bonus) {
      this.bonuses.push(ent);
    }
    else {
      // fx holds all misc entity types that just need to be updated
      // and don't need special handling
      this.fx.push(ent);
    }

    ent.spawner = this;
  };

  return Game;
});
