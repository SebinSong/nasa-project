const request = require('supertest')
const app = require('../../app')

describe('Test GET /launches', () => {
  test('It should respond with 200 success', async () => {
    const response = await request(app)
      .get('/launches')
      .expect('Content-Type', /json/)
      .expect(200)
  })
})

describe('Test POST /launches', () => {
  const testPayload = {
    mission: 'USS Enterprise',
    rocket: 'Sebin Custom II',
    destination: 'Kepler-186 f'
  }

  test('It should respond with 201 success', async () => {
    const requestDate = 'January 4, 2030'
    const response = await request(app)
      .post('/launches')
      .send({
        ...testPayload,
        launchDate: requestDate
      })
      .expect('Content-Type', /json/)
      .expect(201)

    expect(response.body).toMatchObject(testPayload)

    const responseDate = new Date(response.body.launchDate).valueOf()
    expect(responseDate).toBe(new Date(requestDate).valueOf())
  })

  test('It should catch missing required properties', async () => {
    const response = await request(app)
      .post('/launches')
      .send(testPayload) // missing 'launchDate' field in it
      .expect(400)

    expect(response.body).toStrictEqual({
      error: 'Missing required launch property'
    })
  })

  test('It should catch invalid dates', async () => {
    const response = await request(app)
      .post('/launches')
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