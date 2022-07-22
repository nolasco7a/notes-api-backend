// middlware path error
module.exports = (request, response, next) => {
  response.status(404).send({ error: '404 not found' })
}
