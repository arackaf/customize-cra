import { getBabelLoader } from "./utilities";

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
