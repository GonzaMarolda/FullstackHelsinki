const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    } else if (error.name ===  'JsonWebTokenError') {
      return response.status(400).json({ error: 'token missing or invalid' })
    }; 
    
    next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
    console.log("Extracted token: " + request.token)
  }
  next()
}

const userExtractor = (request, response, next) => {
  if (request.token) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = {username: decodedToken.username, id: decodedToken.id}
    console.log("Extracted user: " + request.user)
  }
  next()
}

module.exports = {
    errorHandler, tokenExtractor, userExtractor
}