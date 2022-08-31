const express = require('express')
const cors = require('cors')
const {environment:{PORT}} = require('./config')
const app = express()
const {cronHelper} = require('./helper')
const { sequelize } = require('./config')
const os = require('os')
const path = require('path')
// var corsOptions = {
//     origin: 'localhost:3000',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

app.use(express.static('dist'));
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}));


const distRouter = express.Router();
distRouter.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use('/', distRouter)

app.use('/api',require('./routes/cron-routes'))
app.use('/api',require('./routes/log-routes'))

app.listen(PORT, '0.0.0.0', async () => {
  try {
    // Run all cron Jobs at once
    await sequelize.sync();
    //console.log('should sync');
    const cronRunners = () => {
      cronHelper.scheduleCron.call();
    };
    cronRunners();
    //console.log(os.hostname())

} catch (ex) {
    console.log(ex);
}
  console.log(`App listening on port ${PORT}`)
})