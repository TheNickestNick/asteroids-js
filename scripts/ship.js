define(['./meshes', './bullet'], 
    function(meshes, Bullet) {
  var Ship = function(spawner, x, y) {
    this.x = x;
    this.y = y;
    this.velx = 0;
    this.vely = 0;
    this.rotation = 0;
    this.turning = 0;
    this.thrusting = false;
    this.shooting = false;
    this.timeUntilShot = 0;
    this.spawner = spawner;

    this.boundingRadius = 10;
  };

  Ship.ROTATION_SPEED = 0.1;
  Ship.TIME_BETWEEN_SHOTS = 2;
  Ship.SHOT_RECOIL = 0.03;
  Ship.ACCELERATION = 0.5;

  Ship.prototype.thrust = function(thrusting) {
    this.thrusting = thrusting;
  };

  Ship.prototype.shoot = function(shooting) {
    this.shooting = shooting;
  };

  Ship.prototype.turn = function(direction) {
    this.turning = direction;
  };

  Ship.prototype.update = function() {
    if (this.thrusting) {
      this.velx -= Math.sin(this.rotation) * Ship.ACCELERATION;
      this.vely += Math.cos(this.rotation) * Ship.ACCELERATION;
    }

    if (this.turning > 0) {
      this.rotation += Ship.ROTATION_SPEED;
    }
    else if (this.turning < 0) {
      this.rotation -= Ship.ROTATION_SPEED;
    }

    if (this.shooting && this.timeUntilShot <= 0) {
      this.timeUntilShot = Ship.TIME_BETWEEN_SHOTS;

      var spread = 0.1;
      var bdir = this.rotation + (Math.random()*spread - (spread/2));
      this.spawner.spawnBullet(this.x, this.y, this.velx, this.vely, bdir);

      // recoil
      this.velx += Math.sin(bdir) * Ship.SHOT_RECOIL;
      this.vely -= Math.cos(bdir) * Ship.SHOT_RECOIL;
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

  Ship.prototype.draw = function(graphics) {
    var self = this;
    graphics.withContext(function(context) {
      // TODO: figure out a way to abstract these transformations
      context.translate(self.x, self.y);
      context.rotate(self.rotation);
    
      graphics.drawMesh(meshes.ship);

      if (self.thrusting) {
        graphics.drawMesh(meshes.thrust);
      }
    });
  };

  return Ship;
});
