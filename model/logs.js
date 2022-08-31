const Sequelize = require('sequelize')
const { sequelize } = require('../config')

const Logs = sequelize.define('logs', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    cron_job_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cron_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    time: {
        type: Sequelize.STRING,
        allowNull: true
    },
    response_status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
    deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
    },
})

module.exports = Logs