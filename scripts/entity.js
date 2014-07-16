define(function() {
  function Entity() {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.velx = 0;
    this.vely = 0;
    this.velr = 0;
    this.ttl = null;
    this.dead = false;
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
    if (this.ttl === null) {
      return;
    }

    if (this.ttl === 0) {
      this.die();
    }
    else {
      this.ttl--;
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

  Entity.prototype.isDead = function() {
    return this.dead;
  };

  Entity.define = function(defn) {
    var constructor;

    if (typeof defn.ctor === 'function') {
      constructor = function() {
        Entity.apply(this, arguments);
        defn.ctor.apply(this, arguments);
      };
    }
    else {
      constructor = function() {
        Entity.apply(this, arguments);
      }
    }

    constructor.prototype = new Entity();
    constructor.prototype.constructor = constructor;

    for (var k in defn) {
      if (k !== 'update' && k !== 'ctor') {
        constructor.prototype[k] = defn[k];
      }
    }

    if (typeof defn.update === 'function') {
      constructor.prototype.update = function() {
        Entity.prototype.update.apply(this, arguments);
        defn.update.apply(this, arguments);
      };
    }

    return constructor;
  };

  return Entity;
});
