const app = require('./main')

app.copy()
app.optimizeImages()
//app.optimizeCSS()
app.optimizeHTML()
app.gzip()