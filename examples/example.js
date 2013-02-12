var streamBench = require('stream-bench')
  , http        = require('http')
  , fs          = require('fs')

http.get('http://nodejs.org', function (res) {
  var out = fs.createWriteStream('./out')

  var bench = streamBench({
    interval:  100,
    metric:    'mbytes',
    logReport: true
  })

  bench.on('rate', function (rate) {
    console.log('rate: ', rate)
  })

  res.pipe(bench).pipe(out)
})
