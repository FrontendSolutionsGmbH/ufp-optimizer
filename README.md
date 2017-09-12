# README #

UFP optimizer is for optimizing stuff

* css
* images
* html
* svg
* ...


### TODOS ###

* Documentation
* more config settings (enable/disable whole steps and so on)

### What is this repository for? ###

ufp-optimizer works on a directory and compresses everything inside (

* zopfli+brotli
* webp conversion of images
* html minification
* ready to use .htaccess for the above optimizations (so that a compatible browser loads image.jpeg.webp and not image.jpeg)

### How do I get set up? ###

if you use ufp-optimizer via node you have  4 available commands

* copy
* optimizeImages
* optimizeHTML
* optimizeCSS
* zip

var uo = require('ufp-optimizer')

uo.copy()
...


you can also use it via command line

* ufp-optimizer-cli [inputDir] [outputDir] [configFile]



Keep in mind that you need to pass a settings object containing the configuration)
TODO Config file doc

### Contribution guidelines ###

None so far