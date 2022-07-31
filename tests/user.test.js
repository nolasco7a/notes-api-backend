const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')
const mongoose = require('mongoose')
const { server } = require('../index')

describe.only('creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'nolasco7a1', name: 'Allan', passwordHash })

    await user.save()
  })

  test('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()

    const newUser = ({
      username: 'nolasco7a2',
      name: 'Nolasco',
      password: 'sekret'
    })

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const userNames = usersAtEnd.map(u => u.username)
    expect(userNames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username is already taken', async () => {
    const usersStart = await getUsers()

    const newUser = ({
      username: 'nolasco7a1',
      name: 'Nolasco',
      password: 'sekret'
    })

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.errors.username.message).toContain('`username` to be unique')

    const usersEnd = await getUsers()
    expect(usersEnd).toHaveLength(usersStart.length)
  })
})

describe('get users', () => {
  // ...
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
