import express from 'express';
import dotenv from 'dotenv';
import homeRoute from './routes/homeRoute';
import fbWebhookRoute from './routes/fbWebhookRoute';

dotenv.config();
const webApp = express()

const port = process.env.PORT || 5000

webApp.use(express.urlencoded({ extended: true }))
webApp.use(express.json())
webApp.use((req, res, next) => {
  console.log(`Path ${req.path} - Method ${req.method}`)
  next()
});

webApp.use('/', homeRoute.router)
webApp.use('/facebook', fbWebhookRoute.router)

webApp.listen(port, () => {
  console.log(`Listening on port ${port}`)
})