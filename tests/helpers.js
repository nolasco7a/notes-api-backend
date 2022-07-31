const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/User')

const initialNotes = [
  {
    content: 'Aprendiendo node',
    important: true,
    date: new Date()
  },
  {
    content: 'Aprendiendo express',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(u => u.toJSON())
}

module.exports = {
  api,
  server,
  initialNotes,
  getAllContentFromNotes,
  getUsers
}
