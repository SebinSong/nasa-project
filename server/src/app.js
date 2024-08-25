const express = require('express')
const cors = require('cors')

const app = express()

// routers
const planetsRouter = require('./routes/planets/planets.router')

// global middlewares
app.use(cors({
  orgin: 'http://localhost:3000'
}))
app.use(express.json())

// setup routes
app.use('/planets', planetsRouter)

module.exports = app