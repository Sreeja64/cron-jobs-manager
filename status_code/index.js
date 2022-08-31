
const cronCode = require('./cron-code')
const errorCode = require('./error-code')
module.exports = {
    ...cronCode,
    ...errorCode,
}