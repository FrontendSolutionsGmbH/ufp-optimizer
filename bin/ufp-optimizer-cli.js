#! /usr/bin/env node
const path = require('path')
const app = require('./../src/ufp-optimizer')


console.log('****** UFP OPTIMIZER started ******')
console.log('****** USAGE:  ufp-optimizer-cli [inputDir] [outputDir] [configFile] ******')

var myArgs = process.argv.slice(2);
var inputDirName = myArgs && myArgs.length > 0 && myArgs[0] || 'examples/0/input'
var outputDirName = myArgs && myArgs.length > 1 && myArgs[1] || 'dist'
var configFileName = myArgs && myArgs.length > 2 && path.join(process.cwd(), myArgs[2]) || path.resolve(__dirname, '../src/globals.js')

console.log('****** USAGE:  ufp-optimizer-cli ' + inputDirName + ' ' + outputDirName + ' ' + configFileName + ' ******')

const settings = require(configFileName)

settings.inputDir = inputDirName
settings.outputDir = outputDirName

app.execute(settings);

console.log('****** UFP OPTIMIZER finished ******')