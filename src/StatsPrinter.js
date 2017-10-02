const Helper = require('./Helper')
const path = require('path')
var StatsPrinter = {}

StatsPrinter.getSimpleDetailsResultsAsArray = function (results) {

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

var getResultsAdvanced = function (results) {

    var inputFiles = {};
    var outputFiles = {};

    results.map(function (moduleResult) {
        if (moduleResult) {
            moduleResult.files.map(function (entry) {
                var key = entry.inputFileName
                if (inputFiles[key]) {
                    inputFiles[key].entries.push(entry)
                    if (entry.sizeBefore < inputFiles[key].sizeBeforeSmallest) {
                        inputFiles[key].sizeBeforeSmallest = entry.sizeBefore
                    }
                    if (entry.sizeAfter < inputFiles[key].sizeAfterSmallest) {
                        inputFiles[key].sizeAfterSmallest = entry.sizeAfter
                    }
                    if (entry.sizeBefore > inputFiles[key].sizeBeforeLargest) {
                        inputFiles[key].sizeBeforeLargest = entry.sizeBefore
                    }
                    if (entry.sizeAfter > inputFiles[key].sizeAfterLargest) {
                        inputFiles[key].sizeAfterLargest = entry.sizeAfter
                    }
                } else {
                    inputFiles[key] = {
                        sizeBeforeSmallest: entry.sizeBefore,
                        sizeAfterSmallest: entry.sizeAfter,
                        sizeBeforeLargest: entry.sizeBefore,
                        sizeAfterLargest: entry.sizeAfterLargest,
                        inputFileName: key,
                        entries: [entry]
                    }
                }
            })

            moduleResult.files.map(function (entry) {
                var key2 = entry.outputFileName
                if (outputFiles[key2]) {
                    outputFiles[key2].entries.push(entry)
                    if (entry.sizeBefore < outputFiles[key2].sizeBeforeSmallest) {
                        outputFiles[key2].sizeBeforeSmallest = entry.sizeBefore
                    }
                    if (entry.sizeAfter < outputFiles[key2].sizeAfterSmallest) {
                        outputFiles[key2].sizeAfterSmallest = entry.sizeAfter
                    }
                } else {
                    outputFiles[key2] = {
                        sizeBeforeSmallest: entry.sizeBefore,
                        sizeAfterSmallest: entry.sizeAfter,
                        sizeBeforeLargest: entry.sizeBefore,
                        sizeAfterLargest: entry.sizeAfterLargest,
                        outputFileName: key2,
                        entries: [entry]
                    }
                }

            })

            Object.keys(outputFiles).map(function (key) {
                var entry = outputFiles[key]
                entry.sizeBeforeLargestTotal = entry.entries.reduce(function (sizeBeforeLargestTotal, entry) {
                    var iName = entry.inputFileName
                    if (inputFiles[iName].sizeBeforeLargest > sizeBeforeLargestTotal) {
                        return inputFiles[iName].sizeBeforeLargest
                    } else {
                        return sizeBeforeLargestTotal
                    }
                }, -1)
            })

        }
    })


    return {
        results: results,
        inputFiles: inputFiles,
        outputFiles: outputFiles
    }

}

StatsPrinter.getSummaryDetailsPerFile = function (results) {
    var result = []
    var resultsAdvanced = getResultsAdvanced(results)

    Object.keys(resultsAdvanced.outputFiles).map(function (key, index) {
        var entryOuter = resultsAdvanced.outputFiles[key];

        result.push(entryOuter.entries.map(function (entry) {
            //    return path.basename(entry.outputFileName) + ' ' + Math.round(entryOuter.sizeBeforeLargestTotal / 1024) + 'kb => ' + Math.round(entryOuter.sizeAfterSmallest / 1024) + 'kb (-' + Math.round((entryOuter.sizeBeforeLargestTotal - entryOuter.sizeAfterSmallest) / 1024) + 'kb ' + Math.round((entryOuter.sizeAfterSmallest / entryOuter.sizeBeforeLargestTotal) * 100) + '%)'

            return path.basename(entry.outputFileName) + ' ' + Math.round(entryOuter.sizeAfterSmallest / 1024) + 'kb ' + Math.round((entryOuter.sizeAfterSmallest / entryOuter.sizeBeforeLargestTotal) * 100) + '% ' + '(' + Math.round(entryOuter.sizeBeforeLargestTotal / 1024) + 'kb -' + Math.round((entryOuter.sizeBeforeLargestTotal - entryOuter.sizeAfterSmallest) / 1024) + 'kb -' + Math.round((1 - (entryOuter.sizeAfterSmallest / entryOuter.sizeBeforeLargestTotal)) * 100) + '%)'
        }))

    });
    return Helper.flatten(result).sort()
}

StatsPrinter.getSummaryDetailsTotal = function (results, settings) {
    var totalResults = []
    var resultWithoutZip = {
        sizeAfterSmallest: 0,
        sizeBeforeLargestTotal: 0,
        name: 'No Zip'
    }

    var resultWithBrotli = {
        sizeAfterSmallest: 0,
        sizeBeforeLargestTotal: 0,
        name: 'Brotli'
    }

    var resultWithZopfli = {
        sizeAfterSmallest: 0,
        sizeBeforeLargestTotal: 0,
        name: 'Zopfli'
    }
    
    var resultsAdvanced = getResultsAdvanced(results)

    Object.keys(resultsAdvanced.outputFiles).map(function (key, index) {
        var entryOuter = resultsAdvanced.outputFiles[key];

        if (entryOuter.outputFileName.endsWith('.br')) {
            resultWithBrotli.sizeAfterSmallest += entryOuter.sizeAfterSmallest
            resultWithBrotli.sizeBeforeLargestTotal += entryOuter.sizeBeforeLargestTotal
        } else if (entryOuter.outputFileName.endsWith('.gz')) {
            resultWithZopfli.sizeAfterSmallest += entryOuter.sizeAfterSmallest
            resultWithZopfli.sizeBeforeLargestTotal += entryOuter.sizeBeforeLargestTotal
        } else {
            resultWithoutZip.sizeAfterSmallest += entryOuter.sizeAfterSmallest
            resultWithoutZip.sizeBeforeLargestTotal += entryOuter.sizeBeforeLargestTotal
        }

    });


    totalResults.push(resultWithoutZip)
    var zipOptimSettings = settings.optimizer.zipOptim;
    if (zipOptimSettings.enabled) {

        if (zipOptimSettings.zopfli.enabled) {
            totalResults.push(resultWithZopfli)
        } else if (zipOptimSettings.zlib.enabled) {
            resultWithZopfli.name = 'zlib'
            totalResults.push(resultWithZopfli)
        }

        if (zipOptimSettings.brotli.enabled) {
            totalResults.push(resultWithBrotli)
        }
    }

    return totalResults.map(function (totalResultEntry) {
        return totalResultEntry.name + ' ' + Math.round(totalResultEntry.sizeAfterSmallest / 1024) + 'kb ' + Math.round((totalResultEntry.sizeAfterSmallest / totalResultEntry.sizeBeforeLargestTotal) * 100) + '% ' + '(' + Math.round(totalResultEntry.sizeBeforeLargestTotal / 1024) + 'kb -' + Math.round((totalResultEntry.sizeBeforeLargestTotal - totalResultEntry.sizeAfterSmallest) / 1024) + 'kb -' + Math.round((1 - (totalResultEntry.sizeAfterSmallest / totalResultEntry.sizeBeforeLargestTotal)) * 100) + '%)'
    })

}

module.exports = StatsPrinter