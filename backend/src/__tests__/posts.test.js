import mongoose from 'mongoose'
import { describe, expect, test, beforeAll } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
import { createUser } from '../services/users.js'

let testUser = null

beforeAll(async () => {
  testUser = await createUser({
    username: 'sample',
    password: 'user',
  })
})

describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      contents: 'This is my first post',
      tags: ['mongoose', 'mongodb'],
    }

    const createdPost = await createPost(testUser._id, post)

    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost.title).toEqual(post.title)
    expect(foundPost.author).toEqual(testUser._id.toString())
    expect(foundPost.contents).toEqual(post.contents)
    expect(foundPost.tags).toEqual(post.tags)
  })

  test('without title should fail', async () => {
    const post = {
      contents: 'Post with no title',
      tags: ['empty'],
    }

    try {
      await createPost(testUser._id, post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    }
  })

  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
    }

    const createdPost = await createPost(testUser._id, post)

    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

describe('listing posts', () => {
  let samplePosts = []

  beforeAll(() => {
    samplePosts = [
      {
        title: 'Learning Mongoose',
        author: testUser._id,
        contents: 'Learning about Mongoose',
        tags: ['mongoose', 'mongodb'],
      },
      {
        title: 'Learning React',
        author: testUser._id,
        contents: 'Learning about React',
        tags: ['react', 'javascript'],
      },
      {
        title: 'Learning Node',
        author: testUser._id,
        contents: 'Learning about Node',
        tags: ['node', 'javascript'],
      },
    ]
  })

  test('should return all posts', async () => {
    await Post.deleteMany({})
    await Post.insertMany(samplePosts)

    const posts = await listAllPosts()

    expect(posts.length).toEqual(3)
  })

  test('should sort posts by title', async () => {
    await Post.deleteMany({})
    await Post.insertMany(samplePosts)

    const posts = await listAllPosts({
      sortBy: 'title',
      sortOrder: 'ascending',
    })

    expect(posts[0].title).toEqual('Learning Mongoose')
    expect(posts[1].title).toEqual('Learning Node')
    expect(posts[2].title).toEqual('Learning React')
  })

  test('should return posts by author', async () => {
    await Post.deleteMany({})
    await Post.insertMany(samplePosts)

    const posts = await listPostsByAuthor(testUser._id)

    expect(posts.length).toEqual(3)
  })

  test('should return posts by tag', async () => {
    await Post.deleteMany({})
    await Post.insertMany(samplePosts)

    const posts = await listPostsByTag('javascript')

    expect(posts.length).toEqual(2)
    expect(posts.every((post) => post.tags.includes('javascript'))).toBe(true)
  })
})

describe('getting, updating, and deleting posts', () => {
  test('should get a post by id', async () => {
    const post = await createPost(testUser._id, {
      title: 'Get this post',
      contents: 'Post contents',
      tags: ['test'],
    })

    const foundPost = await getPostById(post._id)

    expect(foundPost._id).toEqual(post._id)
    expect(foundPost.title).toEqual('Get this post')
  })

  test('should update a post', async () => {
    const post = await createPost(testUser._id, {
      title: 'Original title',
      contents: 'Original contents',
      tags: ['original'],
    })

    const updatedPost = await updatePost(testUser._id, post._id, {
      title: 'Updated title',
      contents: 'Updated contents',
      tags: ['updated'],
    })

    expect(updatedPost.title).toEqual('Updated title')
    expect(updatedPost.contents).toEqual('Updated contents')
    expect(updatedPost.tags).toEqual(['updated'])
  })

  test('should delete a post', async () => {
    const post = await createPost(testUser._id, {
      title: 'Delete this post',
      contents: 'This post will be deleted',
      tags: ['delete'],
    })

    const result = await deletePost(testUser._id, post._id)

    expect(result.deletedCount).toEqual(1)

    const deletedPost = await Post.findById(post._id)
    expect(deletedPost).toBeNull()
  })
})

