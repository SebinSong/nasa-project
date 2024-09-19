const path = require('path')
const mongoose = require('mongoose')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!')
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URL)
  } catch (err) {
    throw err
  }
}

const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
  } catch (err) {
    throw err
  }
}

module.exports = {
  connectToDB,
  disconnectDB
}
