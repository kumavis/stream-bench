
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
    metric:   'mbytes'
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

### Options

All the options are passed to the underlying stream, so `lowWaterMark`, `highWaterMark`,
`bufferSize`, etc are all valid.

* `interval`: How often to calculate throughput (in ms). Default `1000`
* `metric`: In what metric to report (`bits`, `kbits`, `mbits`, `gbits`, `bytes`, `kbytes`, `mbytes`, `gbytes`). Default `mbits`
* `logReport`: Whether to log report to stdout. Default `false`
* `dump`: Whether to dump data read from input stream. Useful when you won't pipe to another stream. Default `false`

## TODO

* tests
* custom calculator function (eg for object streams)
