require('dotenv').config()
require('./mongo.js')

const express = require('express')
const cors = require('cors')
const app = express()
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')
const userRouter = require('./controllers/users')
const notesRouter = require('./controllers/notes')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

Sentry.init({
  dsn: 'https://202b17b0f2d14d9fa046fa6a9889ca67@o1331226.ingest.sentry.io/6594859',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
})
app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

// aservir archivos estaticos
app.use('/images', express.static('images'))
app.use(cors())
app.use(express.json())

// home api
app.get('/', (request, response) => {
  response.send('<h1>Aplication notes</h1>')
})

app.use('/api/notes', notesRouter)
app.use('/api/users', userRouter)

// el orden de middleware es importante, se lee de arriba hacia abajo
// primero intentara entrar a la rutas superiores
app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
