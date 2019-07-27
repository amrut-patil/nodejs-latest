const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = (env = {}) => {
    const config = {
        entry: './src/index.ts',
        mode: env.development ? 'development' : 'production',
        target: 'node',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'index.js'
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        'ts-loader',
                    ]
                }
            ]
        },
        plugins: [],
        externals: [nodeExternals()],
    }
    
    if (env.nodemon) {
        config.watch = true;
        config.plugins.push(new NodemonPlugin());
    }

    return config;
}
