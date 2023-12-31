import { ErorrResponse } from './errors/errorResponse'
import { errorHandler } from './errors/error'
import { autoNotification } from './helpers/autoSend.helper'
import mongoose, { ConnectOptions, Error } from 'mongoose'
import app from './app'
import * as https from 'https'
import * as http from 'http'
import cron from 'node-cron'
import path from 'path'
import fs from "fs"
// const options:any = {
//   key: fs.readFileSync(path.join(__dirname, `../../etc/letsencrypt/live/sarei3.com/privkey.pem`)),
//   cert: fs.readFileSync(path.join(__dirname, `../../etc/letsencrypt/live/sarei3.com/fullchain.pem`))
// };
const server = http.createServer(app)
  //Connecting to database
  ; (async () => {
    try {
      cron.schedule(`* * * */1 * *`, async () => {
        autoNotification()
      })
      const date = new Date(Date.now())
      await mongoose.connect(process.env.MONGO_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions)
      server.listen(process.env.PORT || 5000)
      console.log('Connected to database successfully')
      console.log('Server is running on port ' + process.env.PORT)
    } catch (err) {
      console.log('Error on DB Connecting: ' + (err as any).message)
      process.on('unhandelRejection', (err, promise) => {
        console.log(`Error : ${err.message}`)
        //close server & exit process
        server.close(() => process.exit(1))
      })
    }
  })()

export default server
