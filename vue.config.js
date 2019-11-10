module.exports = {
    devServer: {
        compress: true,
        proxy: {
            '/': {
                target: 'http://localhost:4000',
                secure: false,
                ws: true
            }
        }
    }
};
