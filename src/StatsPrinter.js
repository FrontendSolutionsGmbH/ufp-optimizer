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

var getResultsAdvanced = function (results, useWebP) {
    var inputFiles = {}
    var outputFiles = {}

    results.map(function (moduleResult) {
        if (moduleResult) {
            // add inputfiles
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

            // add outputfiles
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

            //filter out webp/no webp

            var toDeleteKeys = []
            Object.keys(outputFiles).map(function (key) {
                var entry = outputFiles[key]
                if (useWebP !== undefined) {
                    if (useWebP && (entry.outputFileName.indexOf('.jpg') > -1 || entry.outputFileName.indexOf('.jpeg') > -1 || entry.outputFileName.indexOf('.png') > -1)) {
                        toDeleteKeys.push(key)
                    } else if (!useWebP && entry.outputFileName.indexOf('.webp') > -1) {
                        toDeleteKeys.push(key)
                    }
                }
            })

            toDeleteKeys.map(function (key) {
                delete outputFiles[key]
            })
        }
    })

    return {
        results: results,
        inputFiles: inputFiles,
        outputFiles: outputFiles
    }
}

StatsPrinter.getModuleResult = function (moduleResult) {
    var result = []

    if (moduleResult) {
        moduleResult.files.map(function (entry) {
            result.push({
                Filename: path.basename(entry.outputFileName),
                SizeBefore: Math.round(entry.sizeBefore / 1024) + ' kb',
                SizeAfter: Math.round(entry.sizeAfter / 1024) + ' kb',
                SizePercentageAfter: Math.round((entry.sizeAfter / entry.sizeBefore) * 100) + '%',
                SizePercentageSaved: Math.round(100 - (entry.sizeAfter / entry.sizeBefore) * 100) + '%',
                SavedBytes: Math.round((entry.sizeBefore - entry.sizeAfter) / 1024) + ' kb ',
                Module: moduleResult.name,
                Group: entry.group,
                Origin: path.basename(entry.outputFileName) !== path.basename(entry.inputFileName) ? path.basename(entry.inputFileName) : ''
            })
        })
    }

    return result
}

StatsPrinter.getSummaryDetailsPerFile = function (results) {
    var result = []
    var resultsAdvanced = getResultsAdvanced(results)

    Object.keys(resultsAdvanced.outputFiles).map(function (key) {
        var entryOuter = resultsAdvanced.outputFiles[key]

        result.push(entryOuter.entries.map(function (entry) {
            return {
                Filename: path.basename(entry.outputFileName),
                SizeBefore: Math.round(entryOuter.sizeBeforeLargestTotal / 1024) + ' kb',
                SizeAfter: Math.round(entryOuter.sizeAfterSmallest / 1024) + ' kb',
                SizePercentageAfter: Math.round((entryOuter.sizeAfterSmallest / entryOuter.sizeBeforeLargestTotal) * 100) + '%',
                SizePercentageSaved: Math.round(100 - (entryOuter.sizeAfterSmallest / entryOuter.sizeBeforeLargestTotal) * 100) + '%',
                SavedBytes: Math.round((entryOuter.sizeBeforeLargestTotal - entryOuter.sizeAfterSmallest) / 1024) + ' kb ',
                Modules: 'TODO',
                Groups: 'TODO',
                Origin: path.basename(entry.outputFileName) !== path.basename(entry.inputFileName) ? path.basename(entry.inputFileName) : ''
            }
        }))
    })
    return Helper.flatten(result).sort()
}

StatsPrinter.getSummaryDetailsTotal = function (results, settings, useWebP) {
    var totalResults = []
    var resultWithoutZip = {
        name: 'No-Zip' + (useWebP ? ' with WebP' : ''),
        sizeAfterSmallest: 0,
        sizeBeforeLargestTotal: 0
    }

    var resultWithBrotli = {
        name: 'Brotli' + (useWebP ? ' with WebP' : ''),
        sizeAfterSmallest: 0,
        sizeBeforeLargestTotal: 0
    }

    var resultWithZopfli = {
        name: 'Zopfli' + (useWebP ? ' with WebP' : ''),
        sizeAfterSmallest: 0,
        sizeBeforeLargestTotal: 0
    }

    var resultsAdvanced = getResultsAdvanced(results, useWebP)

    // collect sizes of br/gz/no zip compressors
    Object.keys(resultsAdvanced.outputFiles).map(function (key) {
        var entryOuter = resultsAdvanced.outputFiles[key]

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
    })

    // add sizes of files to gzip/brotli that are not zipped (like images, they are not compressed but we want to know the total amount of reduction.
    Object.keys(resultsAdvanced.outputFiles).map(function (key) {
        var entryOuter = resultsAdvanced.outputFiles[key]

        if (!entryOuter.outputFileName.endsWith('.br') && !entryOuter.outputFileName.endsWith('.gz')) {
            var foundInstanceWithBr = false
            var foundInstanceWithGz = false

            Object.keys(resultsAdvanced.outputFiles).map(function (key2) {
                var entryOuter2 = resultsAdvanced.outputFiles[key2]
                if (entryOuter2.outputFileName === entryOuter.outputFileName + '.gz') {
                    foundInstanceWithGz = true
                } else if (entryOuter2.outputFileName === entryOuter.outputFileName + '.br') {
                    foundInstanceWithBr = true
                }
            })

            if (!foundInstanceWithBr && !foundInstanceWithGz) {
                resultWithZopfli.sizeAfterSmallest += entryOuter.sizeAfterSmallest
                resultWithZopfli.sizeBeforeLargestTotal += entryOuter.sizeBeforeLargestTotal
                resultWithBrotli.sizeAfterSmallest += entryOuter.sizeAfterSmallest
                resultWithBrotli.sizeBeforeLargestTotal += entryOuter.sizeBeforeLargestTotal
            }
        }
    })

    totalResults.push(resultWithoutZip)
    var zipOptimSettings = settings.optimizer.zipOptim
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
        return {
            Name: totalResultEntry.name,
            SizeBefore: Math.round(totalResultEntry.sizeBeforeLargestTotal / 1024) + ' kb',
            SizeAfter: Math.round(totalResultEntry.sizeAfterSmallest / 1024) + ' kb',
            SizePercentageAfter: Math.round((totalResultEntry.sizeAfterSmallest / totalResultEntry.sizeBeforeLargestTotal) * 100) + '%',
            SizePercentageSaved: Math.round(100 - (totalResultEntry.sizeAfterSmallest / totalResultEntry.sizeBeforeLargestTotal) * 100) + '%',
            SavedBytes: Math.round((totalResultEntry.sizeBeforeLargestTotal - totalResultEntry.sizeAfterSmallest) / 1024) + ' kb '
        }
        //return totalResultEntry.name + ': ' + Math.round(totalResultEntry.sizeAfterSmallest / 1024) + 'kb <= ' + Math.round(totalResultEntry.sizeBeforeLargestTotal / 1024) + 'kb ' + Math.round((totalResultEntry.sizeAfterSmallest / totalResultEntry.sizeBeforeLargestTotal) * 100) + '% ' + '(' + '-' + Math.round((1 - (totalResultEntry.sizeAfterSmallest / totalResultEntry.sizeBeforeLargestTotal)) * 100) + '% ' + '-' + Math.round((totalResultEntry.sizeBeforeLargestTotal - totalResultEntry.sizeAfterSmallest) / 1024) + 'kb' + ')'
    })
}

StatsPrinter.printTable = function (result) {
    require('console.table')
    console.table(result)
}

module.exports = StatsPrinter
