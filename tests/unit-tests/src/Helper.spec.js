const Helper = require('src/Helper')
const chai = require('chai')
const expect = chai.expect

describe('cleanEmptyFoldersRecursively', function () {
    const cleanEmptyFoldersRecursively = Helper.cleanEmptyFoldersRecursively
    it('Should ignore null parameter', function () {
        expect(cleanEmptyFoldersRecursively(null)).to.be.undefined
    })
    it('Should ignore undefined parameter', function () {
        expect(cleanEmptyFoldersRecursively(undefined)).to.be.undefined
    })
})
