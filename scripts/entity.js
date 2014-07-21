define(['./pooled', './debug', './gfx'], function(pooled, debug, gfx) {
  debug.define('draw_bounds', false);

  function abstract() {}

  // REFACTORING IDEA:
  //  Don't allow any overrides at all. Have abstract "onX" methods that get called from
  //  the base entity methods.
  function Entity(spawner) {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.velx = 0;
    this.vely = 0;
    this.velr = 0;
    this.ttl = null;
    this.dead = false;
    // TODO: rename to just "time"
    this.aliveTime = 0;
    this.spawner = spawner;
  }

  Entity.prototype.onDie = abstract;
  Entity.prototype.onStep = abstract;
  Entity.prototype.onDraw = abstract;
  Entity.prototype.onWrap = abstract;

  Entity.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Entity.prototype.wrap = function(w, h) {
    while (this.x > w) { this.x -= w; }
    while (this.x < 0) { this.x += w; }
    while (this.y > h) { this.y -= h; }
    while (this.y < 0) { this.y += h; }
    this.onWrap(w, h);
  };

  Entity.prototype.updateTTL = function() {
    if (this.ttl === null || this.ttl === 0) {
      return;
    }

    this.ttl >>>= 0;
    this.ttl--;
    if (this.ttl === 0) {
      this.die();
    }
  };

  Entity.prototype.die = function() {
    this.dead = true;
    this.onDie();
  };

  Entity.prototype.step = function() {
    this.x += this.velx;
    this.y += this.vely;
    this.r += this.velr;
    this.aliveTime++;
    this.updateTTL();
    this.onStep();
  };

  Entity.prototype.isAlive = function() {
    return !this.dead;
  };

  Entity.prototype.draw = function(graphics) {
    var ctx = graphics.context();
    ctx.save();
    this.onDraw(ctx);
    ctx.restore();

    if (debug.vars.draw_bounds) {
      ctx.save();
      gfx.circle(ctx, this.x, this.y, this.boundingRadius);
      ctx.strokeStyle = 'teal';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  };

  Entity.subclass = function(ctor) {
    var constructor;

    if (typeof ctor === 'function') {
      constructor = function(arg) {
        Entity.call(this, arg);
        ctor.call(this, arg);
      };
    }
    else {
      constructor = function(arg) {
        Entity.call(this, arg);
      };
    }

    constructor.prototype = new Entity();
    constructor.prototype.constructor = constructor;
    return pooled.makePooled(constructor);
  };

  return Entity;
});
