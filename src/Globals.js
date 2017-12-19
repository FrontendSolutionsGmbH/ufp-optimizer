const defaultsDeep = require('lodash.defaultsdeep')
const Logger = require('./Logger')

var globalsProduction = {
    debug: false,
    silent: false,
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
                postCss: {
                    enabled: true,
                    options: {
                        postCssNext: {
                            enabled: true,
                            options: {
                                features: {
                                    autoprefixer: {
                                        grid: true
                                    }
                                }
                            }
                        },
                        postCssClean: {
                            enabled: true,
                            options: {}
                        }

                    }
                }
            }
        },
        htaccessOptim: {
            enabled: true,
            options: {
                expire: 'access plus 1 year',
                expireHTML: 'access plus 1 day',
                maxageHTML: 86400,
                maxage: 31536000,
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
                htmlMinifier: {
                    enabled: true,
                    options: {
                        collapseBooleanAttributes: true,
                        collapseInlineTagWhitespace: true,
                        collapseWhitespace: true,
                        conservativeCollapse: true,
                        decodeEntities: true,
                        removeComments: true,
                        removeEmptyAttributes: true,
                        removeEmptyElements: true,
                        removeScriptTypeAttributes: true,
                        sortAttributes: true,
                        sortClassName: true
                    }
                }
            }
        },
        jsOptim: {
            enabled: true,
            options: {
                uglifyJs: {
                    enabled: true,
                    options: {}
                }
            }
        },
        copyOptim: {
            enabled: true
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
        },
        htaccessOptim: {
            options: {
                expire: 'access plus 1 hour',
                expireHTML: 'access plus 5 seconds',
                maxageHTML: 5,
                maxage: 60 * 60
            }
        }
    }
}, globalsProduction)

var globalsExtreme = defaultsDeep({
    debug: false,
    preset: 'extreme',
    optimizer: {
        imageOptim: {
            imagemin: {

                options: {
                    pngQuant: {
                        options: {quality: '0'}
                    },
                    pngCrush: {
                        options: {reduce: true}
                    },
                    webp: {
                        options: {quality: 0}
                    },
                    jpegRecompress: {
                        options: {quality: 'low'}
                    },
                    jpegMoz: {
                        options: {quality: '0'}
                    },
                    giflossy: {
                        options: {lossy: 0}
                    }
                }
            }
        },
        cssOptim: {
            enabled: true,
            options: {
                cleanCss: {
                    enabled: true,
                    options: {level: 2}
                }
            }
        }
    }
}, globalsProduction)

var globalsLossy = defaultsDeep({
    preset: 'lossy',
    optimizer: {
        imageOptim: {
            imagemin: {

                options: {
                    pngQuant: {
                        options: {quality: '30'}
                    },
                    pngCrush: {
                        options: {reduce: true}
                    },
                    webp: {
                        options: {quality: 30}
                    },
                    jpegRecompress: {
                        options: {quality: 'low'}
                    },
                    jpegMoz: {
                        options: {quality: '30'}
                    },
                    giflossy: {
                        options: {lossy: 30}
                    }
                }
            }
        },
        cssOptim: {
            enabled: true,
            options: {
                cleanCss: {
                    enabled: true,
                    options: {level: 2}
                }
            }
        }
    }
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
        case 'lossy':
            result = globalsLossy
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
                choices: ['development', 'production', 'extreme', 'lossy'],
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
            },
            {
                show: true,
                key: 'silent',
                alias: 's',
                default: false,
                demandOption: false,
                describe: 'if set to true you get no logs at all',
                type: 'bool',
                group: 'Options:'
            }
        ]
    }

    return help
}

var validateConfig = function (config, autofix) {
    if (autofix) {
        Logger.debug(autofix)
    }
    return config
}

module.exports = {
    getConfig: getConfig,
    getConfigHelp: getConfigHelp,
    validateConfig: validateConfig
}

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
