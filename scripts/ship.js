define(['./meshes', './entity', './audio', './missile', './bomb', './explosion', './utils'], 
    function(meshes, Entity, audio, Missile, Bomb, Explosion, utils) {
  var Ship = Entity.subclass();

  Ship.prototype.init = function(x, y) {
    this.x = x;
    this.y = y;
    this.turning = 0;
    this.thrusting = false;
    this.firing = false;
    this.timeUntilShot = 0;
    this.nextMissileTime = 0;
    this.boundingRadius = 10;
    this.cannonReloadTime = 15;
    this.cannonRecoil = 0.1;
    this.cannons = 1;
    this.cannonSpread = 0.08;
    this.bulletTTL = 30;
    this.brakes = false;
    this.bomb = null;
    this.makeInvincible(Ship.RESPAWN_INVINCIBILITY_TIME);
    return this;
  };

  Ship.RESPAWN_INVINCIBILITY_TIME = 80;
  Ship.ROTATION_SPEED = 0.1;
  Ship.MISSILE_RELOAD_TIME = 20;
  Ship.ACCELERATION = 0.25;

  Ship.prototype.respawn = function(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.velx = 0;
    this.vely = 0;
    this.makeInvincible(Ship.RESPAWN_INVINCIBILITY_TIME);
  };

  Ship.prototype.increaseCannonAccuracy = function(amount) {
    this.cannonSpread -= amount;
    if (this.cannonSpread < 0) {
      this.cannonSpread = 0
    }
  };

  Ship.prototype.increaseCannonRange = function(amount) {
    this.bulletTTL += amount;
  };

  Ship.prototype.enableBrakes = function() {
    this.brakes = true;
  };

  Ship.prototype.decreaseRecoil = function() {
    this.cannonRecoil -= 0.04;
    if (this.cannonRecoil < 0) {
      this.cannonRecoil = 0;
    }
  };

  Ship.prototype.decreaseReload = function() {
    this.cannonReloadTime *= 0.7;

    if (this.cannonReloadTime < 1) {
      this.cannonReloadTime = 1;
    }
  };

  Ship.prototype.addCannon = function() {
    if (this.cannons < 3) {
      this.cannons++;
    }
  };

  Ship.prototype.onCollision = function(other) {
    other.onCollideWithShip(this);
  };

  Ship.prototype.onCollideWithAsteroid = function(asteroid) {
    this.die();
  };

  Ship.prototype.onDie = function() {
    if (this.invincible()) {
      return false;
    }

    if (this.bomb !== null) {
      this.bomb.die();
    }
    
    this.spawn(Explosion.create().init(this.x, this.y, 100, 80));
    audio.play(audio.sounds.crash);
  };

  Ship.prototype.engageThrust = function() { this.thrusting = true; };
  Ship.prototype.disengageThrust = function() { this.thrusting = false; };

  Ship.prototype.startFiring = function() { this.firing = true; }
  Ship.prototype.stopFiring = function() { this.firing = false; }

  Ship.prototype.launchMissile = function() {
    if (this.nextMissileTime < this.time) {
      this.spawn(
        Missile.create().init(this.x, this.y, this.velx, this.vely, this.r));
      this.nextMissileTime = this.time + Ship.MISSILE_RELOAD_TIME;
      audio.play(audio.sounds.missile);
    }
  };

  Ship.prototype.dropOrDetonateBomb = function() {
    if (this.bomb !== null) {
      this.bomb.detonate();
      this.bomb = null;
    }
    else {
      this.bomb = Bomb.create().init(this.x, this.y, this.velx, this.vely);
      this.spawn(this.bomb);
    }
  };

  Ship.prototype.turn = function(direction) {
    this.velr += direction * Ship.ROTATION_SPEED;
  };

  Ship.prototype.invincible = function() {
    return this.time < this.invincibleUntil;
  };

  Ship.prototype.makeInvincible = function(length) {
    this.invincibleUntil = this.time + length;
  };

  Ship.prototype.fireCannon = function(posOffset, dirOffset) {
    var x = this.x + posOffset * Math.cos(-this.r);
    var y = this.y - posOffset * Math.sin(-this.r);
    var dir = this.r + dirOffset + utils.random(-this.cannonSpread, this.cannonSpread);
    this.spawn(Bullet.create().init(x, y, this.velx, this.vely, dir, this.bulletTTL));
  };

  Ship.prototype.onStep = function() {
    if (this.thrusting) {
      this.velx -= Math.sin(this.r) * Ship.ACCELERATION;
      this.vely += Math.cos(this.r) * Ship.ACCELERATION;
    }
    else if (this.brakes) {
      this.velx = 0;
      this.vely = 0;
    }

    if (this.firing && this.timeUntilShot <= 0) {
      this.timeUntilShot = this.cannonReloadTime;

      if (this.cannons == 1 || this.cannons == 3) {
        this.fireCannon(0, 0);
      }

      if (this.cannons == 2 || this.cannons == 3) {
        this.fireCannon(0, 0.1);
        this.fireCannon(0, -0.1);
      }

      // recoil
      this.velx += Math.sin(this.r) * this.cannonRecoil * this.cannons;
      this.vely -= Math.cos(this.r) * this.cannonRecoil * this.cannons;

      audio.play(audio.sounds.shoot);
    }

    this.timeUntilShot -= 1;
  };
  
  Ship.prototype.onDraw = function(ctx) {
    // TODO: figure out a way to abstract these transformations
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r);
  
    var fillStyle = null;
    if (this.invincible()) {
      fillStyle = this.time % 2 == 0 ? 'black' : null;
    }

    meshes.ship.draw(ctx, fillStyle);

    if (this.thrusting) {
      meshes.thrust.draw(ctx);
    }
  };
  
  return Ship;
});
