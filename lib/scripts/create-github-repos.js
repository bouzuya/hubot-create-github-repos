// Description
//   A Hubot script to create new repository in GitHub
//
// Configuration:
//   HUBOT_CREATE_GITHUB_REPOS_DEFAULT_USERNAME
//   HUBOT_CREATE_GITHUB_REPOS_TOKEN
//   HUBOT_CREATE_GITHUB_REPOS_OPTIONS
//
// Commands:
//   hubot github create repos [<user>/]<repo> - create new repository in GitHub
//
// Author:
//   bouzuya <m@bouzuya.net>
//
var GitHub, config, parseConfig;

GitHub = require('github');

parseConfig = require('hubot-config');

config = parseConfig('create-github-repos', {
  defaultUsername: null,
  token: null,
  options: '{}'
});

module.exports = function(robot) {
  var pattern;
  if (config.token == null) {
    robot.logger.error('HUBOT_CREATE_GITHUB_REPOS_TOKEN is not defined');
    return;
  }
  config.options = JSON.parse(config.options);
  pattern = /github\s+create\s+repos(?:itory)?\s+(?:(\S+)\/)?(\S+)$/i;
  return robot.respond(pattern, function(res) {
    var github, k, name, options, org, ref, ref1, ref2, v;
    org = (ref = res.match[1]) != null ? ref : config.defaultUsername;
    name = res.match[2];
    github = new GitHub({
      version: '3.0.0'
    });
    github.authenticate({
      type: 'oauth',
      token: config.token
    });
    options = {};
    ref1 = {
      org: org,
      name: name
    };
    for (k in ref1) {
      v = ref1[k];
      options[k] = v;
    }
    ref2 = config.options;
    for (k in ref2) {
      v = ref2[k];
      options[k] = v;
    }
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
