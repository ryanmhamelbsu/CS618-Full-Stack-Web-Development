import { Recipe } from '../db/models/recipe.js'

export async function createRecipe(
  userId,
  { title, ingredients, image },
) {
  const recipe = new Recipe({
    title,
    author: userId,
    ingredients,
    image,
  })

  return await recipe.save()
}

async function listRecipes(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Recipe.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllRecipes(options) {
  return await listRecipes({}, options)
}

export async function listRecipesByAuthor(author, options) {
  return await listRecipes({ author }, options)
}

export async function getRecipeById(recipeId) {
  return await Recipe.findById(recipeId)
}

export async function updateRecipe(
  userId,
  recipeId,
  { title, ingredients, image },
) {
  return await Recipe.findOneAndUpdate(
    { _id: recipeId, author: userId },
    { $set: { title, ingredients, image } },
    { new: true },
  )
}

export async function deleteRecipe(userId, recipeId) {
  return await Recipe.deleteOne({
    _id: recipeId,
    author: userId,
  })
}