const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  if (!request.user.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(request.user.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })
  const savedBlog = await blog.save()
  const populatedBlog = await Blog.findById(savedBlog.id).populate('user')

  user.blogs = user.blogs.concat(savedBlog.id)

  await user.save()
  
  return response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'not your log bro' })
  } else {
    await Blog.deleteOne(blog)
    return response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes }, { new: true, runValidators: true, context: 'query' }).populate('user') 
  response.json(updatedBlog)
})

module.exports = blogsRouter