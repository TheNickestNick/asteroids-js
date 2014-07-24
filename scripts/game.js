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
    this.level = 0;

    this.ship = null;
    // TODO: rename to entities
    this.gameObjects = [];
    this.nextLevelIn = null;

    this.respawnIn = null;
    this.quadtree = new Quadtree(0, 0, width, height, 3);
  };

  Game.STEP_TIME_MS = 1000 / 30; // 30 fps
  Game.SHIP_RESPAWN_TIME = 60;
  Game.BONUS_SPAWN_CHANCE = 0.1;
  Game.STEPS_BETWEEN_LEVELS = 100;

  Game.prototype.start = function(startTime) {
    this.time = startTime;
    this.respawnIn = 0;
    this.startNextLevel();
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

  Game.prototype.startNextLevel = function() {
    this.level += 1;

    if (this.ship != null) {
      this.ship.respawn(this.width / 2, this.height / 2);
    }

    for (var i = 0; i < this.level; i++) {
      this.spawn(Asteroid.create().init(Math.random() * this.width, Math.random() * this.height,
              Math.random(), Math.random()));
    }
  };

  Game.prototype.isLevelOver = function() {
    // TODO: there's got to be a constant time way to do this
    for (var i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].constructor == Asteroid) {
        return false;
      }
    }

    return true;
  };

  Game.prototype.entitiesIntersect = function(obj1, obj2) {
    return geometry.circlesIntersect(obj1.x, obj1.y, obj1.boundingRadius,
        obj2.x, obj2.y, obj2.boundingRadius);
  };

  Game.prototype.step = function() {
    if (this.respawnIn === 0) {
      this.respawnIn = null;
      this.ship = Ship.create().init(this.width/2, this.height/2);
      this.spawn(this.ship);
      this.lives -= 1;
    }
    else if (this.respawnIn !== null) {
      this.respawnIn -= 1;
    }

    // This can change as a result of updates and collisions. Cache the length at the
    // start of the step so that new entities don't get updated prematurely.
    var numObjects = this.gameObjects.length;
  
    for (var i = 0; i < numObjects; i++) {
      var obj = this.gameObjects[i];
      obj.step();
      obj.wrap(this.width, this.height);
    }

    for (var i = 0; i < numObjects; i++) {
      var obj1 = this.gameObjects[i];
      for (var j = 0; j < this.gameObjects.length; j++) {
        obj2 = this.gameObjects[j];

        if (obj1 != obj2 && this.entitiesIntersect(obj1, obj2)) {
          obj1.onCollision(obj2);
        }
      }
    }

    if (this.ship !== null && !this.ship.isAlive()) {
      this.respawnIn = Game.SHIP_RESPAWN_TIME;
      this.ship = null;
    }

    this.purgeDead();

    if (this.isLevelOver()) {
      // TODO: we really need to provide a way to genericize this concept
      if (this.nextLevelIn === null) {
        this.nextLevelIn = Game.STEPS_BETWEEN_LEVELS;
      }
      else {
        if (this.nextLevelIn === 0) {
          this.startNextLevel();
          this.nextLevelIn = null;
        }
        else {
          this.nextLevelIn -= 1;
        }
      }
    }

    this.dirty = true;
  };

  Game.prototype.needsToDraw = function() {
    return this.dirty;
  };
  
  Game.prototype.runUntil = function(time) {
    var stepTime = debug.vars.step_time || Game.STEP_TIME_MS;
    // TODO: rename "time" to refer to the current step number (consistent with
    // the entities classes), and use some other name for real time.
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
