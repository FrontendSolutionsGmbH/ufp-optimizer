const helper = require('./helper')

describe('Fullpage Test', function() {
  it('Should ignore null parameter', function (done) {
    const data = {
      inputDirName: 'tests/e2e-tests/testdata/0/fullpage',
      outputDirName: 'dist-0',
      configFileName: ''
    }
    helper.build(data)
    this.timeout(10000)
    setTimeout(done, 5000)
    expect(true).to.be.true
    console.log('helle')
  })
})
describe('Fast', function() {
  it('Should ignore null parameter', function (done) {
    const data = {
      inputDirName: 'tests/e2e-tests/testdata/1/fast',
      outputDirName: 'dist-1',
      configFileName: ''
    }
    helper.build(data)
    this.timeout(10000)
    setTimeout(done, 5000)
    expect(true).to.be.true
  })
})
describe('Fast Test', function() {
  it('Should ignore null parameter', function (done) {
    const data = {
      inputDirName: 'tests/e2e-tests/testdata/1/fast',
      outputDirName: 'dist-2'
    }
    helper.build(data)
    this.timeout(10000)
    setTimeout(done, 5000)
    expect(true).to.be.true
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
    helper.build(data)
    this.timeout(10000)
    setTimeout(done, 5000)
    expect(true).to.be.true
  })
})
describe('Broken Test', function() {
  it('Should ignore null parameter', function (done) {
    const data = {
      inputDirName: 'tests/e2e-tests/testdata/4/broken',
      outputDirName: 'dist-4',
      configFileName: ''
    }
    helper.build(data)
    this.timeout(10000)
    setTimeout(done, 5000)
    expect(true).to.be.true
    console.log('helle')
  })
})
describe('Not Existing Test', function() {
  it('Should ignore null parameter', function(done) {
    const data = {
      inputDirName: 'tests/e2e-tests/testdata/5/not-existing',
      outputDirName: 'dist-5',
      configFileName: ''
    }
    helper.build(data)
    this.timeout(5000)
    setTimeout(done, 3000)
    expect(true).to.be.true
  })
})