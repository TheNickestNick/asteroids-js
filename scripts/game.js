// TODO: this module stuff is getting ridiculous. Find a way to manage this better or make
// it prettier.
define(
    ['./ship', './asteroid', './quadtree', './meshes', './array', './explosion', './debug', 
     './bullet', './hud', './bonus', './audio', './missile', './explosion2', './geometry'], 
    function(Ship, Asteroid, Quadtree, meshes, array, Explosion, debug, Bullet, hud, Bonus, 
             audio, Missile, Explosion2, geometry) {
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

    // TODO: rename entities
    this.gameObjects = [];

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

  Game.prototype.purgeDead = function() {
    for (var i = 0; i < this.gameObjects.length; i++) {
      var ent = this.gameObjects[i];
      if (!ent.isAlive()) {
        ent.free();
        array.remove(this.gameObjects, i);
        i--;
      }
    }
  };

  Game.prototype.startLevel = function() {
    this.ship = Ship.create().init(this.width / 2, this.height / 2);
    this.spawn(this.ship);

    for (var i = 0; i < this.level; i++) {
      this.spawn(Asteroid.create().init(Math.random() * this.width, Math.random() * this.height,
              Math.random(), Math.random()));
    }
  };

  // TODO: audit the order of these updates.
  Game.prototype.step = function() {
    for (var i = 0; i < this.gameObjects.length; i++) {
      var obj = this.gameObjects[i];
      obj.step();
      obj.wrap(this.width, this.height);
    }

    for (var i = 0; i < this.gameObjects.length; i++) {
      var obji = this.gameObjects[i];
      for (var j = 0; j < this.gameObjects.length; j++) {
        objj = this.gameObjects[j];

        if (geometry.circlesIntersect(obji, objj)) {
          obji.onCollision(obj2);
        }
      }
    }

    this.purgeDead();
    this.dirty = true;
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

    for (var i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].draw(graphics);
    }

    hud.draw(graphics.context(), this);
    this.dirty = false;
  };

  Game.prototype.over = function() {
    return this.lives == 0 && this.ship == null;
  };

  Game.prototype.spawn = function(ent) {
    this.gameObjects.push(ent);
    ent.spawner = this;
  };

  return Game;
});
