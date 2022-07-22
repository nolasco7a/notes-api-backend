const mongoose = require('mongoose')
const connetcionString = process.env.MONGO_DB_URI

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
