const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')

// get all notes
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(notes)
})

// get on note by id
notesRouter.get('/:id', (request, response, next) => {
  const id = request.params.id
  Note.findById(id)
    .then(note => {
      if (note) {
        response.send(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => {
      next(err)
    })
})

// create note
notesRouter.post('/', async (request, response, next) => {
  const { content, important = false, userId } = request.body
  const user = await User.findById(userId)

  if (!content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const newNote = new Note({
    content,
    date: new Date(),
    important,
    user: user._id
  })

  try {
    const saveNote = await newNote.save()
    console.log('saveNote', saveNote)
    user.notes = user.notes.concat(saveNote._id)
    await user.save()

    response.json(saveNote)
  } catch (err) {
    next(err)
  }
})

notesRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => next(err))
  response.status(204).end()
})

notesRouter.put('/:id', (request, response, next) => {
  const id = request.params.id
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(err => next(err))
})

module.exports = notesRouter
