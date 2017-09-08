const helper = require('./helper')
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

var optim = {}

optim.optimizeFile = function(fileName, options) {

	return new Promise(function(resolve, reject) {
		var sizeBefore = helper.getFilesizeInBytes(fileName);
		const gzip = zlib.createGzip();
		const inp = fs.createReadStream(fileName);
		const out = fs.createWriteStream(fileName + '.gz');
		inp.pipe(gzip).pipe(out).on('finish', () =>{
	      var sizeNEW = helper.getFilesizeInBytes(fileName + '.gz');
		  console.log('gzip '+ fileName, 'reduction: ',Math.round((sizeBefore-sizeNEW)/1024) + 'kb', Math.round((sizeNEW/sizeBefore)*100) + '%')
	    
	      resolve(sizeNEW)
	    });

		
		
	})


}

optim.optimizeFileList = function(fileList) {
	return Promise.all(fileList.filter(function(entry) {
		if (entry && entry.length > 0) {
			var ext = path.extname(entry)
			if (['.htm','.html','.svg', '.js', '.css'].indexOf(ext) > -1) {
				return true
			} else {
				return false
			}
		}
	}).map(function(entry) {
		return optim.optimizeFile(entry)
	})).then(function(result) {
		console.log('all gzip files written')
	})
}

module.exports = optim;