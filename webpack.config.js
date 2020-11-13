const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack'); //to access built-in plugins
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = env => {
    return {
        entry: {
            gateway: './src/apps/gateway.ts',
            forwarder: './src/apps/forwarder.ts',
            'notifier.email': './src/apps/notifier.email.ts',
            'notifier.sms': './src/apps/notifier.sms.ts',
            notifier: './src/apps/notifier.ts',
            processor: './src/apps/processor.ts',
            restServer: './src/apps/restServer.ts',
        },
        mode: env.NODE_ENV,
        target: 'node',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
        },
        resolve: {
            extensions: ['.ts',],
            alias: {
                'src': path.resolve('./src'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        'ts-loader',
                    ],
                    exclude: /node_modules/,
                },
            ],
        },
        externals: [nodeExternals()],
        devtool: 'source-map',
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.ProgressPlugin(),
            new ForkTsCheckerWebpackPlugin(),
            new webpack.EnvironmentPlugin(
                (env.NODE_ENV === 'development') ?
                    {
                        NODE_ENV: 'development',
                        MONGO_URI: 'mongodb://localhost:27017/feathers',
                        JWT_SECRET: '7jekd*d9spongbobsquarepants260X*E',
                        JWT_EXPIRATION: '36h',
                        ENCRYPTION_KEY: '0123456789abcdefghiklmnopqrstuvx',
                        IV: '0123456789abcdef',
                        GATEWAY_PORT: '8099',
                        COOKIE_PASSWORD: 'some-password-used-to-secure-the-admin-cookie',
                    }
                    :
                    {
                        NODE_ENV: 'production',
                        MONGO_URI: 'mongodb://localhost:27017/feathers',
                        JWT_SECRET: '7jekd*d9spongbobsquarepants260X*E',
                        JWT_EXPIRATION: '36h',
                        ENCRYPTION_KEY: '0123456789abcdefghiklmnopqrstuvx',
                        IV: '0123456789abcdef',
                        GATEWAY_PORT: '8099',
                        COOKIE_PASSWORD: 'some-password-used-to-secure-the-admin-cookie',
                    }
            )
        ]
    }
};
