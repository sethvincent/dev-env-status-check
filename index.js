var os = require('os')
var exec = require('child_process').exec
var exists = require('command-exists')
var through = require('through2')
var each = require('each-async')
var osName = require('os-name')
var which = require('which')
var xtend = require('xtend')

module.exports = function devEnvStatusCheck (options) {
  var stream = through.obj()

  var osInfo = {
    type: 'os',
    arch: os.arch(),
    platform: os.platform(),
    release: os.release(),
    name: osName(os.platform(), os.release())
  }

  stream.write(osInfo)

  var tools = {
    node: {
      versionFormat: function (str) {
        return str.split('v')[1]
      }
    },
    npm: {
      versionFormat: function (str) {
        return str
      }
    },
    git: {
      versionFormat: function (str) {
        return str.split('git version ')[1]
      }
    }
  }

  var keys = Object.keys(tools)

  each(keys, function (key, i, next) {
    var opts = tools[key]
    check(key, opts, function (status) {
      stream.write(xtend(status))
      next()
    })
  }, function () {
    stream.end()
  })

  return stream
}

function check (tool, opts, callback) {
  var versionCmd = opts.versionCommand || tool + ' --version'
  var versionFormat = opts.versionFormat || function (str) { return str }

  var status = {
    type: 'command',
    command: tool
  }

  exists(tool, function (err, ok) {
    if (err) return error(status, tool, err, callback)

    if (ok) {
      status.exists = true
      which(tool, function (err, cmdpath) {
        if (err) return error(status, tool, err, callback)

        status.path = cmdpath
        exec(versionCmd, function (err, stdout, stderr) {
          if (err) return error(status, tool, err, callback)

          status.version = versionFormat(stdout.split('\n')[0])
          callback(status)
        })
      })
    } else {
      status.exists = false
      callback(status)
    }
  })
}

function error (status, property, err, cb) {
  status[property].err = err
  cb(status)
}
