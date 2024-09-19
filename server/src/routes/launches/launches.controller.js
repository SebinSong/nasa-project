// model
const {
  getAllLaunches,
  scheduleNewLaunch,
  deleteLaunch,
  abortLaunchById,
  launchExists
} = require('../../models/launches.model')
const { getPagination } = require('../../helpers')

const isDate = v => !isNaN(new Date(v))

async function httpGetAllLaunches (req, res) {
  const allLaunches = await getAllLaunches(getPagination(req.query))
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

  const success = await scheduleNewLaunch({
    mission, rocket, destination,
    launchDate: new Date(launchDate)
  })

  return success
    ? res.status(201).json({ ok: true })
    : res.status(422).json({ error: 'Cannot process the data' })
}

async function httpAbortLaunch (req, res) {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({
      error: 'Missing id parameter'
    })
  }

  const existsLaunch = await launchExists(id)
  if (!existsLaunch) {
    return res.status(404).json({
      error: `Launch item [${id}] was not found.`
    })
  }

  const aborted = await abortLaunchById(id)
  return aborted
    ? res.status(200).json({
        message: `successfully aborted - [${id}].`
      })
    : res.status(500).json({
        message: `Could not abort the launch - [${id}]`
      })
}

module.exports = {
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch
}
