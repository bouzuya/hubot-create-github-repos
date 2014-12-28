
var ConfigParser, changeCase;

changeCase = require('change-case');

ConfigParser = (function() {
  function ConfigParser(scriptName, defaults) {
    var k, key, script, v;
    script = changeCase.constantCase(scriptName);
    this.keys = (function() {
      var _results;
      _results = [];
      for (k in defaults) {
        v = defaults[k];
        key = changeCase.constantCase(k);
        _results.push({
          key: k,
          env: "HUBOT_" + script + "_" + key,
          "default": v
        });
      }
      return _results;
    })();
  }

  ConfigParser.prototype.parse = function() {
    return this.keys.reduce(function(config, i) {
      var _ref;
      config[i.key] = (_ref = process.env[i.env]) != null ? _ref : i["default"];
      return config;
    }, {});
  };

  return ConfigParser;

})();

module.exports = function(scriptName, defaults) {
  return new ConfigParser(scriptName, defaults).parse();
};

module.exports.ConfigParser = ConfigParser;
