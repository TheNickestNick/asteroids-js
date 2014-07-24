define(['./gfx', './utils', './entity', './explosion2'], 
    function(gfx, utils, Entity, Explosion2) {
  var Bomb = Entity.subclass();

  Bomb.prototype.init = function(x, y, velx, vely) {
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    return this;
  };

  Bomb.prototype.detonate = function() {
    for (var i = 0; i < 20; i++) {
      this.spawn(Explosion2.create().init(
          this.x + utils.random(-60, 60), this.y + utils.random(-60, 60), 
          utils.random(30, 50), 20, false, i*4));
    }
    this.die();
  };

  Bomb.prototype.onDraw = function(ctx) {
    gfx.circle(ctx, this.x, this.y, 10);
    ctx.fillStyle = 'purple';
    ctx.fill();
  };

  return Bomb;
});
