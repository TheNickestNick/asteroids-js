define(['./gfx', './utils', './entity', './explosion2'], 
    function(gfx, utils, Entity, Explosion2) {
  var Bomb = Entity.subclass();

  Bomb.prototype.init = function(x, y, velx, vely) {
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.layer = -1;
    return this;
  };

  Bomb.prototype.detonate = function() {
    for (var i = 0; i < 15; i++) {
      // TODO: the x/y coords are boxy, they need to be circley.
      this.spawn(Explosion2.create().init(
          this.x + utils.random(-100, 100), this.y + utils.random(-100, 100), 
          // TODO: generate random radii based on circle surface area not radii length
          utils.random(60, 100), utils.random(6, 15), false, utils.random(0, i*1.5)));
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
