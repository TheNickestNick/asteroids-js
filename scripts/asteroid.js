define(['./entity',], function(Entity) {
  var Asteroid = Entity.define({
    ctor: function(x, y, velx, vely, velr) {
      this.x = x;
      this.y = y;
      this.velx = velx;
      this.vely = vely;
      this.velr = velr;
    },

    draw: function(graphics) {
      var self = this;
      graphics.withContext(function(context) {
        context.translate(self.x, self.y);
        context.rotate(self.r);
        graphics.drawCircle(0, 0, 10, 'brown');
        graphics.drawCircle(5, 0, 1, 'white')
      });
    }
  });

  return Asteroid;
});
