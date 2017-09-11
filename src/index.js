const app = require('./ufp-optimizer')

console.log('* step0 - copy: started')
app.copy()
console.log('* step0 - copy: finished')
//app.optimizeCSS()


console.log('** step1 - image/html/css: started')
Promise.all([
    app.optimizeImages(),
    app.optimizeHTML()]).then(function () {
    console.log('** step1 - image/html/css: finished')


    console.log('*** step2 - compression: started')
    app.gzip()
    console.log('*** step2 - compression: finished')
})
