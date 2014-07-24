define(['./meshes', './entity', './audio', './missile', './bomb', './explosion'], 
    function(meshes, Entity, audio, Missile, Bomb, Explosion) {
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
    this.cannonReloadTime = Ship.TIME_BETWEEN_SHOTS;
    this.cannonRecoil = Ship.SHOT_RECOIL;
    this.cannons = 1;
    this.brakes = false;
    this.bomb = null;
    this.makeInvincible(Ship.RESPAWN_INVINCIBILITY_TIME);
    return this;
  };

  Ship.RESPAWN_INVINCIBILITY_TIME = 80;
  Ship.ROTATION_SPEED = 0.1;
  Ship.TIME_BETWEEN_SHOTS = 8; // TODO: cannon_reload_time
  Ship.MISSILE_RELOAD_TIME = 20;
  Ship.SHOT_RECOIL = 0.2;
  Ship.ACCELERATION = 0.25;

  Ship.prototype.respawn = function(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.makeInvincible(Ship.RESPAWN_INVINCIBILITY_TIME);
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
    if (this.cannonReloadTime > 1) {
      this.cannonReloadTime--;
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
    if (!this.invincible()) {
      this.die();
    }
  };

  Ship.prototype.onDie = function() {
    if (this.bomb !== null) {
      this.bomb.die();
    }
    
    this.spawn(Explosion.create().init(this.x, this.y, 100, 70));
  };

  Ship.prototype.engageThrust = function() { this.thrusting = true; };
  Ship.prototype.disengageThrust = function() { this.thrusting = false; };

  Ship.prototype.startFiring = function() { this.firing = true; }
  Ship.prototype.stopFiring = function() { this.firing = false; }

  Ship.prototype.launchMissile = function() {
    if (this.nextMissileTime < this.aliveTime) {
      this.spawn(
        Missile.create().init(this.x, this.y, this.velx, this.vely, this.r));
      this.nextMissileTime = this.aliveTime + Ship.MISSILE_RELOAD_TIME;
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
    return this.aliveTime < this.invincibleUntil;
  };

  Ship.prototype.makeInvincible = function(length) {
    this.invincibleUntil = this.aliveTime + length;
  };

  Ship.prototype.fire = function(dirOffset) {
    dirOffset = dirOffset || 0;
    var spread = 0.1;
    var bdir = this.r + dirOffset + (Math.random()*spread - (spread/2));
    this.spawn(Bullet.create().init(this.x, this.y, this.velx, this.vely, bdir));

    // recoil
    this.velx += Math.sin(bdir) * this.cannonRecoil;
    this.vely -= Math.cos(bdir) * this.cannonRecoil;
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
        this.fire(0);
      }

      if (this.cannons == 2 || this.cannons == 3) {
        this.fire(-0.1);
        this.fire(0.1);
      }

      audio.play(audio.sounds.shoot2);
    }

    this.timeUntilShot -= 1;
  };
  
  Ship.prototype.onDraw = function(ctx) {
    // TODO: figure out a way to abstract these transformations
    ctx.translate(this.x, this.y);
    ctx.rotate(this.r);
  
    var fillStyle = null;
    if (this.invincible()) {
      fillStyle = this.aliveTime % 2 == 0 ? 'black' : null;
    }

    meshes.ship.draw(ctx, fillStyle);

    if (this.thrusting) {
      meshes.thrust.draw(ctx);
    }
  };
  
  return Ship;
});
