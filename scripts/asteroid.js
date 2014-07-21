define(['./entity','./textures', './utils'], function(Entity, textures, utils) {
  var asteroidTextures = ['rock1', 'rock2', 'rock3', 'rock4'];

  var Asteroid = Entity.define({
    init: function(x, y, velx, vely, size) {
      this.x = x;
      this.y = y;
      this.velx = velx;
      this.vely = vely;
      this.velr = Math.random() * 0.08 - 0.04;
    
      this.u = 0;
      this.v = 0;
      this.velu = Math.random() * 0.25 - 0.5;
      this.velv = Math.random() * 0.25 - 0.5;

      var ti = parseInt(Math.random() * asteroidTextures.length);
      this.texture = textures[asteroidTextures[ti]];

      this.size = size || 4;

      // TODO: maybe make this a method?
      this.boundingRadius = this.size * 7;
      return this;
    },

    spawnChild: function() {
      this.spawner.spawnAsteroid(
          Asteroid.create().init(
              this.x, this.y, utils.random(-1, 1), utils.random(-1, 1), this.size - 1)); 
    }
  });

  Asteroid.prototype.onStep = function() {
    this.u += this.velu;
    this.v += this.velv;
  };

  Asteroid.prototype.onDie = function() {
    if (this.size > 1) {
      this.spawnChild();
      this.spawnChild();
    }
  };

  Asteroid.prototype.onDraw = function(graphics) {
    var self = this;
    graphics.withContext(function(context) {
      context.translate(self.x, self.y);
      context.rotate(self.r);

      context.translate(self.u, self.v);
      graphics.drawCircle(-self.u, -self.v, self.boundingRadius, self.texture);
    });
  };

  return Asteroid;
});
