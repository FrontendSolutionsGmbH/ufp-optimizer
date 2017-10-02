const helper = require('./helper')
const path = require('path')

describe('Fullpage Test', function() {
  it('Should ignore null parameter', function (done) {
    const data = {
      inputDirName: 'tests/e2e-tests/testdata/0/fullpage',
      outputDirName: 'dist-0',
      configFileName: ''
    }
    const inputData = helper.filewalker(data.inputDirName)
    var outputData
    this.timeout(10000)
    helper.build(data).then(function () {
      outputData = helper.filewalker(data.outputDirName)
      expect(inputData.length).to.equal(outputData.length)
    }).then(done, done)
  })
})
describe('Fast', function() {
  it('Should ignore null parameter', function (done) {
    const data = {
      inputDirName: 'tests/e2e-tests/testdata/1/fast',
      outputDirName: 'dist-1',
      configFileName: ''
    }
    const inputData = helper.filewalker(data.inputDirName)
    var outputData
    this.timeout(10000)
    helper.build(data).then(function () {
      outputData = helper.filewalker(data.outputDirName)
      expect(inputData.length).to.equal(outputData.length)
    }).then(done, done)
  })
})
describe('Fast Test', function() {
  it('Should ignore null parameter', function (done) {
    const data = {
      inputDirName: 'tests/e2e-tests/testdata/1/fast',
      outputDirName: 'dist-2'
    }
    const inputData = helper.filewalker(data.inputDirName)
    var outputData
    this.timeout(10000)
    helper.build(data).then(function () {
      outputData = helper.filewalker(data.outputDirName)
      expect(inputData.length).to.equal(outputData.length)
    }).then(done, done)
  })
})
describe('Same Dir Test', function() {
  it('Should ignore null parameter', function (done) {

    var data = {
      inputDirName: 'tests/e2e-tests/testdata/1/fast',
      outputDirName: 'dist-3'
    }
    helper.copy(data)
    data = {
      inputDirName: 'dist-3',
      outputDirName: 'dist-3'
    }
    const inputData = helper.filewalker(data.inputDirName)
    var outputData
    this.timeout(10000)
    helper.build(data).then(function () {
      outputData = helper.filewalker(data.outputDirName)
      expect(inputData.length).to.equal(outputData.length)
    }).then(done, done)
  })
})
describe('Broken Test', function() {
  it('Should ignore null parameter', function (done) {
    const data = {
      inputDirName: 'tests/e2e-tests/testdata/4/broken',
      outputDirName: 'dist-4',
      configFileName: ''
    }
    const inputData = helper.filewalker(data.inputDirName)
    var outputData
    this.timeout(10000)
    helper.build(data).then(function () {
      outputData = helper.filewalker(data.outputDirName)
      expect(inputData.length).to.equal(outputData.length)
    }).then(done, done)
  })
})
describe('Not Existing Test', function() {
  it('Should ignore null parameter', function(done) {
    const data = {
      inputDirName: 'tests/e2e-tests/testdata/5/not-existing',
      outputDirName: 'dist-5',
      configFileName: ''
    }
    const inputData = helper.filewalker(data.inputDirName)
    var outputData
    this.timeout(10000)
    helper.build(data).then(function () {
      outputData = helper.filewalker(data.outputDirName)
      expect(inputData.length).to.equal(outputData.length)
    }).then(done, done)
  })
})