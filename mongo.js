const mongoose = require('mongoose')
const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env
const connetcionString = NODE_ENV === 'development' || NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

// conexion a la base de datos
mongoose.connect(connetcionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('connected to mongoDB')
  })
  .catch(error => {
    console.log('error connecting to mongoDB: ', error)
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
