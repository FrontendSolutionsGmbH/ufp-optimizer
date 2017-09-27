const path = require('path')

var globalsProduction = {
    debug: false,
    preset: 'production',
    inputDir: 'dist',
    outputDir: 'distOptimized',
    imageCompression: {
        enabled: true
    },
    cssCompression: {
        enabled: true
    },
    optionsPNG: {quality: '80'},
    optionsMOZJPEG: {quality: '65-80'},
    optionsSVG: {plugins: [{removeViewBox: false}]},
    optionsGIF: {lossy: 80},
    optionsWEBP: {quality: 80},
    optionsJPEGRECOMPRESS: {quality: 'medium'},
    optionsPNGCrush: {},
    htaccessFile: path.resolve(__dirname, './.htaccess'),
    delete: [],
    uncssOptions: {ignore: ['.class1'], ignoreSheets: [/fast.fonts.net/]},
    htmlminifyOptions: {},
    customImageOptions: [
        {
            key: 'ui/navopen.png',
            value: {
                optionsPNG: {quality: '0'},
                optionsPNGCrush: {reduce: true}
            }
        }
    ]
}

var globalsDevelopment = Object.assign({}, globalsProduction, {
    imageCompression: {
        enabled: false
    },
    cssCompression: {
        enabled: false
    }
});
var globalsExtreme = Object.assign({}, globalsProduction);


var getConfig = function (preset) {
    var result = globalsProduction;
    switch (preset) {
        case 'development':
            result = globalsDevelopment;
            break;
        case 'extreme':
            result = globalsExtreme;
            break;
    }
    return result;
}

var getConfigHelp = function (preset) {
    var config = getConfig(preset);
    var help = {
        entries: [
            {
                show: false,
                key: 'inputDir',
                defaultsTo: config.inputDir,
                adescribe: 'The input directory'
            },

            {
                show: false,
                key: 'outputDir',
                defaultsTo: config.outputDir,
                describe: 'The outputdir'
            },
            {
                show: true,
                key: 'preset',
                alias: 'p',
                demandOption: config.debug,
                choices: ['development', 'production', 'extreme'],
                describe: 'Defines how strong it optimizes. development is fast. production takes longer, hardcore takes veeery long. Also changes the cache duration for development purposes',
                type: 'string'
            },
            {
                show: true,
                key: 'debug',
                alias: 'd',
                default: false,
                demandOption: false,
                describe: 'if set to true you get some nice console output',
                type: 'bool'
            }
        ]
    }

    return help;
}

var validateConfig = function (config, autofix) {
    if (autofix) {
        console.log('autofix')
    }
    return config;
}

module.exports = {getConfig: getConfig, getConfigHelp: getConfigHelp, validateConfig: validateConfig}


/*

 {
 key: 'inputDir',
 choices: ['production', 'development', 'hardcore'],
 default: 'dist',
 describe: 'Defines how strong it optimizes. development is fast. production takes longer, hardcore takes veeery long. Also changes the cache duration for development purposes',
 type: 'string'
 },
 {removeComments : true,
 collapseWhitespace: true,
 conservativeCollapse: true,
 collapseInlineTagWhitespace:false,
 minifyCSS: false,
 minifyJS: false,
 removeEmptyAttributes: false,
 removeEmptyElements: false,
 removeOptionalTags: false,
 removeRedundantAttributes: false,
 } */
