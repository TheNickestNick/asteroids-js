define(function() {
  if (!('debug_vars' in window)) {
    window.debug_vars = {
    };
  }

  return {
    vars: window.debug_vars,
    define: function(name, def) {
      if (!(name in window.debug_vars)) {
        window.debug_vars[name] = def;
      }
    }
  };
});
