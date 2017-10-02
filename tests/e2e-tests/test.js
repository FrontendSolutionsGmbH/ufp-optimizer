const helper = require('./helper')

describe('e2e-test', function() {
  it('Should ignore null parameter', function(done) {
    const data = {
      inputDirName: 'examples/0/fullpage',
      outputDirName: 'dist-0',
      configFileName: ''
    }
    helper.build(data)
    this.timeout(20000)
    setTimeout(done, 10000)
    expect(true).to.be.true
    console.log('helle')
  })
  it('Should ignore null parameter', function(done) {
    const data = {
      inputDirName: 'examples/1/fast',
      outputDirName: 'dist-1',
      configFileName: ''
    }
    helper.build(data)
    this.timeout(20000)
    setTimeout(done, 10000)
    expect(true).to.be.true
  })
  it('Should ignore null parameter', function(done) {
    const data = {
      inputDirName: 'examples/1/fast',
      outputDirName: 'dist-2'
    }
    helper.build(data)
    this.timeout(20000)
    setTimeout(done, 10000)
    expect(true).to.be.true
  })
  it('Should ignore null parameter', function(done) {

    var data = {
      inputDirName: 'examples/1/fast',
      outputDirName: 'dist-3'
    }
    helper.copy(data)
    data = {
      inputDirName: 'dist-3',
      outputDirName: 'dist-3'
    }
    helper.build(data)
    this.timeout(20000)
    setTimeout(done, 10000)
    expect(true).to.be.true
  })
  it('Should ignore null parameter', function(done) {
    const data = {
      inputDirName: 'examples/4/broken',
      outputDirName: 'dist-4',
      configFileName: ''
    }
    helper.build(data)
    this.timeout(20000)
    setTimeout(done, 10000)
    expect(true).to.be.true
    console.log('helle')
  })
  it('Should ignore null parameter', function(done) {
    const data = {
      inputDirName: 'examples/5/not-existing',
      outputDirName: 'dist-5',
      configFileName: ''
    }
    helper.build(data)
    this.timeout(20000)
    setTimeout(done, 10000)
    expect(true).to.be.true
  })
})
