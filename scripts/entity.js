define(['./pooled', './debug', './gfx'], function(pooled, debug, gfx) {
  debug.define('draw_entity_bounds', false);

  function abstract() {}

  // TODO: can we somehow get rid of the silly .create().init(x, y, z) nonesenese?
  // Maybe we can make the entities a function that does the create and init underneath?
  // You would call it wihout new, like: Missile(x, y, dir) or Bullet(x, y, dir)
  function Entity() {
    this.x = 0;
    this.y = 0;
    this.r = 0;
    this.velx = 0;
    this.vely = 0;
    this.velr = 0;
    this.ttl = null;
    this.dead = false;
    this.time = 0;
    this.game = null;
    this.layer = 0;
    this.id = Entity.nextId++;
  }

  Entity.nextId = 1;
  Entity.prototype.onDie = abstract;
  Entity.prototype.onStep = abstract;
  Entity.prototype.onDraw = abstract;
  Entity.prototype.onWrap = abstract;
  Entity.prototype.onCollision = abstract;
  Entity.prototype.onCollideWithAsteroid = abstract;
  Entity.prototype.onCollideWithShip = abstract;

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

  // TODO: change TTL to a "time to die"
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

  Entity.prototype.spawn = function(entity) {
    this.game.spawn(entity);
  };
  
  Entity.prototype.die = function() {
    if (!this.dead && this.onDie() !== false) {
      this.dead = true;
    }
  };

  // TODO: now that we have a game reference, wrapping can go here
  Entity.prototype.step = function() {
    this.x += this.velx;
    this.y += this.vely;
    this.r += this.velr;
    this.wrap(this.game.width, this.game.height);
    this.time++;
    this.updateTTL();
    this.onStep();
  };

  Entity.prototype.isAlive = function() {
    return !this.dead;
  };

  Entity.prototype.drawInternal = function(ctx, tx, ty) {
    ctx.save();
    // TODO: make it so entities themselves don't have to transform
    if (tx !== 0 || ty !== 0) {
      ctx.translate(tx, ty);
    }
    this.onDraw(ctx);
    ctx.restore();

    if (asteroids.draw_entity_bounds) {
      ctx.save();
      gfx.circle(ctx, this.x, this.y, this.boundingRadius);
      ctx.strokeStyle = 'teal';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  };

  Entity.prototype.draw = function(graphics) {
    var ctx = graphics.context();
    this.drawInternal(ctx, 0, 0);

    var overlapsLeft = this.x - this.boundingRadius < 0;
    var overlapsRight = this.x + this.boundingRadius > this.game.width;
    var overlapsTop = this.y - this.boundingRadius < 0;
    var overlapsBottom = this.y + this.boundingRadius > this.game.height;

    if (overlapsLeft) {
      this.drawInternal(ctx, this.game.width, 0);
    }

    if (overlapsRight) {
      this.drawInternal(ctx, -this.game.width, 0);       
    }

    if (overlapsTop) {
      this.drawInternal(ctx, 0, this.game.height);
    }

    if (overlapsBottom) {
      this.drawInternal(ctx, 0, -this.game.height);
    }

    if (overlapsLeft && overlapsTop) {
      this.drawInternal(ctx, this.game.width, this.game.height);
    }

    if (overlapsLeft && overlapsBottom) {
      this.drawInternal(ctx, this.game.width, -this.game.height);
    }

    if (overlapsRight && overlapsTop) {
      this.drawInternal(ctx, -this.game.width, this.game.height);
    }

    if (overlapsRight && overlapsBottom) {
      this.drawInternal(ctx, -this.game.width, -this.game.height);
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
