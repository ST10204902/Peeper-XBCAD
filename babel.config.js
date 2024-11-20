module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
    ["@babel/preset-react", { runtime: "automatic" }],
    "module:metro-react-native-babel-preset",
  ],
  plugins: [
    "react-native-reanimated/plugin",
    "@babel/plugin-transform-private-methods",
    "@babel/plugin-transform-class-properties",
    "@babel/plugin-transform-private-property-in-object",
  ],
};
