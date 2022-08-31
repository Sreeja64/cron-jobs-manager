const Sequelize = require('sequelize')
const { sequelize } = require('../config')

const Cron = sequelize.define('cron', {

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
    api_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    req_method: {
        type: Sequelize.STRING,
        allowNull: false
    },
    req_payload: {
        type: Sequelize.STRING,
        allowNull: true
    },
    // day: {
    //     type: Sequelize.STRING,
    //     allowNull: true
    // },
    // time: {
    //     type: Sequelize.STRING,
    //     allowNull: true
    // },
    // cron_every_type: {
    //     type: Sequelize.STRING,
    //     allowNull: true
    // },
    // cron_every_duration: {
    //     type: Sequelize.STRING,
    //     allowNull: true
    // },
    is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    cron_expression: {
        type: Sequelize.STRING,
        allowNull: false
    },
})
//Cron.sync();

module.exports = Cron