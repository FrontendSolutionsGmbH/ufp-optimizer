const globals = require('./globals')
const helper = require('./helper')
const settings = globals
const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');
const imageminGiflossy = require('imagemin-giflossy');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
 const imageminPngcrush = require('imagemin-pngcrush');

var optim = {}

optim.optimizeFile = function(fileName, options) {
	
	var imageDir = path.dirname(fileName);
	var customOptions = {};
	if (settings.customImageOptions) {
		settings.customImageOptions.map( function(entry) {

			var strippedImageFileName = fileName.replace(globals.outputDir+'/','').replace(globals.outputDir+'\\','').replace('\\','/')
			if (entry.key === fileName.replace(globals.outputDir+'/','').replace(globals.outputDir+'\\','').replace('\\','/')) {
				customOptions = entry.value;
			}
		})
	}

	options = options || {}
	options.optionsPNG = customOptions.optionsPNG || options.optionsPNG || settings.optionsPNG || globals.optionsPNG
	options.optionsPNGCrush = customOptions.optionsPNGCrush || options.optionsPNGCrush || settings.optionsPNGCrush || globals.optionsPNGCrush
	options.optionsMOZJPEG = customOptions.optionsMOZJPEG || options.optionsMOZJPEG || settings.optionsMOZJPEG || globals.optionsMOZJPEG
	options.optionsJPEGRECOMPRESS = customOptions.optionsJPEGRECOMPRESS || options.optionsJPEGRECOMPRESS || settings.optionsJPEGRECOMPRESS || globals.optionsJPEGRECOMPRESS
	options.optionsSVG = customOptions.optionsSVG || options.optionsSVG || settings.optionsSVG || globals.optionsSVG
	options.optionsWEBP = customOptions.optionsWEBP || options.optionsWEBP || settings.optionsWEBP || globals.optionsWEBP
	options.optionsGIF = customOptions.optionsGIF || options.optionsGIF || settings.optionsGIF || globals.optionsGIF

	
	
	var sizeBefore = helper.getFilesizeInBytes(fileName);

	var funcWebp = function() {

		return new Promise(function(resolve, reject) {
			//console.log('webp', fileName)
				return imagemin([fileName], imageDir, {
				    plugins: [
				         imageminWebp(options.optionsWEBP)
				    ]
				}).catch(function(error) {
					//console.log('webp-error', fileName)
					resolve()
				}).then(function(){
					//console.log('webp-success', fileName)
					resolve()
				})

		})
		
		
	}

	var funcAll = function() {
	
		//console.log('jpeg', fileName)
		var ext = path.extname(fileName);
	    var plugins = []
		switch(ext) {
			case '.png':
			plugins.push(  imageminPngquant(options.optionsPNG),
			        imageminPngcrush(options.optionsPNGCrush))
				break
			case '.jpg':
			case '.jpeg':
				plugins.push(imageminJpegRecompress(options.optionsJPEGRECOMPRESS))
				break
			case '.svg':
			 	plugins.push(imageminSvgo(options.optionsSVG))
			 	break;
		 	case '.gif':
			 	plugins.push(imageminGiflossy(options.optionsGIF))
				break

		}

		return imagemin([fileName], imageDir, {
			    plugins: plugins
		}).catch(function(error) {
			//	console.log('error', fileName)
				resolve()
			})

	}


	return funcAll().then(funcWebp).then(function() {
		var sizeNEW = helper.getFilesizeInBytes(fileName);
		var sizeWEBP = helper.getFilesizeInBytes(fileName);

		
		console.log('image', (Object.keys(customOptions).length > 0 ? 'custom' :''), fileName, 'reduction: ',Math.round((sizeBefore-sizeNEW)/1024) + 'kb', Math.round((1-sizeNEW/sizeBefore)*100) + '%', (Object.keys(customOptions).length > 0 ? options :''))
		return {sizeBEFORE: sizeBEFORE, sizeNEW: sizeNEW, sizeWEBP: sizeWEBP};
	})
}

optim.optimizeFileList = function(fileList) {
	var actions = fileList.filter(function(entry) {
		if (entry && entry.length > 0) {
			var ext = path.extname(entry)
			if (['.png','.jpg','.jpeg', '.svg'].indexOf(ext) > -1) {
				return true
			} else {
				return false
			}
		}
	}).map(function(entry) {
		return optim.optimizeFile(entry)
	});

	return Promise.all(actions).then(function(result) {
		console.log('all image files written')
	})
}

module.exports = optim;