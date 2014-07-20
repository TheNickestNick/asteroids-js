// TODO: add generic/static wrap and updatePosition methods to Entity, so that code doesn't live here?
// TODO: should we add a generic particle system, instead of having distinct entities for each type
// of particle animation we want to do?
define(['./entity', './array'], function(Entity, array) {
  var COLORS = ['red', 'orange', 'yellow', 'white'];
  //COLORS = ['white'];

  var Explosion = Entity.define({
    ctor: function() {
      this.particles = [];
      
      for (var i = 0; i < Explosion.PARTICLE_COUNT; i++) {
        this.particles.push({
          x: 0, y: 0, velx: 0, vely: 0, ttl: 0
        });
      }
    },
    
    init: function(x, y) {
      for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        p.x = x;
        p.y = y;

        // TODO: make this generic, we do this a lot.
        p.velx = (Math.random() * 15) - 7.5;
        p.vely = (Math.random() * 15) - 7.5;
        p.ttl = (Math.random() * Explosion.PARTICLE_MAX_TTL);
        p.color = array.random(COLORS); 
      }
      return this;
    },

    update: function() {
      var shouldDie = true;
      for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        p.x += p.velx;
        p.y += p.vely;
        p.ttl--;
        shouldDie = shouldDie && (p.ttl <= 0);
      }

      if (shouldDie) {
        this.die();
      }
    },

    wrap: function(w, h) {
      Entity.prototype.wrap.call(this);
      for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        while (p.x > w) { p.x -= w; }
        while (p.x < 0) { p.x += w; }
        while (p.y > h) { p.y -= h; }
        while (p.y < 0) { p.y += h; }
      }
    },

    draw: function(graphics) {
      for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        if (p.ttl > 0) {
          graphics.drawCircle(this.x + p.x, this.y + p.y, 1.5, p.color);
        }
      }
    }
  });

  // TODO: make this configurable in the init method
  Explosion.PARTICLE_COUNT = 30;
  Explosion.PARTICLE_MAX_TTL = 10;

  return Explosion;
});
