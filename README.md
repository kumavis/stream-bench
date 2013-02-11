
Benchmark binary streams. Mostly a copy paste of [benchmark/net-pipe](https://github.com/joyent/node/blob/master/benchmark/net-pipe.js)

## Usage

```javascript
var streamBench = require('stream-bench')
  , http        = require('http')
  , fs          = require('fs')

http.get('http://nodejs.org/dist/latest/node-v0.8.19.tar.gz', function (res) {
  var out = fs.createWriteStream('./out')

  var bench = streamBench({
    interval: 100,
    rate:     'mbytes'
  })

  bench.on('rate', function (rate) {
    console.log('rate: ', rate)
  })

  bench.once('report', function (report) {
    console.log(report)
  })

  res.pipe(bench).pipe(out)
})
```

## 
