const Helper = require('Helper')
describe('cleanEmptyFoldersRecursively', function() {
  const cleanEmptyFoldersRecursively = Helper.cleanEmptyFoldersRecursively
  it('Should ignore null parameter', function() {
    expect(cleanEmptyFoldersRecursively(null)).to.be.undefined
  })
  it('Should ignore undefined parameter', function() {
    expect(cleanEmptyFoldersRecursively(undefined)).to.be.undefined
  })
})
