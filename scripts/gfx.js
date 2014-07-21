define(function() {
  return {
    circle: function(ctx, x, y, r) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.closePath();
    }
  };
});
