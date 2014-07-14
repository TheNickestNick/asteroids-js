define(['./entity','./textures'], function(Entity, textures) {
  var asteroidTextures = ['rock1', 'rock2', 'rock3', 'rock4'];

  var Asteroid = Entity.define({
    ctor: function(x, y, velx, vely) {
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
    },

    update: function() {
      this.u += this.velu;
      this.v += this.velv;
    },

    draw: function(graphics) {
      var self = this;
      graphics.withContext(function(context) {
        context.translate(self.x, self.y);
        context.rotate(self.r);

        context.translate(self.u, self.v);
        graphics.drawCircle(-self.u, -self.v, 20, self.texture);
      });
    }
  });

  return Asteroid;
});
