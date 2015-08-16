var FDs = [null];

module.exports = {
  getFD : function(path){
    return FDs.push(path) - 1;
  }

  , getPath : function(fd){
    return FDs[fd] || '';
  }

  , closeFD : function(fd){
    FDs[fd] = null;
  }
};
