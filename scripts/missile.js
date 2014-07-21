define(['./gfx', './entity', './meshes'], function(gfx, Entity, meshes) {
  var Missile = Entity.subclass();

  Missile.prototype.init = function(x, y, velx, vely, direction) {
    this.x = x;
    this.y = y;
    this.r = direction;
    this.velx = velx - Math.sin(this.r) * Missile.ACCELERATION;
    this.vely = vely + Math.cos(this.r) * Missile.ACCELERATION;
    return this;
  };

  Missile.ACCELERATION = 0;//0.01;

  Missile.prototype.onStep = function() {
    this.velx += Math.sin(this.r) * Missile.ACCELERATION;
    this.vely += Math.cos(this.r) * Missile.ACCELERATION;
  };

  Missile.WIDTH = 8;
  Missile.LENGTH = 20;

  // TODO: meshify
  Missile.prototype.onDraw = function(ctx) {
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r);

    ctx.scale(4, 4);

    ctx.save();
    ctx.beginPath();
    gfx.circle(ctx, -3, -5, 3.5);
    ctx.closePath();
    ctx.fillStyle = '#666';
    ctx.fill();

    ctx.beginPath();
    gfx.circle(ctx, 3, -5, 3.5);
    ctx.closePath();
    ctx.fillStyle = '#666';
    ctx.fill();

    ctx.beginPath();
    ctx.rect(-Missile.WIDTH/2, -Missile.LENGTH/2, Missile.WIDTH, Missile.LENGTH);
    ctx.closePath();
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.beginPath();
    gfx.circle(ctx, 0, Missile.LENGTH/2, Missile.WIDTH/2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -2);
    ctx.lineTo(0, -9);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#666';
    ctx.stroke();
    
    ctx.restore();

    ctx.save();
    ctx.translate(0, -3);
    ctx.scale(0.4, 1);
    meshes.thrust.draw(ctx);
    ctx.restore();
  };

  return Missile;
});
