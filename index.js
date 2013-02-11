var Transform = require('stream').Transform
  , inherits  = require('util').inherits

// streams2 shim
if (!Transform) {
  Transform = require('readable-stream/transform')
}

function StreamBench(opts) {
  if (!(this instanceof StreamBench)) {
    return new StreamBench(opts)
  }

  Transform.call(this, opts)

  if (!opts) {
    opts = {}
  }

  // since we're extending another class we better wrap our stuff
  this.data = {
    start:    null,
    received: 0,
    rates:    [],
    interval: setInterval(this.emitStats.bind(this), opts.interval || 1000),
    rate:     opts.rate || 'mbits'
  }

  if (!bitsConverters[this.data.rate]) {
    throw new Error('unknown rate ' + this.rate)
  }

  var self = this

  this.once('finish', function () {
    clearInterval(self.data.interval)
    self.emitStats()
    self.report()
  })
}

inherits(StreamBench, Transform)

StreamBench.prototype._transform = function (chunk, outFn, cb) {
  if (!this.data.start) {
    this.data.start = process.hrtime()
  }

  this.data.received += chunk.length

  cb(null, chunk)
}

StreamBench.prototype.emitStats = function () {
  if (!this.data.start) {
    return
  }

  var elapsed = process.hrtime(this.data.start)

  elapsed = elapsed[0] * 1E9 + elapsed[1]

  var converted = bitsConverters[this.data.rate](this.data.received * 8)
    , rate      = converted / elapsed * 1E9

  this.data.rates.push(rate)
  this.emit('rate', rate)

  this.data.start    = process.hrtime()
  this.data.received = 0
}

StreamBench.prototype.report = function () {
  var rates = this.data.rates

  rates.sort()

  var min    = rates[0]
    , max    = rates[rates.length - 1]
    , median = rates[rates.length >> 1]
    , avg    = 0

  for (var i = 0; i < rates.length; i++) {
    avg += rates[i]
  }

  avg /= rates.length

  this.emit('report', {
    min:    min,
    avg:    avg,
    max:    max,
    median: median
  })
}

var bitsConverters = {
  bits: function (bits) {
    return bits
  },
  kbits: function (bits) {
    return bits / 1024
  },
  mbits: function (bits) {
    return bits / (1024 * 1024)
  },
  gbits: function (bits) {
    return bits / (1024 * 1024 * 1024)
  }
}

Object.keys(bitsConverters).forEach(function (rate) {
  var fn = bitsConverters[rate]

  var bytesRate = rate.replace('bits', 'bytes')

  bitsConverters[bytesRate] = function (bits) {
    return fn(bits) / 8
  }
})

module.exports = StreamBench
