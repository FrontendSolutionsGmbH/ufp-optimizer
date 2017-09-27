const path = require('path')
const defaultsDeep = require('lodash.defaultsdeep')

var globalsProduction = {
    debug: false,
    preset: 'production',
    inputDir: 'dist',
    outputDir: 'distOptimized',
    optimizer: {
        imageOptim: {
            enabled: true,
            imagemin: {
                enabled: true,
                options: {
                    pngQuant: {
                        enabled: true,
                        options: {quality: '80'}
                    },
                    pngCrush: {
                        enabled: true,
                        options: {}
                    },
                    webp: {
                        enabled: true,
                        options: {quality: 80}
                    },
                    jpegRecompress: {
                        enabled: true,
                        options: {quality: 'medium'}
                    },
                    jpegMoz: {
                        enabled: false,
                        options: {quality: '65-80'}
                    },
                    svgo: {
                        enabled: true,
                        options: {plugins: [{removeViewBox: false}]}
                    },
                    giflossy: {
                        enabeld: true,
                        options: {lossy: 80}
                    }
                }
            },

            customImageOptions: [
                {
                    key: 'img/navopen.png',
                    imageOptim: {
                        imagemin: {
                            options: {
                                pngQuant: {
                                    enabled: true,
                                    options: {quality: '80'}
                                },
                                pngCrush: {
                                    enabled: true,
                                    options: {reduce: true}
                                }
                            }
                        }
                    }
                }
            ]

        },
        cssOptim: {
            enabled: true,
            options: {
                uncss: {
                    enabled: true,
                    options: {ignore: ['.class1'], ignoreSheets: [/fast.fonts.net/]}
                }
            }
        },
        htaccessOptim: {
            enabled: true,
            options: {
                inputFile: path.resolve(__dirname, './.htaccess'),
                outputFile: '/.htaccess'
            }
        },
        zipOptim: {
            enabled: true,
            brotli: {
                enabled: true
            },
            zopfli: {
                enabled: true,
                options: {}
            },
            zlib: {
                enabled: false,
                options: {}
            }
        },
        htmlOptim: {
            enabled: true,
            options: {
                minify: {
                    enabled: true,
                    options: {}
                }
            }
        }
    }
}


var globalsDevelopment = defaultsDeep({
    debug: false,
    preset: 'development',
    optimizer: {
        imageOptim: {
            enabled: false
        },
        zipOptim: {
            zopfli: {
                enabled: false
            },
            zlib: {
                enabled: true
            }
        }
    }
}, globalsProduction)

var globalsExtreme = defaultsDeep({
    debug: false,
    preset: 'extreme'
}, globalsProduction)

var getConfig = function (preset) {
    var result = globalsProduction
    switch (preset) {
        case 'development':
            result = globalsDevelopment
            break
        case 'extreme':
            result = globalsExtreme
            break
    }
    return result
}

var getConfigHelp = function (preset) {
    var config = getConfig(preset)
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
                default: process.env.NODE_ENV,
                demandOption: config.debug,
                choices: ['development', 'production', 'extreme'],
                describe: 'Defines how strong it optimizes. development is fast. production takes longer, hardcore takes veeery long. Also changes the cache duration for development purposes',
                type: 'string',
                group: 'Options:'
            },
            {
                show: true,
                key: 'debug',
                alias: 'd',
                default: false,
                demandOption: false,
                describe: 'if set to true you get some nice console output',
                type: 'bool',
                group: 'Options:'
            }
        ]
    }

    return help
}

var validateConfig = function (config, autofix) {
    if (autofix) {

    }
    return config
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
