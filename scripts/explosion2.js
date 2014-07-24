define(['./entity', './gfx'], function(Entity, gfx) {
  // TODO: rehtink the naming and structure of the explosion classes
  var Explosion2 = Entity.subclass();

  Explosion2.prototype.init = function(x, y, radius, duration, animationOnly, delay) {
    this.x = x;
    this.y = y;
    this.duration = duration || 8;
    this.radius = radius || 50;
    this.animateOnly = !!animationOnly;
    this.delay = delay || 0;
    this.ttl = this.duration + this.delay;
    return this;
  };

  Explosion2.prototype.onStep = function() {
    if (this.time >= this.delay) {
      this.boundingRadius = ((this.time - this.delay) / this.duration) * this.radius;
    }
  };

  Explosion2.prototype.onCollideWithAsteroid = function(asteroid) {
    if (!this.animateOnly) {
      asteroid.die();
      this.spawn(Explosion2.create().init(
          asteroid.x, asteroid.y, asteroid.boundingRadius, null, true /* animateOnly */));
    }
  };

  Explosion2.prototype.onCollideWithShip = function(ship) {
    ship.die();
  };

  Explosion2.prototype.onDraw = function(ctx) {
    if (this.time < this.delay) {
      return;
    }

    this.circle(ctx, 'red', 0);
    this.circle(ctx, 'orange', 0.2);
    this.circle(ctx, 'yellow', 0.4);
    this.circle(ctx, 'orange', 0.7);
  };

  Explosion2.prototype.circle = function(ctx, color, start) {
    var offset = this.duration * start;
    var liveTime = this.time - this.delay;

    if (liveTime < offset) {
      return;
    }

    var offsetTime = liveTime - offset;
    var offsetDur = this.duration - offset;

    ctx.beginPath();
    gfx.circle(ctx, this.x, this.y, (offsetTime/offsetDur)*this.radius);
    ctx.closePath();
    ctx.fillStyle = color; 
    ctx.fill();
  };

  return Explosion2;
});
