import mongoose from 'mongoose'
import { describe, expect, test, beforeAll } from '@jest/globals'
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'
import { createUser } from '../services/users.js'

let testUser = null

beforeAll(async () => {
  testUser = await createUser({
    username: 'sample',
    password: 'user',
  })
})

describe('creating recipes', () => {
  test('with all parameters should succeed', async () => {
    const recipe = {
      title: 'Spaghetti',
      ingredients: ['spaghetti', 'tomato sauce', 'ground beef'],
      image: 'https://example.com/spaghetti.jpg',
    }

    const createdRecipe = await createRecipe(testUser._id, recipe)

    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundRecipe = await Recipe.findById(createdRecipe._id)
    expect(foundRecipe.title).toEqual(recipe.title)
    expect(foundRecipe.author).toEqual(testUser._id)
    expect(foundRecipe.ingredients).toEqual(recipe.ingredients)
    expect(foundRecipe.image).toEqual(recipe.image)
  })

  test('without title should fail', async () => {
    const recipe = {
      ingredients: ['spaghetti', 'tomato sauce'],
      image: 'https://example.com/spaghetti.jpg',
    }

    try {
      await createRecipe(testUser._id, recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
    }
  })

  test('with minimal parameters should succeed', async () => {
    const recipe = {
      title: 'Only a title',
    }

    const createdRecipe = await createRecipe(testUser._id, recipe)

    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

describe('listing recipes', () => {
  let sampleRecipes = []

  beforeAll(() => {
    sampleRecipes = [
      {
        title: 'Spaghetti',
        author: testUser._id,
        ingredients: ['spaghetti', 'tomato sauce'],
        image: 'https://example.com/spaghetti.jpg',
      },
      {
        title: 'Tacos',
        author: testUser._id,
        ingredients: ['ground beef', 'taco shells'],
        image: 'https://example.com/tacos.jpg',
      },
      {
        title: 'Pancakes',
        author: testUser._id,
        ingredients: ['flour', 'milk', 'eggs'],
        image: 'https://example.com/pancakes.jpg',
      },
    ]
  })

  test('should return all recipes', async () => {
    await Recipe.deleteMany({})
    await Recipe.insertMany(sampleRecipes)

    const recipes = await listAllRecipes()

    expect(recipes.length).toEqual(3)
  })

  test('should sort recipes by title', async () => {
    await Recipe.deleteMany({})
    await Recipe.insertMany(sampleRecipes)

    const recipes = await listAllRecipes({
      sortBy: 'title',
      sortOrder: 'ascending',
    })

    expect(recipes[0].title).toEqual('Pancakes')
    expect(recipes[1].title).toEqual('Spaghetti')
    expect(recipes[2].title).toEqual('Tacos')
  })

  test('should return recipes by author', async () => {
    await Recipe.deleteMany({})
    await Recipe.insertMany(sampleRecipes)

    const recipes = await listRecipesByAuthor(testUser._id)

    expect(recipes.length).toEqual(3)
  })
})

describe('getting, updating, and deleting recipes', () => {
  test('should get a recipe by id', async () => {
    const recipe = await createRecipe(testUser._id, {
      title: 'Get this recipe',
      ingredients: ['ingredient one', 'ingredient two'],
      image: 'https://example.com/recipe.jpg',
    })

    const foundRecipe = await getRecipeById(recipe._id)

    expect(foundRecipe._id).toEqual(recipe._id)
    expect(foundRecipe.title).toEqual('Get this recipe')
  })

  test('should update a recipe', async () => {
    const recipe = await createRecipe(testUser._id, {
      title: 'Original title',
      ingredients: ['original ingredient'],
      image: 'https://example.com/original.jpg',
    })

    const updatedRecipe = await updateRecipe(testUser._id, recipe._id, {
      title: 'Updated title',
      ingredients: ['updated ingredient'],
      image: 'https://example.com/updated.jpg',
    })

    expect(updatedRecipe.title).toEqual('Updated title')
    expect(updatedRecipe.ingredients).toEqual(['updated ingredient'])
    expect(updatedRecipe.image).toEqual('https://example.com/updated.jpg')
  })

  test('should delete a recipe', async () => {
    const recipe = await createRecipe(testUser._id, {
      title: 'Delete this recipe',
      ingredients: ['ingredient'],
      image: 'https://example.com/delete.jpg',
    })

    const result = await deleteRecipe(testUser._id, recipe._id)

    expect(result.deletedCount).toEqual(1)

    const deletedRecipe = await Recipe.findById(recipe._id)
    expect(deletedRecipe).toBeNull()
  })
})