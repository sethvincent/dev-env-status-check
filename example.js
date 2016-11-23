var check = require('./index')

var stream = check()

stream.on('data', function (data) {
  if (data.type === 'os') {
    console.log('operating system info:', data)
  } else {
    console.log('status of ' + data.command + ':', data)
  }
})
