const webpack = require('webpack')

// Load environment variables from .env and .env.local
const dotenv = require('dotenv')
let myEnv = {}

// Load .env first
const envResult = dotenv.config({ path: './.env' })
if (envResult.parsed) {
    myEnv = { ...myEnv, ...envResult.parsed }
}

// Load .env.local (overrides .env)
const envLocalResult = dotenv.config({ path: './.env.local' })
if (envLocalResult.parsed) {
    myEnv = { ...myEnv, ...envLocalResult.parsed }
}

module.exports = {
    webpack(config) {
        config.plugins.push(new webpack.EnvironmentPlugin(myEnv))
        return config
    },
    images: {
        unoptimized: true
    }
}