define(['./meshes', './entity'], function(meshes, Entity) {

  var Ship = Entity.subclass();

  Ship.prototype.init = function(x, y) {
    this.x = x;
    this.y = y;
    this.turning = 0;
    this.thrusting = false;
    this.shooting = false;
    this.timeUntilShot = 0;
    this.boundingRadius = 10;
    this.timeUntilNotInvincible = Ship.INVINCIBILITY_TIME;
    return this;
  };

  Ship.prototype.thrust = function(thrusting) {
    this.thrusting = thrusting;
  };

  Ship.prototype.shoot = function(shooting) {
    this.shooting = shooting;
  };

  Ship.prototype.turn = function(direction) {
    this.velr = direction * Ship.ROTATION_SPEED;
  };

  Ship.prototype.invincible = function() {
    return this.timeUntilNotInvincible > 0;
  };

  Ship.prototype.fire = function(dirOffset) {
    dirOffset = dirOffset || 0;
    var spread = 0.1;
    var bdir = this.r + dirOffset + (Math.random()*spread - (spread/2));
    this.spawner.spawnBullet(this.x, this.y, this.velx, this.vely, bdir);

    // recoil
    this.velx += Math.sin(bdir) * Ship.SHOT_RECOIL;
    this.vely -= Math.cos(bdir) * Ship.SHOT_RECOIL;
  };

  Ship.INVINCIBILITY_TIME = 80;
  Ship.ROTATION_SPEED = 0.1;
  Ship.TIME_BETWEEN_SHOTS = 8;
  Ship.SHOT_RECOIL = 0.06;
  Ship.ACCELERATION = 0.35;

  Ship.prototype.onStep = function() {
    if (this.thrusting) {
      this.velx -= Math.sin(this.r) * Ship.ACCELERATION;
      this.vely += Math.cos(this.r) * Ship.ACCELERATION;
    }

    if (this.shooting && this.timeUntilShot <= 0) {
      this.timeUntilShot = Ship.TIME_BETWEEN_SHOTS;
      this.fire(0);
    }

    this.timeUntilShot -= 1;
    this.timeUntilNotInvincible -= 1;
  };
  
  Ship.prototype.onDraw = function(graphics) {
    var self = this;
    graphics.withContext(function(context) {
      // TODO: figure out a way to abstract these transformations
      context.translate(self.x, self.y);
      context.rotate(self.r);
    
      var fillStyle = null;
      if (self.invincible()) {
        fillStyle = self.timeUntilNotInvincible % 2 == 0 ? 'black' : null;
      }

      graphics.drawMesh(meshes.ship, fillStyle);

      if (self.thrusting) {
        graphics.drawMesh(meshes.thrust);
      }
    });
  };
  
  return Ship;
});
