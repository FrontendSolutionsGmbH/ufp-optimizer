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

ufp-optimizer works on a directory base and compresses everything inside

* zopfli+brotli to text files (html, javascript, svg, css, ...)
* image compressions (lossless) with imagemin
* webp conversion of images (jpg and png)
* html minification with html-minifier
* ready to use .htaccess for the above optimizations (so that a compatible browser loads image.jpeg.webp instead of image.jpeg)

## How do I start? ##

First you need to install the package

```
> npm install ufp-optimizer --save
```


Then you can either use it in your node.js code, as a cli terminal command or as a webpack plugin.

### node.js usage ###

If you use ufp-optimizer via node you have 4 available commands

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

You can also use it via command line

```
> ufp-optimizer-cli [inputDir] [outputDir] [configFile]
```

Example for commandline

```
> ufp-optimizer-cli dist distOptimized
```

or

```
> node node_modules/ufp-optimizer/bin/ufp-optimizer-cli dist distOptimized
```


The default for inputDir is dist, outputDir is distOptimized. configFile is optional


### webpack usage ###

TODO

## CLI params ##

ufp-optimizer-cli [inputDir] [outputDir] [configFile]

| Parameter | Description                                     | Example |
| --------- | -----------                                     | ------- |
| inputDir  | Directory which contains the files that need to be compressed | dist    |
| outputDir  | Where the files will be written. Needs to be different from inputDir | distCompressed    |
| configFile  | Optional: A config file containing specific params. Copy the ./src/Globals.js and modify it | myConfig.js    |

## ConfigFile params ##

The config file is a json file containing sever settings to control what will be compressed and how. You can e.g. use a special png compression algorithm on some files or exclude them.

| Parameter | Description                                     | Example |
| --------- | -----------                                     | ------- |
| inputDir  | Directory which contains the files that need to be compressed | dist    |
| outputDir  | Where the files will be written. Needs to be different from inputDir | distCompressed    |

## TODOS ##

* Better docs
* Better error handling (input dir does not exist, inputDir===outputDir, broken files, write permission errors)
* Webpack Usage
* More config settings (enable/disable whole steps like html-minification, use brotli and zopfli on more extensions and so on)

## Known problems ##

### zopfli problem ###

If you get an error like the one below just execute "npm rebuild"

```
Error: Cannot find module '/mnt/d/Alex/projects/teo/node_modules/node-zopfli/lib/binding/node-v51-linux-x64/zopfli.node'
    at Function.Module._resolveFilename (module.js:470:15)
    at Function.Module._load (module.js:418:25)
    at Module.require (module.js:498:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (/mnt/d/Alex/projects/teo/node_modules/node-zopfli/lib/zopfli.js:7:14)
    at Module._compile (module.js:571:32)
    at Object.Module._extensions..js (module.js:580:10)
    at Module.load (module.js:488:32)
    at tryModuleLoad (module.js:447:12)
    at Function.Module._load (module.js:439:3)
```


### write permission problem ###

If somehow you get an error saying that you dont have permissions deleting the outputDir, close any programs which can access the files in that directory and try again
