const testsuits = [
  {
    testName: 'Full Page',
    inputDirName: 'tests/e2e-tests/testdata/0/fullpage',
    outputDirName: 'dist-0',
    configFileName: ''
  },
  {
    testName: 'Fast',
    inputDirName: 'tests/e2e-tests/testdata/1/css',
    outputDirName: 'dist-1',
    configFileName: ''
  },
  {
    testName: 'Test Fast',
    inputDirName: 'tests/e2e-tests/testdata/2/html',
    outputDirName: 'dist-2',
    configFileName: ''
  },
  {
    testName: 'Same Dir',
    inputDirName: 'tests/e2e-tests/testdata/3/img',
    outputDirName: 'dist-3',
    configFileName: ''
  },
  {
    testName: 'Broken',
    inputDirName: 'tests/e2e-tests/testdata/4/inc',
    outputDirName: 'dist-4',
    configFileName: ''
  },
  {
    testName: 'Not Existing',
    inputDirName: 'tests/e2e-tests/testdata/5/js',
    outputDirName: 'dist-5',
    configFileName: ''
  }
]

module.exports = testsuits

/*const testsuits = {
  fullpage: {
    inputDirName: 'tests/e2e-tests/testdata/0/fullpage',
    outputDirName: 'dist-0',
    configFileName: ''
  },
  fast: {
    inputDirName: 'tests/e2e-tests/testdata/1/fast',
    outputDirName: 'dist-1',
    configFileName: ''
  },
  testFast: {
    inputDirName: 'tests/e2e-tests/testdata/2/test-fast.js',
    outputDirName: '',
    configFileName: ''
  },
  testSameDir: {
    inputDirName: 'tests/e2e-tests/testdata/3/test-same-dir.js',
    outputDirName: '',
    configFileName: ''
  },
  broken: {
    inputDirName: 'tests/e2e-tests/testdata/4/broken',
    outputDirName: 'dist-4',
    configFileName: ''
  },
  notExisting: {
    inputDirName: 'tests/e2e-tests/testdata/5/not-existing',
    outputDirName: 'dist-5',
    configFileName: ''
  }
}*/
