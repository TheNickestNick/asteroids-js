// TODO: add generic/static wrap and updatePosition methods to Entity, so that code doesn't live here?
// TODO: should we add a generic particle system, instead of having distinct entities for each type
// of particle animation we want to do?
define(['./entity', './array', './gfx', './utils'], function(Entity, array, gfx, utils) {
  var COLORS = ['red', 'orange', 'yellow', 'white'];
  //COLORS = ['white'];

  var Explosion = Entity.subclass(function(){
    this.particles = [];
    this.particleCount = 0;
    
    for (var i = 0; i < Explosion.MAX_PARTICLE_COUNT; i++) {
      this.particles.push({
        x: 0, y: 0, velx: 0, vely: 0, ttl: 0
      });
    }
  });
    
  Explosion.MAX_PARTICLE_COUNT = 100;
  Explosion.DEFAULT_MAX_PARTICLE_TTL = 10;
  Explosion.MAX_PARTICLE_SPEED = 4;

  Explosion.prototype.init = function(x, y, particleCount, maxTTL) {
    this.particleCount = particleCount || this.particles.length;
    maxTTL = maxTTL || Explosion.DEFAULT_MAX_PARTICLE_TTL;

    for (var i = 0; i < this.particleCount; i++) {
      var p = this.particles[i];
      p.x = x;
      p.y = y;

      // TODO: make this generic, we do this a lot.
      var dir = utils.random(0, Math.PI*2);
      var speed = utils.random(0, Explosion.MAX_PARTICLE_SPEED);
      p.velx = Math.cos(dir) * speed;
      p.vely = Math.sin(dir) * speed;
      p.ttl = utils.random(0, maxTTL);
      p.color = array.random(COLORS); 
    }
    return this;
  };

  Explosion.prototype.onDraw = function(ctx) {
    for (var i = 0; i < this.particleCount; i++) {
      var p = this.particles[i];
      if (p.ttl > 0) {
        gfx.circle(ctx, this.x + p.x, this.y + p.y, 1.5);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    }
  };

  Explosion.prototype.onStep = function() {
    var shouldDie = true;
    for (var i = 0; i < this.particleCount; i++) {
      var p = this.particles[i];
      p.x += p.velx;
      p.y += p.vely;
      p.ttl--;
      shouldDie = shouldDie && (p.ttl <= 0);
    }

    if (shouldDie) {
      this.die();
    }
  };

  // TODO: not working for some reason
  Explosion.prototype.onWrap = function(w, h) {
    for (var i = 0; i < this.particleCount; i++) {
      var p = this.particles[i];
      while (p.x > w) { p.x -= w; }
      while (p.x < 0) { p.x += w; }
      while (p.y > h) { p.y -= h; }
      while (p.y < 0) { p.y += h; }
    }
  };

  return Explosion;
});
