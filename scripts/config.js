// TODO: we really need to abstract distance away from pixels into like "game distance units"

define({
  SIM_FPS: 20,               // How many sim frames per second.
  SIM_DELTA_SEC: 1.0 / 20,   // Time in seconds between each sim frame.
  SIM_DELTA_MS: 1000.0 / 20, // Time in milliseconds between each sim frame.
  
  SHIP_ROTATE_SPEED: 2,     // Radians/sec.
  SHIP_SHOOT_DELAY_MS: 200,
  BULLET_VELOCITY: 15,
  BULLET_TTL_MS: 500,

  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 600 * (9.0 / 16.0)
});
