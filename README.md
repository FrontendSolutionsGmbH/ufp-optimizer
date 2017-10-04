# README #

UFP optimizer is for optimizing stuff in an easy way

* css
* images  (jpeg, png, webp, svg)
* html
* javascript
* .gz and .br
* optimized .htaccess

It is based on a bunch of cross-platform tools and combines them

* [clean-css](https://www.npmjs.com/package/clean-css)
* [html-minifier](https://www.npmjs.com/package/html-minifier)
* [node-zopfli](https://www.npmjs.com/package/node-zopfli)
* [uglify-js](https://www.npmjs.com/package/uglify-js)
* [node-zopfli](https://www.npmjs.com/package/node-zopfli)
* [brotli](https://www.npmjs.com/package/brotli)
* [imagemin](https://www.npmjs.com/package/imagemin)
* [imagemin-giflossy](https://www.npmjs.com/package/imagemin-giflossy)
* [imagemin-jpeg-recompress](https://www.npmjs.com/package/imagemin-jpeg-recompress)
* [imagemin-mozjpeg](https://www.npmjs.com/package/imagemin-mozjpeg)
* [imagemin-pngcrush](https://www.npmjs.com/package/imagemin-pngcrush)
* [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant)
* [imagemin-svgo](https://www.npmjs.com/package/imagemin-svgo)
* [imagemin-webp](https://www.npmjs.com/package/imagemin-webp)

## Prerequisites ##

* Python 2.7
* GCC (Unix) or Visual Studio Express (Windows)
* Node 8.5

## What is this repository for? ##

ufp-optimizer works on a directory full of assets and compresses/minifies everything inside

* zopfli+brotli to text files (html, javascript, svg, css, ...)
* image compressions (lossy) with imagemin
* webp conversion of images (jpg and png)
* html minification with html-minifier
* javascript minification with uglify-js
* ready to use .htaccess for the above optimizations (so that a compatible browser loads image.jpeg.webp instead of image.jpeg)

It has different presets to get the best out of it

| Preset | Description |
| --------- | ----------- | --------- |
| production | Default: good quality with some optimizations, normally this is what you want |
| development | fast but not that small, e.g. it does normal .gz generation and not the slower but better zopfli one |
| lossy | same as 'production' but smaller but with accepted loss of quality (e.g. images have low quality settings like 30) |
| extreme | same as 'production' but with strong settings to get the most out of it. This method takes a long time so be prepared and get a cup of coffee |


## How do I start? ##

First you need to install the package

```
> npm install ufp-optimizer --save
```


Then you can either use it in your node.js code, as a cli terminal command or as a webpack plugin.

### Node.js usage ###

If you use ufp-optimizer in your node.js code you have the following commands available


| Function | Params | Description |
| --------- | ----------- | --------- |
| getConfig | none | Returns the default settings object. You can change anything you like but keep in mind to use different input and outputDir |
| executeOptimizations  | settings object | The most important command. One function to do everything (copy/css/images/html/...). Just pass the settings and you are good to go |
| copy | settings object | Creates the outputDir if necessary or deletes the content in it. It copies everything from inputDir then. You need to pass the settings object which contains inputDir and outputDir |
| optimizeImages | settings object | Does lossy png, jpg and svg optimizations on all files in the outputDir. You can fine-tune the algorithms per settingsfile if necessary, e.g. allowing loss to get better results. |
| optimizeHTML | settings object |  Minimizes html files. By default it does nothing dangerous to keep it compatible with all browsers |
| optimizeCSS | settings object | Minimize css files. By default it does nothing dangerous to keep it compatible with all browsers |
| optimizeJs | settings object | Minimize js files. By default it does nothing dangerous to keep it compatible with all browsers |
| zip | settings object | Does zopfli + brotli compression on all text files |


```javascript
var uo = require('ufp-optimizer')
var settings = uo.getConfig();
settings.inputDir = 'dist';
settings.outputDir = 'blub';
uo.executeOptimizations(settings);
```


### Commandline usage ###

You can also use it via command line

```
> ufp-optimizer-cli optimize [inputDir] [outputDir]
```

Example for commandline

```
> ufp-optimizer-cli optimize dist distOptimized
```

or

```
> node node_modules/ufp-optimizer/bin/ufp-optimizer-cli optimize dist distOptimized
```


The default for inputDir is dist, outputDir is distOptimized. configFile is optional

You can also run only a specific optimizer, e.g. to only optimize images and nothing else

```
> ufp-optimizer-cli optimize-images [inputDir] [outputDir]
> ufp-optimizer-cli optimize-css [inputDir] [outputDir]
> ufp-optimizer-cli optimize-html [inputDir] [outputDir]
> ufp-optimizer-cli optimize-js [inputDir] [outputDir]
> ufp-optimizer-cli optimize-zip [inputDir] [outputDir]
> ufp-optimizer-cli optimize-htaccess [inputDir] [outputDir]
> ufp-optimizer-cli optimize-copy [inputDir] [outputDir]
```


## CLI params ##

ufp-optimizer-cli optimize [inputDir] [outputDir] [configFile]

| Parameter | Description                                     | Example |
| --------- | -----------                                     | ------- |
| inputDir  | Directory which contains the files that need to be compressed | dist    |
| outputDir  | Where the files will be written. Needs to be different from inputDir | distCompressed    |
| --config  | Optional: A config file containing specific params. Copy the ./src/Globals.js and modify it | --config=myConfig.js    |
| --conf  | Optional: Same as --config but inline, so no file is expected but instead the attributes | --conf.preset=production --conf.optimizer.imageOptim.enabled=false    |
| --preset  | Optional: 'development', 'production', 'extreme', 'lossy' | --preset=lossy    |
| --debug  | Optional: To get more output | --debug    |
| --help  | Optional: To display a help | --help    |



```
> ufp-optimizer-cli optimize-images [inputDir] [outputDir] --preset=production --config=myConfig.js
> ufp-optimizer-cli optimize-css [inputDir] [outputDir] --preset=development
```

## ConfigFile params ##

The config file is a json file containing sever settings to control what will be compressed and how. You can e.g. use a special png compression algorithm on some files or exclude them.

| Parameter | Description                                     | Example |
| --------- | -----------                                     | ------- |
| inputDir  | Directory which contains the files that need to be compressed | dist    |
| outputDir  | Where the files will be written. Needs to be different from inputDir | distCompressed    |

To get a better idea what you can configure have a look at the default config [Globals.js](src/Globals.js)

## Todos ##

* File based optimization: Allow regex as input and not only full directories
* Intelligent optimizer: Image similarity Index, e.g. GMSD for optimal compression method
* Better image compression: jpegmini and imageOptim https://jamiemason.github.io/ImageOptim-CLI/
* Webpack Plugin?

## Known problems ##

### zopfli problem ###

If you get an error like the one below make sure that the prerequsites are met and execute "npm rebuild"

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
