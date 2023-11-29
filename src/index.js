import express from 'express'
import paymentRoutes from './routes/payment.route.js'
import {PORT} from './config.js'
import path from 'path'

const app = express()
app.use(paymentRoutes);
app.use(express.static(path.resolve('src/public'))) /**path para no usar la url completa */
app.listen(PORT)
console.log('Server on port', PORT)