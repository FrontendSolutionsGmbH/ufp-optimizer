var Logger = {}
const winston = require('winston')

winston.cli()

Logger.info = function () {
    winston.info.apply(this, arguments)
}

Logger.debug = function () {
    winston.debug.apply(this, arguments)
}

Logger.error = function () {
    winston.error.apply(this, arguments)
}

Logger.setLevel = function (level) {
    winston.level = level
}

module.exports = Logger
