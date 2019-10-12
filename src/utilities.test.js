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
  test(`tap with message and no options`, () => {
    const config = { foo: 'bar' }

    const mockConsole = { log: jest.fn() }
    global.console = mockConsole

    const result = tap("my foobar message")(config)
    expect(mockConsole.log).toHaveBeenNthCalledWith(1, `Tapping the configuration`)
    expect(mockConsole.log).toHaveBeenNthCalledWith(2, `my foobar message`)
    expect(mockConsole.log).toHaveBeenNthCalledWith(3, JSON.stringify(config))
    expect(result).toEqual(config)
  })

  test(`tap with no message and no options`, () => {
    const config = { foo: 'bar' }

    const mockConsole = { log: jest.fn() }
    global.console = mockConsole

    const result = tap()(config)
    expect(mockConsole.log).toHaveBeenNthCalledWith(1, `Tapping the configuration`)
    expect(mockConsole.log).toHaveBeenNthCalledWith(2, JSON.stringify(config))
    expect(result).toEqual(config)
  })

  test(`tap with message and options`, () => {
    const fs = require('fs')
    jest.mock('fs')

    const config = { foo: 'bar' }
    const mockConsole = { log: jest.fn() }
    const expectedPrint = [`Tapping the configuration`, `my message with options`, JSON.stringify(config)]
    global.console = mockConsole
    fs.appendFile = jest.fn()


    const result = tap("my message with options", { dest: 'customize-cra.log' })(config)

    expect(fs.appendFile).toHaveBeenCalledWith('customize-cra.log', expectedPrint.join('\n') + '\n')
    expect(mockConsole.log).not.toHaveBeenCalled()
    expect(result).toEqual(config)
  })

  test(`tap with no message but with options`, () => {
    const fs = require('fs')
    jest.mock('fs')

    const config = { foo: 'bar' }
    const mockConsole = { log: jest.fn() }
    const expectedPrint = [`Tapping the configuration`, JSON.stringify(config)].join('\n') + '\n'
    global.console = mockConsole
    fs.appendFile = jest.fn()


    const result = tap('', { dest: 'customize-cra.log' })(config)

    expect(fs.appendFile).toHaveBeenCalledWith('customize-cra.log', expectedPrint)
    expect(mockConsole.log).not.toHaveBeenCalled()
    expect(result).toEqual(config)
  })
})
