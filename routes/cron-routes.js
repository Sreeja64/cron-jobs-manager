const express = require('express')
const router = express.Router()
const {cronController} = require('../controller') 


//create cron job
router.post('/createCronJob', cronController.createCronJob)

//fetch cron job list
router.get('/fetchCronJobList', cronController.fetchCronJobList)

//update cron job expression
router.post('/updateCronJobExpression/:id', cronController.updateCronJobExpression)

//toggle active/inactive state
router.get('/toggleCronState/:id', cronController.toggleCronState)

//delete cron job
router.get('/deleteCronJob/:id', cronController.deleteCronJob)

module.exports = router