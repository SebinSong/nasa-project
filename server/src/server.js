const http = require('http')
const path = require('path')

const { initDB: initPlanetsData } = require('./models/planets.model')
const { loadLaunchData } = require('./models/launches.model')
const { connectToDB } = require('./db.js')
const app = require('./app')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const PORT = process.env.API_PORT || 8000

const server = http.createServer(app)

async function startServer () {
  try {
    await connectToDB()
    await initPlanetsData()
    await loadLaunchData()

    server.listen(PORT, () => { console.log(`Listening on ${PORT}`) })
  } catch (err) {
    console.error('Cannot start-up the server due to an error while initializing DB: ', err)
    process.exit(1)
  }
}

startServer()
