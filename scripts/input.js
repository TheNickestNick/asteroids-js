define(function() {
  var Keys = { SPACE: 32, RIGHT: 37, UP: 38, LEFT: 39, DOWN: 40, F: 70, B: 66 };

  var input = {};
  input.init = function(game) {
    this.game = game;
    this.pressed = {};

    document.body.addEventListener('keydown', input.keyDown.bind(this));
    document.body.addEventListener('keyup', input.keyUp.bind(this));
  };

  input.keyDown = function(event) {
    if (!this.pressed[event.which]) {
      this.keyPress(event);
      this.pressed[event.which] = true;
    }
  };

  //TODO: these should not be interacting with game.ship directly!
  input.keyPress = function(event) {
    if (event.which == Keys.SPACE) {
      this.game.ship.startFiring();
    }
    else if (event.which == Keys.RIGHT) {
      this.game.ship.turn(-1);
    }
    else if (event.which == Keys.LEFT) {
      this.game.ship.turn(1);
    }
    else if (event.which == Keys.UP) {
      this.game.ship.engageThrust();
    }
    else if (event.which == Keys.F) {
      this.game.ship.launchMissile(); 
    }
    else if (event.which == Keys.B) {
      this.game.ship.dropOrDetonateBomb();
    }
  }

  input.keyUp = function(event) {
    this.pressed[event.which] = false;

    if (event.which == Keys.SPACE) {
      if (this.game.ship) {
        this.game.ship.stopFiring();
      }
    }
    else if (event.which == Keys.RIGHT) {
      if (this.game.ship) {
        this.game.ship.turn(1);
      }
    }
    else if (event.which == Keys.LEFT) {
      if (this.game.ship) {
        this.game.ship.turn(-1);
      }
    }
    else if (event.which == Keys.UP) {
      if (this.game.ship) {
        this.game.ship.disengageThrust();
      }
    }
  };

  return input;
});
