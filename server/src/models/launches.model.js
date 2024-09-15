// const launches = require('./launches.mongo.js')

const launches = new Map()
let latestFlightNumber = 99

const launch = {
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  destination: 'Kepler-442 b'
}

addNewLaunch(launch)

function getAllLaunches () {
  return Array.from(launches.values())
}

function launchExists (launchId) {
  console.log('!@# launches.has(launchId): ', launches.has(launchId))
  return launches.has(launchId)
}

function addNewLaunch (launch) {
  latestFlightNumber += 1

  const flightNumber = `${latestFlightNumber}`
  launches.set(
    flightNumber,
    Object.assign(launch, {
      flightNumber,
      customer: ['ZTM', 'NASA'],
      upcoming: true,
      success: true
    })
  )

  const newLaunch = launches.get(flightNumber)
  return newLaunch || null
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
  addNewLaunch,
  deleteLaunch,
  abortLaunchById
}
