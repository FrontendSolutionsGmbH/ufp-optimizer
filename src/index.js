const app = require('./ufp-optimizer')
const settings = require('./globals')

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
