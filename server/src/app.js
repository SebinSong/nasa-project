const express = require('express')
const app = express()

// routers
const planetsRouter = require('./routes/planets/planets.router')

// global middlewares
app.use(express.json())

// setup routes
app.use('/planets', planetsRouter)

module.exports = app