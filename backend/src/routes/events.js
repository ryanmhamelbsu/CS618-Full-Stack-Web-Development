import {
  trackEvent,
  getTotalViews,
  getDailyViews,
} from '../services/events.js'

import { getRecipeById } from '../services/recipes.js'

export function eventRoutes(app) {
  app.post('/api/v1/events', async (req, res) => {
    try {
      const { recipeId, session, action } = req.body

      if (
        !recipeId ||
        !['startView', 'endView'].includes(action)
      ) {
        return res.status(400).end()
      }

      const recipe = await getRecipeById(recipeId)

      if (recipe === null) {
        return res.status(400).end()
      }

      const event = await trackEvent({
        recipeId,
        session,
        action,
      })

      return res.json({ session: event.session })
    } catch (err) {
      console.error('error tracking action', err)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/events/totalViews/:recipeId', async (req, res) => {
    try {
      const recipe = await getRecipeById(req.params.recipeId)

      if (recipe === null) {
        return res.status(400).end()
      }

      const stats = await getTotalViews(recipe._id)
      return res.json(stats)
    } catch (err) {
      console.error('error getting total views', err)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/events/dailyViews/:recipeId', async (req, res) => {
    try {
      const recipe = await getRecipeById(req.params.recipeId)

      if (recipe === null) {
        return res.status(400).end()
      }

      const stats = await getDailyViews(recipe._id)
      return res.json(stats)
    } catch (err) {
      console.error('error getting daily views', err)
      return res.status(500).end()
    }
  })
}