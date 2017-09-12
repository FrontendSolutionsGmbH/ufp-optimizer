#! /usr/bin/env node

console.log('****** UFP OPTIMIZER started ******')
console.log('****** USAGE:  ufp-optimizer-cli [inputDir] [outputDir] [configFile] ******')

const path = require('path')
var myArgs = process.argv.slice(2);
var inputDirName = myArgs && myArgs.length > 0 && myArgs[0] || 'examples/0/input'
var outputDirName = myArgs && myArgs.length > 1 && myArgs[1] || 'dist'
var configFileName = myArgs && myArgs.length > 2 && path.join(process.cwd(), myArgs[2]) || path.resolve(__dirname, '../src/globals.js')

console.log('****** USAGE:  ufp-optimizer-cli ' + inputDirName + ' ' + outputDirName + ' ' + configFileName + ' ******')

//console.log('****** Input directory:', inputDirName, '  ******')
//console.log('****** Ouput directory:', outputDirName, '  ******')
//console.log('****** Config file:', configFileName, '  ******')

const app = require('./../src/ufp-optimizer')
const settings = require(configFileName)

settings.inputDir = inputDirName
settings.outputDir = outputDirName

console.log('* step0 - copy: started')
app.copy(settings)
console.log('* step0 - copy: finished')
//app.optimizeCSS()


console.log('** step1 - image/html/css: started')
Promise.all([
    app.optimizeImages(settings),
    app.optimizeHTML(settings)]).then(function () {
    console.log('** step1 - image/html/css: finished')


    console.log('*** step2 - compression: started')
    app.zip(settings)
    console.log('*** step2 - compression: finished')
})


console.log('****** UFP OPTIMIZER finished ******')