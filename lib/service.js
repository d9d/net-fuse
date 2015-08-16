var pbjs         = require('protobufjs');
var services     = pbjs.loadProtoFile('../protos/services.proto');

var built        = services.build();
var serviceSpecs = {};

function flattenArray(ary, levels) {
  levels || (levels = 1);
  for (var i=1; i<=levels; i++) {
    ary = [].concat.apply([], ary);
  }

  return ary;
}

function wrapServiceTypes(NS, services) {
  var proto = services.__proto__;
  var out   = {};

  Object.keys(proto).forEach(function(service) {
    out[service] = function(data) {

      // ignore actual proto message instances
      if (!data.encode) {
        data =
      }
    };
  });
}

module.exports       = wrapServiceTypes('NS', new built.NetFuse(require('./rpc')));
module.exports.types = built;
module.exports.specs = serviceSpecs;

flattenArray(services.ns.children.filter(function(child) {
  return child.className === 'Service';
})).map(function(service) {
  return service.children.forEach(function(rpc) {
    (serviceSpecs[service.name] || (serviceSpecs[service.name] = {}))[rpc.name] = {
      name          : service.name = '.' + rpc.name,
      requestName   : rpc.requestName,
      responseName  : rpc.responseName,
      requestClass  : built[rpc.requestName],
      responseClass : built[rpc.responseName]
    };
  });
});
