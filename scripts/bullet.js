define(['./entity', './gfx', './explosion2'], function(Entity, gfx, Explosion2) {
  Bullet = Entity.subclass();
  Bullet.VELOCITY = 10;

  Bullet.prototype.init = function(x, y, velx, vely, direction, ttl) {
    this.x = x;
    this.y = y;
    this.velx = velx - Math.sin(direction) * Bullet.VELOCITY;
    this.vely = vely + Math.cos(direction) * Bullet.VELOCITY;
    this.ttl = ttl;
    this.boundingRadius = 0;
    this.layer = -1;
    return this;
  };

  Bullet.prototype.onDraw = function(ctx) {
    gfx.circle(ctx, this.x, this.y, 1.5);
    ctx.fillStyle = 'white';
    ctx.fill();
  };

  Bullet.prototype.onCollideWithAsteroid = function(asteroid) {
    asteroid.die();
    this.die();
    this.spawn(Explosion2.create().init(this.x, this.y, 10, 5, true /* animateOnly */));
  };

  return Bullet;
});

