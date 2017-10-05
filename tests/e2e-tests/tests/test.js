const helper = require('../helper')
const testsuits = require('../testDefinition')

testsuits.forEach(function (data) {
  describe(data.testName + ' Test', function () {
    var inputData
    var inputDataFiles
    var outputData
    var outputDataFiles
    before(function (done) {
      inputData = helper.filewalker(data.inputDirName)
      inputDataFiles = inputData.filter(function (entry) {
        return entry.type === 'file'
      })
      this.timeout(10000)
      helper.build(data).then(function () {
        outputData = helper.filewalker(data.outputDirName)
        outputDataFiles = outputData.filter(function (entry) {
          return entry.type === 'file'
        })
      }).then(done, done)
    })
    it('Should compress the ' + data.testName + ' files', function () {
      inputDataFiles.forEach(function (inputEntry) {
        var outputExists = false
        const inputPrefix = helper.cutSuffix(inputEntry.fileName)
        outputDataFiles.forEach(function (outputEntry) {
          const outputPrefix = helper.cutSuffix(outputEntry.fileName)
          if (inputPrefix === outputPrefix || inputPrefix === helper.cutSuffix(outputPrefix)) {
            outputExists = true
            if (inputEntry.strongAssertion) {
              expect(outputEntry.fileSize, 'Not compressed\ninput: ' + inputEntry.path + '\n' +
                'output: ' + outputEntry.path + '\n').to.be.below(inputEntry.fileSize)
            }
            else {
              expect(outputEntry.fileSize, 'Not compressed\ninput: ' + inputEntry.path + '\n' +
                'output: ' + outputEntry.path + '\n').to.be.at.most(inputEntry.fileSize)
            }
          }
        })
        expect(outputExists, 'Missing output file\ninput: ' + inputEntry.path).to.be.true
      })
    })
    it('Should have a .htaccess file in the root directory', function () {
      expect(helper.dirHasFile(data.outputDirName, '.htaccess')).to.be.true
    })
  })
})
