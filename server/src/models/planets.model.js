const fs = require('fs');
const path = require('path')
const { parse } = require('csv-parse');

const planets = require('./planets.mongo')

// helpers
function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function initDB () {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.resolve(__dirname, '../../data/kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data)
        }
      })
      .on('error',(err) => reject(err))
      .on('end', async () => {
        const allPlanets = await getAllPlanets()
        console.log(`DB ready to use - ${allPlanets.length} habitable planets found!`);
        resolve()
      });
  
  })
}

async function getAllPlanets () {
  const allPlanets = await planets.find({}, { '__v': 0 })
  return allPlanets
}

async function savePlanet (planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name }, // find filter
      { keplerName: planet.kepler_name }, // update objects
      { upsert: true } // create one if it doesn't exist
    )
  } catch (err) {
    console.error(`Could not save a planet: ${err}`)
  }
}

module.exports = {
  getAllPlanets,
  initDB
}
