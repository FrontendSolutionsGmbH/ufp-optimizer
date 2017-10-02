const Helper = require('./Helper')
const path = require('path')
var StatsPrinter = {}

StatsPrinter.getSimpleResultsAsArray = function (results) {

    if (results) {
        return Helper.flatten(results.map(function (module) {
                return StatsPrinter.getModuleResult(module)
            }) || []).sort()
    } else {
        return ' no results'
    }


}

StatsPrinter.getModuleResult = function (moduleResult) {
    var result = []

    if (moduleResult) {
        moduleResult.files.map(function (entry) {
            result.push(path.basename(entry.outputFileName) + ' ' + Math.round(entry.sizeBefore / 1024) + 'kb => ' + Math.round(entry.sizeAfter / 1024) + 'kb (-' + Math.round((entry.sizeBefore - entry.sizeAfter) / 1024) + 'kb ' + Math.round((entry.sizeAfter / entry.sizeBefore) * 100) + '%)' + ' by ' + moduleResult.name + '-' + entry.group);
        })
    }


    return result;
}

module.exports = StatsPrinter