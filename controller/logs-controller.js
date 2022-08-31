const { responseHelper, dbHelper } = require('../helper');
const { Logs, Cron } = require('../model');
const { Op } = require('sequelize')

const fetchLogsList = async (req, res) => {
    try {
        const cronExist = await Cron.findOne({
            where: { id: req.params.cron_id, deletedAt: null },
            attributes: ['id'],
            raw: true
        })
        if (!cronExist) {
            return responseHelper.error(res, 'CRONDOESNTEXIST404')
        }
        let page = "";
        let where = {};
        if (req.query.page) {
            page = req.query.page;
        }
        else {
            page = 1;
        }
        if (req.query.start_date && req.query.end_date) {
            where = {
                "createdAt": {
                    [Op.and]: {
                        [Op.gte]: req.query.start_date,
                        [Op.lte]: req.query.end_date
                    }
                }
            }
        }
        // if (req.query.start_date == req.query.end_date) {
        //     where = {
        //         "createdAt": {
        //             [Op.eq]:req.query.end_date
        //         }
        //     }
        // }

        const limit = 10;
        const { offset } = dbHelper.getOffset(page, limit)
        const logList = await Logs.findAndCountAll({
            raw: true,
            offset: offset,
            limit: limit,
            attributes: ['id', 'cron_job_name', 'cron_id',
                'response_status', 'time', 'createdAt'],
            where: { ...where, cron_id: req.params.cron_id, deletedAt: null },
            order: [["createdAt", "DESC"]]
        })
        const { results, cursors } = dbHelper.getPaginatedStructureAndCount(logList, limit, page)
        return responseHelper.success(res, 'LOGSLIST200', { results, cursors })
    }
    catch (ex) {
        return responseHelper.error(res, 'SERVER500')
    }
};

const deleteLog = async (req, res) => {
    try {
        const logExist = await Logs.findOne({
            where: { id: req.params.id, deletedAt: null },
            attributes: ['id'],
            raw: true
        })
        if (!logExist) {
            return responseHelper.error(res, 'LOGDOESNTEXIST404')
        }
        await Logs.destroy({
            where: {
                id: req.params.id,
                deletedAt: null
            }
        })
        return responseHelper.success(res, 'LOGSDELETED200')
    }
    catch (ex) {
        return responseHelper.error(res, 'SERVER500')
    }
};

const deleteLogByDate = async (req, res) => {
    try {
        let where = {};
        const cronExist = await Cron.findOne({
            where: { id: req.params.cron_id, deletedAt: null },
            attributes: ['id'],
            raw: true
        })
        if (!cronExist) {
            return responseHelper.error(res, 'LOGDOESNTEXIST404')
        }
        if (req.query.start_date && req.query.end_date) {
            where = {
                "createdAt": {
                    [Op.and]: {
                        [Op.gte]: req.query.start_date,
                        [Op.lte]: req.query.end_date
                    }
                }
            }
        }
        await Logs.destroy({
            where: {
                ...where,
                cron_id: req.params.cron_id,
                deletedAt: null
            }
        })
        return responseHelper.success(res, 'LOGSDELETED200')
    }
    catch (ex) {
        return responseHelper.error(res, 'SERVER500')
    }
};

module.exports = {
    fetchLogsList,
    deleteLog,
    deleteLogByDate,
}