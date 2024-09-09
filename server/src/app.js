const path = require('path')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const serveStaticPath = path.resolve(__dirname, '../public')

// routers
const planetsRouter = require('./routes/planets/planets.router')
const launchesRouter = require('./routes/launches/launches.router')


// global middlewares
app.use(morgan('combined'))
app.use(cors({
  orgin: 'http://localhost:3000'
}))
app.use(express.json())

// setup routes
app.use('/launches', launchesRouter)
app.use('/planets', planetsRouter)

// serve-static
app.use(express.static(serveStaticPath))

app.get('/', (req, res) => {
  // any route that is not api will be redirected to index.html
  res.sendFile(path.join(serveStaticPath, 'index.html'))
})


module.exports = app