define(['./wrappable', './utils'], function(Wrappable, utils) {
  function Bullet(x, y, velx, vely, direction) {
    this.x = x;
    this.y = y;
    this.velx = velx - Math.sin(direction) * Bullet.VELOCITY;
    this.vely = vely + Math.cos(direction) * Bullet.VELOCITY;
    this.ttl = Bullet.TTL;
  };
  utils.mixin(Wrappable, Bullet);

  Bullet.VELOCITY = 10;
  Bullet.TTL = 30; // Frames to live

  // TODO: find a way to consolidate this with the update in the ship class.
  // Possibilities: 
  //  base class with extends-like semantics (and override)
  //  mixin with "updatePosition" method or "move" method
  //  mixin that overrides update method
  Bullet.prototype.update = function() {
    this.x += this.velx;
    this.y += this.vely;
    this.ttl -= 1;
  };

  Bullet.prototype.shouldDie = function() {
    return this.ttl <= 0;
  };

  Bullet.prototype.draw = function(graphics) {
    graphics.drawCircle(this.x, this.y, 1.5, 'white');
  };

  // TODO: make this freelist thing generic
  Bullet.instances = [];
  Bullet.MAX_INSTANCES = 30;

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

