const mongoose = require('mongoose')

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true
  },
  launchDate: {
    type: Date,
    required: true
  },
  mission: {
    type: String,
    required: true
  },
  rocket: {
    type: String,
    required: true
  },
  destination: {
    type: String
  },
  customers: {
    type: [String]
  },
  upcoming: {
    type: Boolean,
    requried: true
  },
  success: {
    type: Boolean,
    required: true,
    default: true
  }
})

// Connects launchesSchema with the 'launches' collection
const launchesModel = mongoose.model('Launch', launchesSchema)

module.exports = launchesModel
