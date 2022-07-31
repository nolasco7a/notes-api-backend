const mongoose = require('mongoose')
const Note = require('../models/Note')
const { server } = require('../index')
const { api, initialNotes, getAllContentFromNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})
  // sequential execution
  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})

describe('GET api/notes', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('the first note is about a any topic', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(note => note.content)
    expect(contents).toContain('Aprendiendo node')
  })
})

describe('POST api/notes', () => {
  test('new note', async () => {
    const newNote = {
      content: 'Aprendiendo test',
      important: true,
      date: new Date()
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/notes')
    const contents = response.body.map(note => note.content)
    expect(response.body).toHaveLength(initialNotes.length + 1)
    expect(contents).toContain('Aprendiendo test')
  })
  test('note without content is not added', async () => {
    const newNote = {
      important: true
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('DELETE api/notes', () => {
  test('a note can be deleted', async () => {
    const { response: firstResponse } = await getAllContentFromNotes()
    const { body: notes } = firstResponse
    const noteToDelete = notes[0]
    await api
      .delete(`/api/notes/${noteToDelete.id}`)
      .expect(204)

    const { contents, response: secondResponse } = await getAllContentFromNotes()
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1)

    expect(contents).not.toContain(noteToDelete.content)
  })

  test('a note that do not exist can not be deleted', async () => {
    await api
      .delete('/api/notes/123123')
      .expect(204)

    const { response: allNotes } = await getAllContentFromNotes()
    expect(allNotes.body).toHaveLength(initialNotes.length)
  })
})

afterAll(() => {
  server.close()
  mongoose.connection.close()
})
