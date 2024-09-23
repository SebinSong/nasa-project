const request = require('supertest')
const app = require('../../app')
const { connectToDB, disconnectDB } = require('../../db')
const { initDB: initPlanetsData } = require('../../models/planets.model')

describe('Launches API', () => {
  beforeAll(async () => {
    await connectToDB()
    await initPlanetsData()
  })

  afterAll(async () => {
    await disconnectDB()
  })

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
  
  describe('Test POST /launches', () => {
    const testPayload = {
      mission: 'USS Enterprise',
      rocket: 'Sebin Custom II',
      destination: 'Kepler-1652 b'
    }
  
    test('It should respond with 201 success', async () => {
      const requestDate = 'January 4, 2030'
      const response = await request(app)
        .post('/v1/launches')
        .send({
          ...testPayload,
          launchDate: requestDate
        })
        .expect('Content-Type', /json/)
        .expect(201)
  
      expect(response.body).toMatchObject({ ok: true })
    })
  
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(testPayload) // missing 'launchDate' field in it
        .expect(400)
  
      expect(response.body).toStrictEqual({
        error: 'Missing required launch property'
      })
    })
  
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send({
          ...testPayload,
          launchDate: 'hello' // invalid launchDate field
        })
        .expect(400)
  
      expect(response.body).toStrictEqual({
        error: 'launchDate is invalid'
      })
    })
  })
})
