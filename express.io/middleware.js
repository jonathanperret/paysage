var _, configs, regex;

_ = require('underscore');

regex = {
  single: /\/([^\/]+)\/?/,
  doubleOptional: /\/([^\/]+)(?:\/([^\/]+)\/?)?/,
  double: /\/([^\/]+)\/([^\/]+)\/?/
};

configs = {
  backbone: {
    create: {
      method: 'post',
      regex: regex.single
    },
    read: {
      method: 'get',
      regex: regex.doubleOptional,
      variables: ['id']
    },
    update: {
      method: 'put',
      regex: regex.double,
      variables: ['id']
    },
    "delete": {
      method: 'delete',
      regex: regex.double,
      variables: ['id']
    }
  },
  angular: {
    list: {
      method: 'get',
      regex: regex.single
    },
    create: {
      method: 'post',
      regex: regex.single
    },
    read: {
      method: 'get',
      regex: regex.double,
      variables: ['id']
    },
    update: {
      method: 'put',
      regex: regex.double,
      variables: ['id']
    },
    "delete": {
      method: 'delete',
      regex: regex.double,
      variables: ['id']
    }
  }
};

configs.backbonjs = configs.backbone;

configs.angularjs = configs.angular;

exports.routeForward = function(options) {
  if (!_.isObject(options.config)) {
    options.type = options.config;
    options.config = configs[options.type];
    if (options.config == null) {
      throw new Error("RouteForwardError: No config for " + options.type);
    }
  }
  return function(request, response, next) {
    var index, match, meta, ref, ref1, route, variable;
    ref = options.config;
    for (route in ref) {
      meta = ref[route];
      if (meta.method === request.method.toLowerCase()) {
        match = meta.regex.exec(request.url);
        if (match != null) {
          if (meta.variables == null) {
            meta.variables = [];
          }
          if (request.params == null) {
            request.params = {};
          }
          ref1 = meta.variables;
          for (index in ref1) {
            variable = ref1[index];
            request.params[variable] = match[2 + parseInt(index)];
          }
          return request.io.route(match[1] + ":" + route);
        }
      }
    }
    return next();
  };
};