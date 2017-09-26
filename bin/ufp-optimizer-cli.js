#! /usr/bin/env node

const path = require('path')
const app = require('./../src/UfpOptimizer')


var argv = require('yargs').epilog('UFP Optimizer - Frontend Solutions 2017')
    .usage('Use this tool to optimize your static assets (Javascript|CSS|PNG|JPG)')
    .example('ufp-optimizer-cli optimize dist')
    .example('ufp-optimizer-cli optimize dist distOptimized')
    .example('ufp-optimizer-cli optimize dist distOptimized --env=development')
    .example('ufp-optimizer-cli optimize dist distOptimized --env=production')
    .example('ufp-optimizer-cli optimize dist distOptimized --config=myConfig.js')
    .command(['optimize <inputDir> <targetDir>'], 'Optimizes all assets in the <inputDir> and writes them to <targetDir>', function () {
            console.log('optimize command 1')
        },
        function () {
            console.log('optimize command 2')
        }
    )
    .command('config', 'Displays the config on console', function () {
        console.log('config command')
    })
    .option('c', {
        alias: 'config',
        demandOption: false,
        default: path.resolve(__dirname, '../src/Globals.js'),
        describe: 'config file to use',
        type: 'string'
    }).option('e', {
        alias: 'env',
        demandOption: false,
        choices: ['production', 'development', 'hardcore'],
        default: 'production',
        describe: 'Defines how strong it optimizes. production takes longer, hardcore takes veeery long. Also changes the cache duration for development purposes',
        type: 'string'
    }).demandCommand(1, 'You need at least one command before moving on')
    .argv


console.log('****** UFP OPTIMIZER 2.0 started ******')
//console.log('****** USAGE:  ufp-optimizer-cli ******')

var inputDirName = (argv._ && argv._.length > 0 && argv._[0]) || 'examples/0/input'
var outputDirName = (argv._ && argv._.length > 1 && argv._[1]) || 'dist'
var configFileName = (argv.config && path.join(process.cwd(), argv.config)) || path.resolve(__dirname, '../src/Globals.js')

//console.log('****** USAGE:  ufp-optimizer-cli ' + inputDirName + ' ' + outputDirName + ' ' + configFileName + ' ******')

const settings = require(configFileName)

settings.inputDir = inputDirName
settings.outputDir = outputDirName

app.execute(settings).then(function (result) {
    console.log('****** UFP OPTIMIZER finished ******')
    return result
}).catch(function (ex) {
    console.log('****** UFP OPTIMIZER finished with errors ******', ex)
})
