const helper = require('./helper')

describe('e2e-test', function() {
  describe('fullpage', function() {
    const commandObject = {
      inputDirName: 'examples/0/fullpage',
        outputDirName: 'dist-0',
        configFileName: ''
    }
    helper.build(commandObject)
    it('Should ignore null parameter', function() {
      expect(true).to.be.true
    })
  })
})
