const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/api', {
            target: process.env.CLIENT_HOSTNAME + 'api',
            changeOrigin: true,
        })
    );
};