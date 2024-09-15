const mongoose = require('mongoose')

const MONGO_URL = 'mongodb+srv://nasa-api:sebin123@sebinfreecluster.vcv3dkf.mongodb.net/nasa?retryWrites=true&w=majority&appName=SebinFreeCluster'

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
module.exports = {
  connectToDB
}
