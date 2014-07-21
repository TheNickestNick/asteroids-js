define(['./entity', './gfx', './utils'], function(Entity, gfx, utils) {
  var Bonus = Entity.subclass(function() {
    this.type = 0;
    this.time = 0;
  });

  Bonus.MIN_TTL = 300;
  Bonus.MAX_TTL = 1000;

  Bonus.prototype.init = function(x, y) {
    this.x = x;
    this.y = y;
    this.velx = utils.random(-3, 3); 
    this.vely = utils.random(-3, 3); 
    // TODO: is an "alive time" a good thing to add to all entities?
    this.time = 0;
    this.ttl = utils.random(Bonus.MIN_TTL, Bonus.MAX_TTL);
    return this;
  };

  Bonus.prototype.onDraw = function(ctx) {
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI/4);

    ctx.save();
    ctx.rotate(-this.time * 0.12);
    ctx.beginPath();
    ctx.rect(-6, -6, 12, 12);
    ctx.closePath();
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.rotate(this.time * 0.12);
    ctx.beginPath();
    ctx.rect(-12, -12, 24, 24);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.restore();
  };

  Bonus.prototype.onStep = function() {
    this.time++;
  };

  return Bonus;
});
