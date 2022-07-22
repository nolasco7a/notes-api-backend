require('dotenv').config()
require('./mongo.js')

const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/Note.js')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

Sentry.init({
  dsn: 'https://202b17b0f2d14d9fa046fa6a9889ca67@o1331226.ingest.sentry.io/6594859',
  // or pull from params
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
  // or pull from params
  // tracesSampleRate: parseFloat(params.SENTRY_TRACES_SAMPLE_RATE),
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// aservir archivos estaticos
app.use('/images', express.static('images'))
app.use(cors())
app.use(express.json())

// home api
app.get('/', (request, response) => {
  response.send('<h1>Aplication notes</h1>')
})

// get all notes
app.get('/api/notes', (request, response) => {
  Note.find({})
    .then(notes => {
      response.json(notes)
    })
})

// get on note by id
app.get('/api/notes/:id', (request, response, next) => {
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
app.post('/api/notes', (request, response, next) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important || false
  })
  newNote.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(err => next(err))
})

app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => next(err))
  response.status(204).end()
})

app.put('/api/notes/:id', (request, response, next) => {
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

// el orden de middleware es importante, se lee de arriba hacia abajo
// primero intentara entrar a la rutas superiores
app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
