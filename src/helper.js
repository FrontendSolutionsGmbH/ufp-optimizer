var Helper = {}
const fs = require('fs-extra')
var path = require('path')

Helper.getFilesizeInBytes = function (filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats['size']
    return fileSizeInBytes
}

Helper.cleanEmptyFoldersRecursively = function (folder) {
    var isDir = fs.statSync(folder).isDirectory()
    if (!isDir) {
        return
    }
    var files = fs.readdirSync(folder)
    if (files.length > 0) {
        files.forEach(function (file) {
            var fullPath = path.join(folder, file)
            Helper.cleanEmptyFoldersRecursively(fullPath)
        })

        // re-evaluate files; after deleting subfolder
        // we may have parent folder empty now
        files = fs.readdirSync(folder)
    }
    if (files.length === 0) {
        console.log('removing: ', folder)
        fs.rmdirSync(folder)
    } else {
        console.log('not removing: ', folder, files.length)
    }
}

module.exports = Helper
