define(['./entity', './gfx'], function(Entity, gfx) {
  Bullet = Entity.subclass();
  Bullet.VELOCITY = 10;
  Bullet.TTL = 50;

  Bullet.prototype.init = function(x, y, velx, vely, direction) {
    this.x = x;
    this.y = y;
    this.velx = velx - Math.sin(direction) * Bullet.VELOCITY;
    this.vely = vely + Math.cos(direction) * Bullet.VELOCITY;
    this.ttl = Bullet.TTL;
    return this;
  };

  Bullet.prototype.onDraw = function(ctx) {
    gfx.circle(ctx, this.x, this.y, 1.5);
    ctx.fillStyle = 'white';
    ctx.fill();
  };

  return Bullet;
});

