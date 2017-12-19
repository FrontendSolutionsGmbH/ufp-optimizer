#! /usr/bin/env node

const app = require('./../src/UfpOptimizer')
const fs = require('fs')
const defaultsDeep = require('lodash.defaultsdeep')
const configHelp = app.getConfigHelp('production')
const cloneDeep = require('lodash.clonedeep')
const yargs = require('yargs')
const package = require('../package.json')

var getConfigByArgv = function (argv) {
    var config = app.getConfig(argv.preset || (argv.conf && argv.conf.preset) || (argv.config && argv.config.preset))

    if (argv.config) {
        var configFromFile = JSON.parse(fs.readFileSync(argv.config, 'utf-8'))
        config = defaultsDeep(cloneDeep(configFromFile), config)
    }

    if (argv.conf) {
        var confJson = JSON.parse(JSON.stringify(argv.conf).replace(/"false"/g, false).replace(/'false'/g, false).replace(/"true"/g, true).replace(/'true'/g, 'a'))
        config = defaultsDeep(confJson, config)
    }

    if (argv.inputDir) {
        config.inputDir = argv.inputDir
    }

    if (argv.outputDir) {
        config.outputDir = argv.outputDir
    }

    if (argv.silent !== undefined) {
        config.silent = argv.silent
    }

    if (argv.debug !== undefined) {
        config.debug = argv.debug
    }

    var result = app.validateConfig(config, true)
    return result
}

var doOptimizations = function (settings) {
    app.executeOptimizations(settings)
}

var enableOnlyThisOptimizer = function (settings, optimString) {
    settings.optimizer.imageOptim.enabled = false
    settings.optimizer.cssOptim.enabled = false
    settings.optimizer.htaccessOptim.enabled = false
    settings.optimizer.zipOptim.enabled = false
    settings.optimizer.htmlOptim.enabled = false
    settings.optimizer.jsOptim.enabled = false
    settings.optimizer.copyOptim.enabled = true
    settings.optimizer[optimString].enabled = true
    return settings
}

var argv = yargs.epilog('UFP Optimizer - Frontend Solutions 2017')
    .usage('UFP Optimizer ' + package.version + ' - Optimizing static assets since 2017 (Javascript|CSS|PNG|JPG)')
    .example('ufp-optimizer-cli optimize dist')
    .example('ufp-optimizer-cli optimize dist distOptimized')
    .example('ufp-optimizer-cli optimize dist distOptimized --preset=development')
    .example('ufp-optimizer-cli optimize dist distOptimized --preset=production')
    .example('ufp-optimizer-cli optimize dist distOptimized --config=myConfig.js')
    .example('ufp-optimizer-cli optimize --config=mySuperConfigContainingDirs.js')
    .example('ufp-optimizer-cli optimize --conf.debug=true --conf.imageCompression.enabled=false')
    .example('ufp-optimizer-cli optimize --preset=extreme --conf.debug=true --conf.optimizer.imageOptim.enabled=false')
    .example('ufp-optimizer-cli optimize-htaccess examples/1/fast dist-ht --preset=production')
    .example('ufp-optimizer-cli config > test.rc')
    .config('config', function (configPath) {
        var check = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        return check
    })
    .command(['optimize [inputDir] [outputDir]'], 'Optimizes all assets in the [inputDir] and writes them to [outputDir]', function () {
        },
        function (argv) {
            var settings = getConfigByArgv(argv)
            doOptimizations(settings)
        }
    )
    .command(['optimize-copy [inputDir] [outputDir]'], 'Same as optimize but only for copy', function () {

        },
        function (argv) {
            var settings = getConfigByArgv(argv)
            doOptimizations(enableOnlyThisOptimizer(settings, 'copyOptim'))
        }
    )
    .command(['optimize-htaccess [inputDir] [outputDir]'], 'Same as optimize but only for ht-access', function () {

        },
        function (argv) {
            var settings = getConfigByArgv(argv)
            doOptimizations(enableOnlyThisOptimizer(settings, 'htaccessOptim'))
        }
    )
    .command(['optimize-css [inputDir] [outputDir]'], 'Same as optimize but only for css', function () {

        },
        function (argv) {
            var settings = getConfigByArgv(argv)
            doOptimizations(enableOnlyThisOptimizer(settings, 'cssOptim'))
        }
    )
    .command(['optimize-images [inputDir] [outputDir]'], 'Same as optimize but only for images', function () {

        },
        function (argv) {
            var settings = getConfigByArgv(argv)
            doOptimizations(enableOnlyThisOptimizer(settings, 'imageOptim'))
        }
    )
    .command(['optimize-html [inputDir] [outputDir]'], 'Same as optimize but only for html', function () {

        },
        function (argv) {
            var settings = getConfigByArgv(argv)
            doOptimizations(enableOnlyThisOptimizer(settings, 'htmlOptim'))
        }
    )
    .command(['optimize-js [inputDir] [outputDir]'], 'Same as optimize but only for js', function () {

        },
        function (argv) {
            var settings = getConfigByArgv(argv)
            doOptimizations(enableOnlyThisOptimizer(settings, 'jsOptim'))
        }
    )
    .command(['optimize-zip [inputDir] [outputDir]'], 'Same as optimize but only for zip', function () {

        },
        function (argv) {
            var settings = getConfigByArgv(argv)
            doOptimizations(enableOnlyThisOptimizer(settings, 'zipOptim'))
        }
    )
    .command('config', 'Displays the config on console', function () {
    }, function (argv) {
        console.log(JSON.stringify(getConfigByArgv(argv), null, 2))
    })
    .option('config', {
        alias: 'c',
        demandOption: false,
        describe: 'config file to use'
    }).option('conf', {
        describe: 'inline config settings, e.g. --conf.optimizer.htmlOptim.enabled=false'
    })

for (var i in configHelp.entries) {
    var entry = cloneDeep(configHelp.entries[i])
    var key = entry.key

    if (entry.show) {
        argv = argv.option(key, Object.assign({}, entry)).group(key, entry.group || 'conf')
    }
}

var commands = yargs.getCommandInstance().getCommands()

argv = argv.demandCommand(1, 'You need at least one command before moving on')
    .argv

if (argv._[0] && commands.indexOf(argv._[0]) === -1) {
    yargs.showHelp()
    console.log('Non-existing command specified "' + argv._[0] + '"')
    process.exit(1)
}
