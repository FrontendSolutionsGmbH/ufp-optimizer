const fs = require('fs')
const path = require('path')

const testpath = path.join(__dirname, './testdata/0')

function filewalker (dir) {
  var results = []

  var list = fs.readdirSync(dir)
  list.forEach(function (file) {
    file = path.resolve(dir, file)

    var stat = fs.statSync(file)

    if (stat && stat.isDirectory()) {
      // Add directory to array [comment if you need to remove the directories from the array]
      var res = filewalker(file)
      results.push({type: 'dir', fileName: file})
      results = results.concat(res)
    }

    results.push({type: 'file', fileName: file, fileSize: stat['size']})
  })
  return results
}

console.log('test', filewalker(testpath))
