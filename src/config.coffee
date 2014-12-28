changeCase = require 'change-case'

class ConfigParser
  constructor: (scriptName, defaults) ->
    script = changeCase.constantCase(scriptName)
    @keys = for k, v of defaults
      key = changeCase.constantCase(k)
      key: k
      env: "HUBOT_#{script}_#{key}"
      default: v

  parse: ->
    @keys.reduce (config, i) ->
      config[i.key] = process.env[i.env] ? i.default
      config
    , {}

module.exports = (scriptName, defaults) ->
  new ConfigParser(scriptName, defaults).parse()

module.exports.ConfigParser = ConfigParser
