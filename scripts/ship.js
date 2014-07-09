define(['./meshes'], function(meshes) {
  var Ship = function() {
    this.x = 0;
    thix.y = 0;
    this.velx = 0;
    this.vely = 0;
    this.rotation = 0;
    this.thrust = false;
    this.lastShot = 0;
  };

  Ship.ROTATION_SPEED = 0.05;
  Ship.TIME_BETWEEN_SHOTS = 25;

  Ship.prototype.engageThrust = function(engaged) {
    this.thrust = engaged;
  };

  Ship.prototype.update = function() {
    if (this.thrust) {
      this.velx -= Math.sin(this.rotation);
      this.vely += Math.cos(this.rotation);
    }

    this.x += this.velx;
    this.y += this.vely;
  }

  Ship.prototype.rotateLeft = function() {
    this.rotation += Ship.ROTATION_SPEED;
  };

  Ship.prototype.rotateRight = function() {
    this.rotation -= Ship.ROTATION_SPEED;
  };

  Ship.prototype.canShoot = function(time) {
    return this.lastShot + Ship.TIME_BETWEEN_SHOTS < time;
  };

  Ship.prototype.shoot = function(time, spawner) {
    if (this.canShoot(time)) {
      this.lastShot = time;
      return spawner.spawnBullet(this.x, this.y, this.vx, this.vy);
    }
  };

  Ship.prototype.draw = function(graphics) {
    graphics.withContext(function(context) {
      // TODO: figure out a way to abstract these transformations
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
    
      graphics.drawMesh(meshes.ship);

      if (this.thrust) {
        graphics.drawMesh(meshes.thrust);
      }
    });
  };

  return Ship;
});
