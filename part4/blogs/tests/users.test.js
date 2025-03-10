const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)

test("Can't create a user without password", async () => {
    const newUser = {
      username: "user2",
      name: "name2"
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
})

test("Can't create a user without username", async () => {
    const newUser = {
      password: "pass2",
      name: "name2"
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
})

test("Username must have at least 3 chars", async () => {
    const newUser = {
        username: "us",
        password: "pass2",
        name: "name2"
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
})