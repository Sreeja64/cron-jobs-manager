const express = require('express')
const router = express.Router()
const {logsController} = require('../controller') 

//fetch log job list
router.get('/fetchLogsList/:cron_id', logsController.fetchLogsList)


//delete log
router.get('/deleteLog/:id', logsController.deleteLog)


//delete log by date
router.get('/deleteLogByDate/:cron_id', logsController.deleteLogByDate)


module.exports = router