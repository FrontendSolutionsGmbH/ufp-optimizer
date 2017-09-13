# README #

UFP optimizer is for optimizing stuff

* css
* images
* html
* svg
* ...


## Prerequisites ##

* Python 2.7
* GCC (Unix) or Visual Studio Express (Windows)

## What is this repository for? ##

ufp-optimizer works on a directory and compresses everything inside (

* zopfli+brotli
* webp conversion of images
* html minification
* ready to use .htaccess for the above optimizations (so that a compatible browser loads image.jpeg.webp and not image.jpeg)

## How do I get set up? ##

First of all you need to install the package

```
npm install ufp-optimizer --save
```


Then you can either use it in your node.js code, or as a cli terminal command or as webpack plugin.

### node.js usage ###

If you use ufp-optimizer via node you have  4 available commands

* execute (settings)
* copy (settings)
* optimizeImages (settings)
* optimizeHTML (settings)
* optimizeCSS (settings)
* zip (settings)

```javascript
var uo = require('ufp-optimizer')

var settings = uo.getDefaultSettings();
settings.inputDir = 'dist';
settings.outputDir = 'blub';
uo.execute(settings);
```


### commandline usage ###

you can also use it via command line

```
ufp-optimizer-cli [inputDir] [outputDir] [configFile]
```

Example for commandline

```
ufp-optimizer-cli dist distOptimized
```

The default for inputDir is dist, outputDir is distOptimized. configFile is optional


### webpack usage ###

TODO

## Config params ##

| Parameter | Description                                     | Example |
| --------- | -----------                                     | ------- |
| inputDir  | where are your files that need to be compressed | dist    |


## Contribution guidelines ##

None so far


## TODOS ##

* Documentation
* more config settings (enable/disable whole steps and so on)
