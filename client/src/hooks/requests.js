const API_PORT = 8000
const API_ROOT_URL = `http://localhost:${API_PORT}`

async function httpGetPlanets() {
  // Load planets and return as JSON.
  const response = await fetch(
    `${API_ROOT_URL}/planets`
  ).then(r => r.json())

  return response
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(
    `${API_ROOT_URL}/launches`
  ).then(r => r.json())

  response.sort((a, b) => a.flightNumber - b.flightNumber)

  return response
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};