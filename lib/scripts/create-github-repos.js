// Description
//   A Hubot script to create new repository in GitHub
//
// Configuration:
//   HUBOT_CREATE_GITHUB_REPOS_DEFAULT_USERNAME
//   HUBOT_CREATE_GITHUB_REPOS_TOKEN
//
// Commands:
//   hubot github create repos [<user>/]<repo> - create new repository in GitHub
//
// Author:
//   bouzuya <m@bouzuya.net>
//
var GitHub, config, parseConfig;

GitHub = require('github');

parseConfig = require('../config');

config = parseConfig('create-github-repos', {
  defaultUsername: null,
  token: null
});

module.exports = function(robot) {
  var pattern;
  if (config.token == null) {
    robot.logger.error('HUBOT_CREATE_GITHUB_REPOS_TOKEN is not defined');
    return;
  }
  pattern = /github\s+create\s+repos(?:itory)?\s+(?:(\S+)\/)?(\S+)$/i;
  return robot.respond(pattern, function(res) {
    var github, name, options, org, _ref;
    org = (_ref = res.match[1]) != null ? _ref : config.defaultUsername;
    name = res.match[2];
    github = new GitHub({
      version: '3.0.0'
    });
    github.authenticate({
      type: 'oauth',
      token: config.token
    });
    options = {
      org: org,
      name: name
    };
    return github.repos.createFromOrg(options, function(err, data) {
      if (err != null) {
        robot.logger.error(err);
        res.send('hubot-create-github-repos: error');
        return;
      }
      return res.send("created: " + data.html_url);
    });
  });
};
