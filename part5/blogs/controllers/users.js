const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { ValidationError } = require('mongoose').Error;

usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({}).populate('blogs')
  
    response.json(fixedUsers)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!password) {
        const error = new ValidationError()
        error.message = "You must set a password"
        throw error
    }
    else if (password.length < 3) {
        const error = new ValidationError()
        error.message = "Password must be 3 or more characters long"
        throw error
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })
    
    const savedUser = await user.save()
    
    response.status(201).json(savedUser)
})

module.exports = usersRouter