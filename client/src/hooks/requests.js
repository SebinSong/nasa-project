const API_PORT = 8000
const API_ROOT_URL = `http://localhost:${API_PORT}/v1`

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
  try {
    const response = await fetch(`${API_ROOT_URL}/launches`, {
      method: 'post',
      body: JSON.stringify(launch),
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()

    if (data.error) {
      throw data.error
    }

    return { ok: true, data }
  } catch (error) {
    return { ok: false, error }
  }
}

async function httpAbortLaunch(id) {
  try {
    const data = await fetch(
      `${API_ROOT_URL}/launches/${id}`,
      { method: 'delete'}
    ).then(r => r.json())

    if (data.error) {
      throw data.error
    }

    return { ok: true, data }
  } catch (error) {
    return { ok: false, error }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};