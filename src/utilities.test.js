import { getBabelLoader, tap } from "./utilities";

describe("getBabelLoader finds the babel loader options", () => {
  const loader = {
    loader: "babel",
    include: "src",
    options: {
      plugins: ["test"],
    },
  };

  const loaderOutsideOfApp = {
    loader: "babel",
    exclude: "src",
    options: {},
  };

  const configForOneOfArray = { module: { rules: [{ oneOf: [loader, loaderOutsideOfApp] }] } };
  const configForRuleUseArray = { module: { rules: [{ oneOf: [{ use: [loader, loaderOutsideOfApp] }] }] } };

  test('in "oneOf" array', () => {
    expect(getBabelLoader(configForOneOfArray)).toMatchSnapshot();
  });

  test('in a rule\'s "use" array', () => {
    expect(getBabelLoader(configForRuleUseArray)).toMatchSnapshot();
  });

  test('in "oneOf" array for outside of app', () => {
    expect(getBabelLoader(configForOneOfArray, true)).toMatchSnapshot();
  });

  test('in a rule\'s "use" array for outside of app', () => {
    expect(getBabelLoader(configForRuleUseArray, true)).toMatchSnapshot();
  });
});

describe(`tap`, () => {
  const config = { foo: 'bar' }
  const expectedConfigPrint = JSON.stringify(config, null, 2)
  const mockConsole = { log: jest.fn() }
  const originalConsole = global.console
  beforeAll(() => { global.console = mockConsole })

  afterEach(() => { mockConsole.log.mockClear() })

  afterAll(() => { global.console = originalConsole })

  test(`tap with undefined param / missing`, () => {
    const result = tap()(config)
    expect(mockConsole.log).toHaveBeenNthCalledWith(1, expectedConfigPrint)
    expect(result).toEqual(config)
  })

  test(`tap with null`, () => {
    const result = tap(null)(config)
    expect(mockConsole.log).toHaveBeenNthCalledWith(1, expectedConfigPrint)
    expect(result).toEqual(config)
  })

  test(`tap with empty object`, () => {
    const result = tap({})(config)
    expect(mockConsole.log).toHaveBeenNthCalledWith(1, expectedConfigPrint)
    expect(result).toEqual(config)
  })

  test(`tap with message but falsy value`, () => {
    const result = tap({ message: '' })(config)
    expect(mockConsole.log).toHaveBeenNthCalledWith(1, expectedConfigPrint)
    expect(result).toEqual(config)
  })

  test(`tap with message`, () => {
    const result = tap({ message: 'A message I want to print before the configuration' })(config)
    expect(mockConsole.log).toHaveBeenNthCalledWith(1, 'A message I want to print before the configuration')
    expect(mockConsole.log).toHaveBeenNthCalledWith(2, expectedConfigPrint)
    expect(result).toEqual(config)
  })

  describe(`with destination file option`, () => {
    const fs = require('fs')
    const mockAppendFile = jest.fn()
    jest.mock('fs')
    fs.appendFile = mockAppendFile

    afterEach(() => mockAppendFile.mockClear())

    test(`tap with no message`, () => {
      const result = tap({ dest: 'mypath' })(config)
      const expectedPrint = [expectedConfigPrint]
      expect(mockAppendFile).toHaveBeenCalledWith('mypath', `${expectedPrint.join('\n')}\n`)
      expect(mockConsole.log).toHaveBeenNthCalledWith(1, expectedConfigPrint)
      expect(result).toEqual(config)
    })

    test(`tap with message but falsy value`, () => {
      const result = tap({ dest: 'mypath', message: '' })(config)
      const expectedPrint = [expectedConfigPrint]
      expect(mockAppendFile).toHaveBeenCalledWith('mypath', `${expectedPrint.join('\n')}\n`)
      expect(mockConsole.log).toHaveBeenNthCalledWith(1, expectedConfigPrint)
      expect(result).toEqual(config)
    })

    test(`tap with message`, () => {
      const result = tap({ dest: 'mypath', message: 'A message I want to print before the configuration' })(config)
      const expectedPrint = ['A message I want to print before the configuration', expectedConfigPrint]
      expect(mockAppendFile).toHaveBeenCalledWith('mypath', `${expectedPrint.join('\n')}\n`)
      expect(mockConsole.log).toHaveBeenNthCalledWith(1, 'A message I want to print before the configuration')
      expect(mockConsole.log).toHaveBeenNthCalledWith(2, expectedConfigPrint)
      expect(result).toEqual(config)
    })
  })
})
