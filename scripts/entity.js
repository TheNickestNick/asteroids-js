define(['./pooled', './debug'], function(pooled, debug) {
  debug.define('draw_bounds', false);

  function Entity(spawner) {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.velx = 0;
    this.vely = 0;
    this.velr = 0;
    this.ttl = null;
    this.dead = false;
    this.spawner = spawner;
  }

  Entity.prototype.wrap = function(w, h) {
    while (this.x > w) { this.x -= w; }
    while (this.x < 0) { this.x += w; }
    while (this.y > h) { this.y -= h; }
    while (this.y < 0) { this.y += h; }
  };

  Entity.prototype.updatePosition = function() {
    this.x += this.velx;
    this.y += this.vely;
  };

  Entity.prototype.updateRotation = function() {
    this.r += this.velr;
  };

  Entity.prototype.updateTTL = function() {
    if (this.ttl === null || this.ttl === 0) {
      return;
    }

    this.ttl--;
    if (this.ttl === 0) {
      this.die();
    }
  };

  Entity.prototype.die = function() {
    this.dead = true;
  };

  Entity.prototype.update = function() {
    this.updatePosition();
    this.updateRotation();
    this.updateTTL();
  };

  Entity.prototype.isAlive = function() {
    return !this.dead;
  };

  Entity.prototype.draw = function(gfx) {
    if (debug.vars.draw_bounds) {
      gfx.outlineCircle(this.x, this.y, this.boundingRadius, 'orange', 2);
    }
  };

  Entity.define = function(defn) {
    var constructor;

    if (typeof defn.ctor === 'function') {
      constructor = function(arg) {
        Entity.call(this, arg);
        defn.ctor.call(this);
      };
    }
    else {
      constructor = function(arg) {
        Entity.call(this, arg);
      }
    }

    constructor.prototype = new Entity();
    constructor.prototype.constructor = constructor;

    for (var k in defn) {
      if (!(k in constructor.prototype)) {
        constructor.prototype[k] = defn[k];
      }
    }

    // TODO: generalize this concept of overloading
    if (typeof defn.update === 'function') {
      constructor.prototype.update = function() {
        Entity.prototype.update.call(this);
        defn.update.call(this);
      };
    }

    if (typeof defn.draw === 'function') {
      constructor.prototype.draw = function(gfx) {
        Entity.prototype.draw.call(this, gfx);
        defn.draw.call(this, gfx);
      };
    }

    return pooled.makePooled(constructor);
  };

  return Entity;
});
