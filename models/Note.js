const { Schema, model } = require('mongoose')
// create new schema for notes
const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

// tranformando la respuesta en algo mas legible
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// create new model for notes
const Note = model('Note', noteSchema)

module.exports = Note