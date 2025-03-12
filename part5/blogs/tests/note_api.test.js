const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)

const initialBlogs = [
  {
    title: "hey guys",
    author: "pewdiepie",
    url: "lol.com",
    likes: 3000
  },
  {
    title: "Nooo",
    author: "Speed",
    url: "twitch.com",
    likes: 100000
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('id attribute is correctly named', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => {
    assert(blog.id)
  })
})

test('blog is correctly posted', async () => {
  const newBlog = {
    title: "test",
    author: "noone",
    url: "test.com",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)

  const blogsAtEnd = (await api.get('/api/blogs')).body
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
})

test('like property is 0 by default', async () => {
  const newBlog = {
    title: "test",
    author: "noone",
    url: "test.com"
  }

  const addedBlog = (await api
    .post('/api/blogs')
    .send(newBlog)).body

  assert.strictEqual(addedBlog.likes, 0)
})

test('title and url properties are required', async () => {
  const newBlog1 = {
    author: "noone",
    url: "test.com"
  }

  await api
    .post('/api/blogs')
    .send(newBlog1)
    .expect(400)

  const newBlog2 = {
    title: "test",
    author: "noone"
  }

  await api
    .post('/api/blogs')
    .send(newBlog2)
    .expect(400)
})

test('a blog is deleted correctly', async () => {
  const newBlog1 = {
    title: "test",
    author: "noone",
    url: "test.com"
  }

  const postedBlog = (await api
    .post('/api/blogs')
    .send(newBlog1)).body

  await api
    .delete('/api/blogs/' + postedBlog.id) 
    .expect(204)
})

test('likes are updated correctly', async () => {
  const newBlog1 = {
    title: "test",
    author: "noone",
    url: "test.com",
    likes: 100
  }

  const postedBlog = (await api
    .post('/api/blogs')
    .send(newBlog1)).body
  const updatedBlog = {...postedBlog, likes: 200}

  const putUpdatedBlog = (await api
    .put('/api/blogs/' + updatedBlog.id)
    .send(updatedBlog)).body

  assert.deepStrictEqual(putUpdatedBlog.id, postedBlog.id)
  assert.deepStrictEqual(putUpdatedBlog.likes, 200)
})

after(async () => {
  await mongoose.connection.close()
})