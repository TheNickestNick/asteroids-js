// TODO: rename this whole things "vars" or something like that
define(function() {
  if (!('asteroids' in window)) {
    window.asteroids = {
    };
  }

  return {
    vars: window.debug_vars,
    define: function(name, def) {
      if (!(name in window.asteroids)) {
        window.asteroids[name] = def;
      }
    }
  };
});
