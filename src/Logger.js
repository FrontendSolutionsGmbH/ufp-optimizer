var Logger = {}
const winston = require('winston')

winston.cli()

Logger.info = function () {
    //winston.info.apply(this, arguments)
    if (winston.level === 'info' || winston.level === 'debug') {
        console.info.apply(this, arguments)
    }
}

Logger.debug = function () {
    // winston.debug.apply(this, arguments)
    if (winston.level === 'debug') {
        console.log.apply(this, arguments)
    }
}

Logger.error = function () {
    if (winston.level === 'info' || winston.level === 'debug') {
        winston.error.apply(this, arguments)
    }
}

Logger.setLevel = function (level) {
    winston.level = level
}


Logger.infoTable = function (result) {
    if (winston.level === 'info' || winston.level === 'debug') {
        require('console.table')
        console.table(result)
    }
}


module.exports = Logger
