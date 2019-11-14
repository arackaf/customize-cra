import { override, overrideDevServer } from "./overrides";

test("override composes provided plugin functions", () => {
  const plugin1 = jest.fn(x => x);
  const plugin2 = jest.fn(x => x);
  const composed = override(plugin1, plugin2);
  const result = composed("hello");

  expect(result).toBe("hello");
  expect(plugin1).toHaveBeenCalledWith("hello");
  expect(plugin2).toHaveBeenCalledWith("hello");
});

test("overrideDevServer overrides the webpack-dev-server config via provided plugin functions", () => {
  const plugins = [
    config => ({ ...config, test: false }),
    config => ({ ...config, foo: "bar" })
  ];
  const inputConfig = { test: true };
  const configFunction = jest.fn(() => inputConfig);

  expect(
    overrideDevServer(...plugins)(configFunction)("proxy", "allowedHost")
  ).toEqual({
    test: false,
    foo: "bar"
  });
  expect(configFunction).toHaveBeenCalledWith("proxy", "allowedHost");
});
