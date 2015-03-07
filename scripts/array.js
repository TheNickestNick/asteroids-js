define(function() {
  return {
    remove: function(arr, i) {
      if (i < 0 || i >= arr.length) {
        throw new Error('Tried to remove index that was out of bounds.');
      }
      arr[i] = arr[arr.length-1];
      arr.length--;
    },

    random: function(arr) {
      if (arr.length === 0) {
        throw new Error('No elements in array.');
      }

      var index = Math.random() * arr.length;
      return arr[index >>> 0];
    },
  };
})
