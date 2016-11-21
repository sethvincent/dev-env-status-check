var os = require('os')
var exec = require('child_process').exec
var exists = require('command-exists')
var which = require('which')
var osName = require('os-name')

module.exports = function (opts, done) {
  var status = {
    os: {
      arch: os.arch(),
      platform: os.platform(),
      release: os.release(),
      name: osName(os.platform(), os.release())
    },
    node: {},
    npm: {},
    git: {},
    atom: {},
    homebrew: {}
  }

 // TODO: clean up this nesting. preferably turn into a stream, emit data event for each command check
  checkNode(status, function () {
    checkNpm(status, function () {
      checkGit(status, function () {
        checkAtom(status, function () {
          checkHomebrew(status, function () {
            done(status)
          })
        })
      })
    })
  })

  // TODO: light refactor to remove repetitive code in check functions
  // TODO: better error reporting

  function error (status, property, err, cb) {
    status[property].err = err
    cb()
  }

  function checkNode (status, callback) {
    exists('node', function (err, ok) {
      if (err) return error(status, 'node', err, callback)

      if (ok) {
        status.node.exists = true
        which('node', function (err, cmdpath) {
          if (err) return error(status, 'node', err, callback)

          status.node.path = cmdpath
          exec('node --version', (err, stdout, stderr) => {
            if (err) return error(status, 'node', err, callback)

            status.node.version = stdout.split('\n')[0]
            callback()
          })
        })
      } else {
        status.node.exists = false
        callback()
      }
    })
  }

  function checkNpm (status, callback) {
    exists('npm', function (err, ok) {
      if (err) return error(status, 'npm', err, callback)

      if (ok) {
        status.npm.exists = true
        which('npm', function (err, cmdpath) {
          if (err) return error(status, 'npm', err, callback)

          status.npm.path = cmdpath
          exec('npm --version', (err, stdout, stderr) => {
            if (err) return error(status, 'npm', err, callback)

            status.npm.version = stdout.split('\n')[0]
            callback()
          })
        })
      } else {
        status.npm.exists = false
        callback()
      }
    })
  }

  function checkGit (status, callback) {
    exists('git', function (err, ok) {
      if (err) return error(status, 'git', err, callback)

      if (ok) {
        status.git.exists = true
        which('git', function (err, cmdpath) {
          if (err) return error(status, 'git', err, callback)

          status.git.path = cmdpath
          exec('git --version', (err, stdout, stderr) => {
            if (err) return error(status, 'git', err, callback)

            stdout = stdout.split('git version ')[1]
            status.git.version = stdout.split('\n')[0]
            callback()
          })
        })
      } else {
        status.git.exists = false
        callback()
      }
    })
  }

  function checkAtom (status, callback) {
    if (opts.skipAtom) return callback()

    exists('atom', function (err, ok) {
      if (err) return error(status, 'atom', err, callback)

      if (ok) {
        status.atom.exists = true
        which('atom', function (err, cmdpath) {
          if (err) return error(status, 'atom', err, callback)

          status.atom.path = cmdpath
          exec('atom --version', (err, stdout, stderr) => {
            if (err) return error(status, 'atom', err, callback)

            stdout = stdout.split('Atom    : ')[1]
            status.atom.version = stdout.split('\n')[0]
            callback()
          })
        })
      } else {
        status.atom.exists = false
        callback()
      }
    })
  }

  function checkHomebrew (status, callback) {
    if (!status.os.platform === 'darwin' || opts.skipHomebrew) return callback()

    exists('brew', function (err, ok) {
      if (err) return error(status, 'homebrew', err, callback)

      if (ok) {
        status.homebrew.exists = true
        which('brew', function (err, cmdpath) {
          if (err) return error(status, 'homebrew', err, callback)

          status.homebrew.path = cmdpath
          exec('brew --version', (err, stdout, stderr) => {
            if (err) return error(status, 'homebrew', err, callback)

            stdout = stdout.split('Homebrew ')[1]
            status.homebrew.version = stdout.split('\n')[0]
            callback()
          })
        })
      } else {
        status.atom.exists = false
        callback()
      }
    })
  }

  return status
}
