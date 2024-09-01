const path = require('path');

module.exports = {
  webpack: function (config, env) {
    // Modify the Webpack config here, if needed
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      querystring: require.resolve("querystring-es3"),
      http: require.resolve("stream-http"),
    };
    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      // Get the default config
      const config = configFunction(proxy, allowedHost);

      // Modify the dev server config here, if needed
      config.port = 9000; // Example: change the port

      return config;
    };
  },
};
