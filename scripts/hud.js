define(['./meshes'], function(meshes) {
  return {
    draw: function(ctx, game) {
      ctx.save();
      ctx.translate(game.width - 3, 0);
      ctx.rotate(Math.PI);
      ctx.scale(0.8, 0.8);
      ctx.translate(0, -34);

      for (var i = 0; i < game.lives; i++) {
        ctx.translate(20, 0);
        meshes.ship.draw(ctx, 'white');
        ctx.translate(12, 0);
      }

      ctx.restore();

      // TODO: generalize text drawing into gfx class
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.font = '22px Verdana';
      var textSize = ctx.measureText(game.points);
      ctx.fillText(game.points, game.width - textSize.width - 8, 58);
      ctx.restore();

      if (game.over()) {
        ctx.save();
        ctx.fillStyle = 'red';
        ctx.font = '50px Courier New';
        var textSize = ctx.measureText('game over');
        ctx.fillText('game over', game.width/2 - textSize.width/2, game.height/2);
        ctx.restore();
      }
    }
  };
});
