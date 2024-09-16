const launches = require('./launches.mongo.js')
const planets = require('./planets.mongo.js')

const DEFAULT_FLIGHT_NUMBER = 100
const launch = {
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  destination: 'Kepler-442 b',
  customers: ['NASA', 'ZTM'],
  flightNumber: 100,
  upcoming: true,
  success: true
}

async function saveLaunch (launch) {
  try {
    const planet = await planets.findOne({
      keplerName: launch.destination
    })

    if (!planet) {
      throw new Error('No matching planet found.')
    }

    const res = await launches.findOneAndUpdate(
      { flightNumber: launch.flightNumber },
      launch,
      { upsert: true }
    )

    return res === null
  } catch (err) {
    console.error(`Could not save a launch: ${err}`)
  }
}

async function getLatestFlightNumber () {
  const lastestLaunch = await launches.findOne().sort('-flightNumber') // highest number is the first
  return lastestLaunch
    ? lastestLaunch.flightNumber
    : DEFAULT_FLIGHT_NUMBER
}

async function getAllLaunches () {
  const allLaunches = await launches.find({}, { '_id': 0, '__v': 0 })
  return allLaunches
}

async function launchExists (flightNumber) {
  return await launches.findOne({ flightNumber })
}

async function scheduleNewLaunch (launch) {
  const flightNumber = (await getLatestFlightNumber()) + 1
  const newLaunch = Object.assign(launch, {
    flightNumber,
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
  })

  return await saveLaunch(newLaunch)
}

function deleteLaunch (id) {
  return launches.delete(id)
}

async function abortLaunchById (launchId) {
  const aborted = await launches.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success:false
    }
  )

  return aborted.acknowledged && aborted.modifiedCount === 1
}

module.exports = {
  launches,
  getAllLaunches,
  scheduleNewLaunch,
  saveLaunch,
  deleteLaunch,
  abortLaunchById,
  launchExists
}
