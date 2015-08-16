module.exports = {
  handler  : function(path) {
    return {
      path : path
    };
  }
  , consolidate : function(results) {
    var hash = {};

    results.forEach(function(files){
      files.forEach(function(file){
        hash[file] = 1;
      });
    });

    return Object.keys(hash);
  }
  , 'mode' : 'read'
};
