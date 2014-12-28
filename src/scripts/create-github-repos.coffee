# Description
#   A Hubot script to create new repository in GitHub
#
# Configuration:
#   HUBOT_CREATE_GITHUB_REPOS_DEFAULT_USERNAME
#   HUBOT_CREATE_GITHUB_REPOS_TOKEN
#
# Commands:
#   hubot github create repos [<user>/]<repo> - create new repository in GitHub
#
# Author:
#   bouzuya <m@bouzuya.net>
#
GitHub = require 'github'
parseConfig = require '../config'

config = parseConfig 'create-github-repos',
  defaultUsername: null
  token: null

module.exports = (robot) ->
  unless config.token?
    robot.logger.error('HUBOT_CREATE_GITHUB_REPOS_TOKEN is not defined')
    return

  pattern = /github\s+create\s+repos(?:itory)?\s+(?:(\S+)\/)?(\S+)$/i
  robot.respond pattern, (res) ->
    org = res.match[1] ? config.defaultUsername
    name = res.match[2]

    github = new GitHub(version: '3.0.0')
    github.authenticate(type: 'oauth', token: config.token)
    options = { org, name }
    github.repos.createFromOrg options, (err, data) ->
      if err?
        robot.logger.error(err)
        res.send('hubot-create-github-repos: error')
        return
      res.send("created: #{data.html_url}")
