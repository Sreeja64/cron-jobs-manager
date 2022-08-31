const { responseHelper, dbHelper } = require('../helper');
const { Cron, Logs } = require('../model');
const Docker = require('dockerode');
const os = require('os')
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

// "cron_expression": "00 05 * * *",
const toggleCronState = async (req, res) => {
    try {
        const cronExist = await Cron.findOne({
            where: { id: req.params.id, deletedAt:null },
            attributes: ['id'],
            raw: true
        })
        if (!cronExist) {
            return responseHelper.error(res, 'CRONDOESNTEXIST404')
        }

        const { is_active } = await Cron.findOne({
            where: { id: req.params.id },
            attributes: ['is_active'],
            raw: true
        })
        await Cron.update({ is_active: !is_active },
            {
                where: { id: req.params.id, deletedAt: null }
            })
        setTimeout(() => { restartDocker() }, 500)
        return responseHelper.success(res, 'CRONTOGGLED200')

    }
    catch (ex) {
        return responseHelper.error(res, 'SERVER500')
    }
};

const updateCronJobExpression = async (req, res) => {
    try {
        const cronExist = await Cron.findOne({
            where: { id: req.params.id, deletedAt:null },
            attributes: ['id'],
            raw: true
        })
        if (!cronExist) {
            return responseHelper.error(res, 'CRONDOESNTEXIST404')
        }
        const { cron_job_name, req_method, req_payload,
            api_url, cron_expression } = req.body;
        //console.log(cron_expression);
        //const cron_expression = '00 00 * * *'
        await Cron.update({
            cron_job_name: cron_job_name,
            req_method: req_method,
            req_payload: req_payload,
            api_url: api_url,
            cron_expression: cron_expression,
        },
            {
                where: { id: req.params.id, deletedAt: null }
            })
        setTimeout(() => { restartDocker() }, 500)
        return responseHelper.success(res, 'CRONEXPRESSIONUPDATED200')
    }

    catch (ex) {
        return responseHelper.error(res, 'SERVER500')
    }
};

const fetchCronJobList = async (req, res) => {
    try {
        let page = "";
        if (req.query.page) {
            page = req.query.page;
        }
        else {
            page = 1;
        }
        const limit = 10;
        const { offset } = dbHelper.getOffset(page, limit)
        const cronList = await Cron.findAndCountAll({
            raw: true,
            offset: offset,
            limit: limit,
            attributes: ['id', 'cron_job_name', 'req_method', 'req_payload', 'cron_expression', 'is_active', 'api_url'],
            where: { deletedAt: null },
            order: [["createdAt", "DESC"]]
        })
        const { results, cursors } = dbHelper.getPaginatedStructureAndCount(cronList, limit, page)
        return responseHelper.success(res, 'CRONJOBLIST200', { results, cursors })
    }
    catch (ex) {
        return responseHelper.error(res, 'SERVER500')
    }

};

// "cron_job_name": "CRON_JOB_FOR_PRICE_UPDATES",
// "day": "['TUESDAY']",
// "time": "14:30:00",
// "cron_every_type": "WEEK",
// "cron_every_duration": "1",
// "cron_expression": "00 00 * * *",
// "is_active": true
const createCronJob = async (req, res) => {
    try {
        const { cron_job_name, req_method, req_payload, api_url, cron_expression, is_active } = req.body;
        await Cron.create({
            cron_job_name: cron_job_name,
            req_method: req_method,
            req_payload: req_payload,
            api_url: api_url,
            cron_expression: cron_expression,
            is_active: is_active
        })
        setTimeout(() => { restartDocker() }, 500)
        return responseHelper.success(res, 'CRONJOBCREATED201')
    }
    catch (ex) {
        return responseHelper.error(res, 'SERVER500')
    }
};

const deleteCronJob = async (req, res) => {
    try {
        const cronExist = await Cron.findOne({
            where: { id: req.params.id,deletedAt:null },
            attributes: ['id'],
            raw: true
        })
        if (!cronExist) {
            return responseHelper.error(res, 'CRONDOESNTEXIST404')
        }
        await Cron.destroy(
            {
                where: {
                    id: req.params.id,
                    deletedAt: null
                }
            })
        await Logs.destroy({
            where: {
                cron_id: req.params.id,
                deletedAt: null
            }
        })
        setTimeout(() => { restartDocker() }, 500)
        return responseHelper.success(res, 'CRONEXPRESSIONDELETED200')
    }
    catch (ex) {
        return responseHelper.error(res, 'SERVER500')
    }
};

const restartDocker = async () => {
    try {
        const dockerContainerId = os.hostname()
        const container = docker.getContainer(dockerContainerId);
        if (container) {
            await container.restart();
        }
    }
    catch (e) {
        console.log(e);
    }
};

module.exports = {
    toggleCronState,
    updateCronJobExpression,
    fetchCronJobList,
    createCronJob,
    deleteCronJob,
}