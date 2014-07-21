define(['./entity'], function(Entity) {
  Bullet = Entity.define({
    init: function(x, y, velx, vely, direction) {
      this.x = x;
      this.y = y;
      this.velx = velx - Math.sin(direction) * Bullet.VELOCITY;
      this.vely = vely + Math.cos(direction) * Bullet.VELOCITY;
      this.ttl = Bullet.TTL;
      return this;
    }
  });

  Bullet.VELOCITY = 10;
  Bullet.TTL = 50; // Frames to live

  Bullet.prototype.onDraw = function(graphics) {
    graphics.drawCircle(this.x, this.y, 1.5, 'white');
  };

  return Bullet;
});

