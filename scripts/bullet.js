define(['./entity'], function(Entity) {
  Bullet = Entity.define({
    ctor: function(x, y, velx, vely, direction) {
      this.x = x;
      this.y = y;
      this.velx = velx - Math.sin(direction) * Bullet.VELOCITY;
      this.vely = vely + Math.cos(direction) * Bullet.VELOCITY;
      this.ttl = Bullet.TTL;
    }
  });

  Bullet.VELOCITY = 10;
  Bullet.TTL = 50; // Frames to live

  Bullet.prototype.draw = function(graphics) {
    graphics.drawCircle(this.x, this.y, 1.5, 'white');
  };

  // TODO: make this freelist thing generic
  Bullet.instances = [];
  Bullet.MAX_INSTANCES = 100;

  Bullet.create = function() {
    if (Bullet.instances.length < Bullet.MAX_INSTANCES) {
      var inst = new Bullet();
      Bullet.apply(inst, arguments);
      inst.__free = false;
      Bullet.instances.push(inst);
      return inst;
    }
    else {
      for (var i = 0; i < Bullet.instances.length; i++) {
        var inst = Bullet.instances[i];
        if (inst.__free) {
          Bullet.apply(inst, arguments);
          inst.__free = false;
          return inst;
        }
      }

      throw new Error("Cannot create instance. Too many instances already allocated.");
    }
  };


  Bullet.prototype.free = function() {
    this.__free = true;
  };

  return Bullet;
});

