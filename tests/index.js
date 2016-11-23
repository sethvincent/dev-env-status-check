var test = require('tape')

var check = require('../index')

test('get os info, node, npm, and git', function (t) {
  var stream = check()
  var osStatus
  var tools = []

  stream.on('data', function (data) {
    if (data.type === 'os') {
      osStatus = data
    } else {
      if (data.exists) tools.push(data)
    }
  })

  stream.on('end', function () {
    t.ok(osStatus)
    t.equal(tools.length, 3)
    t.end()
  })
})
