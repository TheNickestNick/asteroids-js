define(['./entity',], function(Entity) {
  var Asteroid = Entity.define({
    ctor: function(x, y, velx, velx, velr) {
      this.x = x;
      this.y = y;
      this.velx = velx;
      this.vely = vely;
      this.velr = velr;
    },

    draw: function(graphics) {
      graphics.drawCircle(this.x, this.y, 10, 'brown');
    }
  });

  return Asteroid;
});
