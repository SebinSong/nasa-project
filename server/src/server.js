const http = require('http')

const { initDB } = require('./models/planets.model')
const app = require('./app')

const PORT = process.env.API_PORT || 8000
const server = http.createServer(app)

async function startServer () {
  try {
    await initDB()
    server.listen(PORT, () => { console.log(`Listening on ${PORT}`) })
  } catch (err) {
    console.error('Cannot start-up the server due to an error while initializing DB: ', err)
    process.exit(1)
  }
}

startServer()
