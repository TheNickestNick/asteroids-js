define(['./meshes', './bullet'], 
    function(meshes, Bullet) {
  var Ship = function(x, y) {
    this.x = x;
    this.y = y;
    this.velx = 0;
    this.vely = 0;
    this.rotation = 0;
    this.thrust = false;
    this.timeUntilShot = 0;

    this.boundingRadius = 10;
  };

  Ship.ROTATION_SPEED = 0.05;
  Ship.TIME_BETWEEN_SHOTS = 2;
  Ship.SHOT_RECOIL = 0.1;
  Ship.ACCELERATION = 0.5;

  Ship.prototype.engageThrust = function(engaged) {
    this.thrust = engaged;
  };

  Ship.prototype.update = function() {
    if (this.thrust) {
      this.velx -= Math.sin(this.rotation) * Ship.ACCELERATION;
      this.vely += Math.cos(this.rotation) * Ship.ACCELERATION;
    }

    this.x += this.velx;
    this.y += this.vely;
    this.timeUntilShot -= 1;
  }

  Ship.prototype.wrap = function(w, h) {
    while (this.x > w) { this.x -= w; }
    while (this.x < 0) { this.x += w; }
    while (this.y > h) { this.y -= h; }
    while (this.y < 0) { this.y += h; }
  };

  Ship.prototype.rotateLeft = function() {
    this.rotation += Ship.ROTATION_SPEED;
  };

  Ship.prototype.rotateRight = function() {
    this.rotation -= Ship.ROTATION_SPEED;
  };

  Ship.prototype.shoot = function() {
    if (this.timeUntilShot <= 0) {
      this.timeUntilShot = Ship.TIME_BETWEEN_SHOTS;

      var spread = 0.1;
      var bdir = this.rotation + (Math.random()*spread - (spread/2));
      var bullet = Bullet.create(this.x, this.y, this.velx, this.vely, bdir);

      // recoil
      this.velx += Math.sin(bdir) * Ship.SHOT_RECOIL;
      this.vely -= Math.cos(bdir) * Ship.SHOT_RECOIL;
      return bullet;
    }
  };

  Ship.prototype.draw = function(graphics) {
    var self = this;
    graphics.withContext(function(context) {
      // TODO: figure out a way to abstract these transformations
      context.translate(self.x, self.y);
      context.rotate(self.rotation);
    
      graphics.drawMesh(meshes.ship);

      if (self.thrust) {
        graphics.drawMesh(meshes.thrust);
      }
    });
  };

  return Ship;
});
