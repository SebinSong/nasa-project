const axios = require('axios')

const launches = require('./launches.mongo.js')
const planets = require('./planets.mongo.js')

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'
const DEFAULT_FLIGHT_NUMBER = 100

async function populateDatabase () {
  const response = await axios.post(
    SPACEX_API_URL,
    {
      query: {},
      options: {
        pagination: false,
        populate: [
          { path: 'rocket', select: { name: 1 } },
          {
            path: 'payloads',
            select: { customers: 1 }
          }
        ]
      }
    }
  )

  if (response.status !== 200) {
    console.log('Problem downloading the data...')
    throw new Error('Launch data downloading failed')
  }

  const launchDocs = response.data.docs
  const docsToSave = []
  for (const launchDoc of launchDocs) {
    const { flight_number, name, rocket, payloads, date_local } = launchDoc
    const launch = {
      flightNumber: flight_number,
      mission: name,
      rocket: rocket.name,
      customers: payloads.flatMap(payload => payload.customers),
      upcoming: launchDoc.upcoming,
      success: launchDoc.success || false,
      launchDate: date_local
    }

    docsToSave.push(launch)
  }

  // populate launches collection
  await launches.create(docsToSave)
  console.log(`'${docsToSave.length}' launches have been saved to DB...`)
}

async function loadLaunchData () {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  })

  if (firstLaunch) {
    console.log('Launch data already loaded')
    return true
  } else {
    await populateDatabase()
  }
}

async function findLaunch (filter) {
  return await launches.findOne(filter)
}

function launchExists (flightNumber) {
  return findLaunch({ flightNumber })
}

async function saveLaunch (launch) {
  try {
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

async function getAllLaunches ({ skip, limit }) {
  const allLaunches = await launches.find({}, { '_id': 0, '__v': 0 })
    .sort({ flightNumber: 1 })
    .skip(skip).limit(limit)

  return allLaunches
}

async function scheduleNewLaunch (launch) {
  const planet = await planets.findOne({
    keplerName: launch.destination
  })

  if (!planet) {
    throw new Error('No matching planet found.')
  }

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
  loadLaunchData,
  getAllLaunches,
  scheduleNewLaunch,
  saveLaunch,
  deleteLaunch,
  abortLaunchById,
  launchExists,
  findLaunch
}
