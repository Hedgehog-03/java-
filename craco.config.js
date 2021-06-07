const CracoLessPlugin = require('craco-less');
const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#20abfe' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    alias: { // alias: 别名，化名
      "@": resolve("src"),
    }
  }
};