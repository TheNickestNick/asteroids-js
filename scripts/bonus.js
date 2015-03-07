define(['./entity', './gfx', './utils', './array', './audio'], 
    function(Entity, gfx, utils, array, audio) {
  var Bonus = Entity.subclass(function() {
    this.type = 0;
    this.boundingRadius = 13;
    this.layer = 1;
  });

  Bonus.MIN_TTL = 400;
  Bonus.MAX_TTL = 800;

  Bonus.TYPES = [{
      color: 'red', text: 'cannon reload time decreased',
      apply: function(ship) { ship.decreaseReload(); }
    }, {
      color: 'red', text: 'additional cannon',
      apply: function(ship) { ship.addCannon(); }
    }, {
      color: 'red', text: 'cannon range increased',
      apply: function(ship) { ship.increaseCannonRange(10); }
    }, {
      color: 'red', text: 'cannon accuracy increased',
      apply: function(ship) { ship.increaseCannonAccuracy(0.02); }
    }, {
      color: 'blue', text: 'cannon recoil decreased',
      apply: function(ship) { ship.decreaseRecoil(); }
    }, {
      color: 'blue', text: 'inertial brakes enabled',
      apply: function(ship) { ship.enableBrakes(); }
    }];

  Bonus.prototype.init = function(x, y) {
    this.x = x;
    this.y = y;
    this.velx = utils.random(-3, 3); 
    this.vely = utils.random(-3, 3); 
    this.ttl = utils.random(Bonus.MIN_TTL, Bonus.MAX_TTL);
    this.type = array.random(Bonus.TYPES);
    return this;
  };

  Bonus.prototype.onDraw = function(ctx) {
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI/4);

    ctx.save();
    ctx.rotate(-this.time * 0.12);
    ctx.beginPath();
    ctx.rect(-6, -6, 12, 12);
    ctx.closePath();
    ctx.fillStyle = this.type.color;
    ctx.fill();
    ctx.restore();

    // TODO: add flicker when about to die
    ctx.save();
    ctx.rotate(this.time * 0.12);
    ctx.beginPath();
    ctx.rect(-12, -12, 24, 24);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.type.color;
    ctx.stroke();
    ctx.restore();
  };

  Bonus.prototype.onCollideWithShip = function(ship) {
    this.type.apply(ship, this.game);
    this.game.alert(this.type.text);
    this.die();
    audio.play(audio.sounds.bonus2);
  };

  return Bonus;
});
