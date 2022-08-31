const { Cron, Logs } = require('../model');
const scheduler = require('node-schedule');
const axios = require('axios').default;

const scheduleCron = async () => {
    const cronList = await Cron.findAll({
        raw: true,
        attributes: ['id', 'cron_job_name', 'req_method', 'req_payload', 'api_url', 'cron_expression', 'is_active'],
        where: { deletedAt: null }
    })
    if (cronList.length > 0) {
        console.log('cron running');
        cronList.forEach(async (cron) => {
            if (cron.is_active) {
                scheduler.scheduleJob(`${cron.cron_expression}`, async () => {
                    console.log(`====Starting ${cron.cron_job_name}====`);
                    let response = '';
                    let start = Date.now();
                    try {
                        if (cron.req_method == 'GET') {
                            response = await axios({
                                url: cron.api_url,
                                method: cron.req_method
                            })
                        }
                        else if (cron.req_method == 'POST') {
                            response = await axios({
                                url: cron.api_url,
                                method: cron.req_method,
                                body: JSON.stringify({ ...cron.req_payload })
                            })
                        }
                        else if (cron.req_method == 'PUT') {
                            response = await axios({
                                url: cron.api_url,
                                method: cron.req_method,
                                body: JSON.stringify({ ...cron.req_payload })
                            })
                        }
                        else if (cron.req_method == 'DELETE') {
                            response = await axios({
                                url: cron.api_url,
                                method: cron.req_method,
                            })
                        }
                        //console.log(response);
                        let end = Date.now();
                        await Logs.create({
                            cron_job_name: cron.cron_job_name,
                            cron_id: cron.id,
                            time: `${(end - start) / 1000} s`,
                            response_status: response.status
                        })
                    }
                    catch (ex) {
                        let end = Date.now();
                        await Logs.create({
                            cron_job_name: cron.cron_job_name,
                            cron_id: cron.id,
                            time: `${(end - start) / 1000} s`,
                            response_status: ex.response ? ex.response.status : 500
                        })
                    }

                    // const logList = await Logs.findAll({
                    //     raw: true,
                    //     attributes: ['id', 'cron_job_name', 'cron_id',
                    //         'response_status', 'time',],
                    //     where: { deletedAt: null }
                    // })
                    //console.log(logList);
                });
            }
        });
    }
}
module.exports = { scheduleCron };