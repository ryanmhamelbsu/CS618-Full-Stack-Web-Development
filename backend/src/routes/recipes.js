
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  getRecipeById,
  likeRecipe,
  updateRecipe,
  deleteRecipe,
} from '../services/recipes.js'

import { requireAuth } from '../middleware/jwt.js'

export function recipesRoutes(app) {
  app.get('/api/v1/recipes', async (req, res) => {
    const { sortBy, sortOrder, author } = req.query
    const options = { sortBy, sortOrder }

    try {
      if (author) {
        return res.json(await listRecipesByAuthor(author, options))
      }

      return res.json(await listAllRecipes(options))
    } catch (err) {
      console.error('error listing recipes', err)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/recipes/:id', async (req, res) => {
    try {
      const recipe = await getRecipeById(req.params.id)

      if (recipe === null) {
        return res.status(404).end()
      }

      return res.json(recipe)
    } catch (err) {
      console.error('error getting recipe', err)
      return res.status(500).end()
    }
  })

  app.post('/api/v1/recipes', requireAuth, async (req, res) => {
    try {
      const recipe = await createRecipe(req.auth.sub, req.body)

      // Broadcast the new recipe to all connected users
      const io = req.app.get('io')

      if (io) {
        io.emit('recipe.added', {
          _id: recipe._id,
          title: recipe.title,
          author: recipe.author,
        })
      }

      return res.json(recipe)
    } catch (err) {
      console.error('error creating recipe', err)
      return res.status(500).end()
    }
  })

  app.post('/api/v1/recipes/:id/like', requireAuth, async (req, res) => {
    try {
      const recipe = await likeRecipe(req.auth.sub, req.params.id)

      if (recipe === null) {
        return res.status(404).end()
      }

      return res.json(recipe)
    } catch (err) {
      console.error('error liking recipe', err)
      return res.status(500).end()
    }
  })

  app.patch('/api/v1/recipes/:id', requireAuth, async (req, res) => {
    try {
      const recipe = await updateRecipe(
        req.auth.sub,
        req.params.id,
        req.body,
      )

      return res.json(recipe)
    } catch (err) {
      console.error('error updating recipe', err)
      return res.status(500).end()
    }
  })

  app.delete('/api/v1/recipes/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deleteRecipe(
        req.auth.sub,
        req.params.id,
      )

      if (deletedCount === 0) {
        return res.status(404).end()
      }

      return res.status(204).end()
    } catch (err) {
      console.error('error deleting recipe', err)
      return res.status(500).end()
    }
  })
}
