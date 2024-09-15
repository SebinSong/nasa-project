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

saveLaunch(launch)

async function saveLaunch (launch) {
  try {
    const planet = await planets.findOne({
      keplerName: launch.destination
    })

    if (!planet) {
      throw new Error('No matching planet found.')
    }

    const savedLaunch = await launches.updateOne(
      { flightNumber: launch.flightNumber },
      launch,
      { upsert: true }
    )
    
    return savedLaunch
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

function launchExists (launchId) {
  console.log('!@# launches.has(launchId): ', launches.has(launchId))
  return launches.has(launchId)
}

async function scheduleNewLaunch (launch) {
  const flightNumber = (await getLatestFlightNumber()) + 1
  const newLaunch = Object.assign(launch, {
    flightNumber,
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true
  })

  const saved = await saveLaunch(newLaunch)
  return saved || null
}

function deleteLaunch (id) {
  return launches.delete(id)
}

function abortLaunchById (launchId) {
  if (!launchExists(launchId)) { return null }

  const launch = launches.get(launchId)
  launch.upcoming = false
  launch.success = false

  return launch
}

module.exports = {
  launches,
  getAllLaunches,
  scheduleNewLaunch,
  saveLaunch,
  deleteLaunch,
  abortLaunchById
}
