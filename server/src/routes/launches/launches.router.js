const express = require('express')
const launchesRouter = express.Router()

const {
  httpGetAllLaunches,
  httpPostLaunch,
  httpAbortLaunch
} = require('./launches.controller')

launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpPostLaunch)
launchesRouter.delete('/:id', httpAbortLaunch)

module.exports = launchesRouter
