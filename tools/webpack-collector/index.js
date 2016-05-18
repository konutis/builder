var ServicesCollector = require('./lib/services-collector')
var ModulesCollector = require('./lib/modules-collector')
var AttributesCollector = require('./lib/attributes-collector')
var ElementsCollector = require('./lib/elements-collector')
var Collector = function () {
}
Collector.prototype.apply = function (compiler) {
  compiler.plugin('run', function (params) {
    console.log('Collect elements')
    console.log('Collect services/modules/attributes')
    Object.keys(params.options.vc).forEach(function (prefix) {
      console.log('Build data for ' + prefix)
      var settings = params.options.vc[ prefix ]
      if (settings.services) {
        ServicesCollector.buildFile(prefix, settings.services)
      }
      if (settings.modules) {
        ModulesCollector.buildFile(prefix, settings.modules)
      }

      AttributesCollector.buildFile(prefix)
      ElementsCollector.buildFile()
    })
  })
}

module.exports = Collector
