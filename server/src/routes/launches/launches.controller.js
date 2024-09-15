// model
const {
  getAllLaunches,
  scheduleNewLaunch,
  deleteLaunch,
  abortLaunchById
} = require('../../models/launches.model')

const isDate = v => !isNaN(new Date(v))

async function httpGetAllLaunches (req, res) {
  const allLaunches = await getAllLaunches()
  return res.status(200).json(allLaunches)
}

async function httpPostLaunch (req, res) {
  const {
    mission, rocket, destination, launchDate
  } = req.body

  if (!mission || !rocket || !destination || !launchDate) {
    return res.status(400).json({
      error: 'Missing required launch property'
    })
  }

  if (!isDate(launchDate)) {
    return res.status(400).json({
      error: 'launchDate is invalid'
    })
  }

  const newEntry = await scheduleNewLaunch({
    mission, rocket, destination,
    launchDate: new Date(launchDate)
  })

  return newEntry
    ? res.status(201).json(newEntry)
    : res.status(422).json({ error: 'Cannot process the data' })
}

function httpAbortLaunch (req, res) {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      error: 'Missing id parameter'
    })
  }

  const aborted = abortLaunchById(id)

  return aborted
    ? res.status(200).json({
        message: `successfully aborted - [${id}].`,
        abortedLaunch: aborted
      })
    : res.status(404).json({
      error: `Launch item [${id}] was not found.`
    })
}

module.exports = {
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch
}
