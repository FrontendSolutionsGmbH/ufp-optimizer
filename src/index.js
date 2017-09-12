console.log('****** UFP OPTIMIZER started ******')
console.log('****** USAGE:  node src/main.js [inputDir] [outputDir] [configFile] ******')

const path = require('path')
var myArgs = process.argv.slice(2);
var inputDirName = myArgs && myArgs.length > 0 && myArgs[0] || 'example'
var outputDirName = myArgs && myArgs.length > 1 && myArgs[1] || 'dist'
var configFileName = myArgs && myArgs.length > 1 && path.join(process.cwd(), myArgs[2]) || path.resolve(__dirname, './globals.js')

console.log('****** USAGE:  node src/main.js ' + inputDirName + ' ' + outputDirName + ' ' + configFileName + ' ******')

//console.log('****** Input directory:', inputDirName, '  ******')
//console.log('****** Ouput directory:', outputDirName, '  ******')
//console.log('****** Config file:', configFileName, '  ******')

const app = require('./ufp-optimizer')
const settings = require(configFileName)

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
    app.gzip(settings)
    console.log('*** step2 - compression: finished')
})


console.log('****** UFP OPTIMIZER finished ******')