const helper = require('./helper')
const testsuits = require('./e2e-test')
const path = require('path')

testsuits.forEach(function (data) {
  describe(data.testName + ' Test', function () {
    it('Should compress the files', function (done) {
      const inputData = helper.filewalker(data.inputDirName)
      const inputDataFiles = inputData.filter(function (entry) {
        return entry.type === 'file'
      })
      this.timeout(10000)
      helper.build(data).then(function () {
        const outputData = helper.filewalker(data.outputDirName)
        const outputDataFiles = outputData.filter(function (entry) {
          return entry.type === 'file'
        })
        inputDataFiles.forEach(function (inputEntry) {
          var outputExists = false
          const inputPrefix = helper.cutSuffix(inputEntry.fileName)
          outputDataFiles.forEach(function (outputEntry) {
            const outputPrefix = helper.cutSuffix(outputEntry.fileName)
            if (inputPrefix === outputPrefix || inputPrefix === helper.cutSuffix(outputPrefix)) {
              outputExists = true
              expect(inputEntry.fileSize).to.be.at.least(outputEntry.fileSize)
            }
          })
          expect(outputExists).to.be.true
        })
      }).then(done, done)
    })
  })
})
