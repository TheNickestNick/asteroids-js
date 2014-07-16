// TODO: add support for more than just lineTo in paths.
define(function() {
  return {
    ship: {
      type: 'fill',
      style: 'red',
      translate: [0, -7],
      scale: 1.4,
      path: [[0, 22], [-10, 0], [10, 0]]
    },

    thrust: {
      type: 'fill',
      style: 'yellow',
      translate: [0, -7],
      path: [[0, -5], [5, 0], [-5, 0]]
    }
  }
});
