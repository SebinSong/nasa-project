const fs = require('fs');
const path = require('path')
const { parse } = require('csv-parse');

const habitablePlanets = [];

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
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on('error',(err) => reject(err))
      .on('end', () => {
        console.log(`DB ready to use - ${habitablePlanets.length} habitable planets found!`);
        resolve()
      });
  
  })
}

module.exports = {
  planets: habitablePlanets,
  initDB
}
