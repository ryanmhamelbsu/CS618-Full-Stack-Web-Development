import 'dotenv/config'

import { initDatabase } from './src/db/init.js'
import { Recipe } from './src/db/models/recipe.js'
import { trackEvent } from './src/services/events.js'

async function simulateEvents() {
  const connection = await initDatabase()

  try {
    const recipe = await Recipe.findOne().sort({
      createdAt: -1,
    })

    if (!recipe) {
      console.log('No recipes found.')
      return
    }

    console.log(`Adding sample views to: ${recipe.title}`)

    const today = new Date()

    for (let day = 7; day >= 1; day--) {
      const views = 3 + Math.floor(Math.random() * 5)

      for (let i = 0; i < views; i++) {
        const sessionStart = new Date(today)

        sessionStart.setUTCDate(
          sessionStart.getUTCDate() - day,
        )

        sessionStart.setUTCHours(
          12,
          Math.floor(Math.random() * 60),
          0,
          0,
        )

        const sessionEnd = new Date(
          sessionStart.getTime() +
            1000 * Math.floor(Math.random() * 300),
        )

        const event = await trackEvent({
          recipeId: recipe._id,
          action: 'startView',
          date: sessionStart,
        })

        await trackEvent({
          recipeId: recipe._id,
          session: event.session,
          action: 'endView',
          date: sessionEnd,
        })
      }

      console.log(`Added ${views} views for ${day} days ago`)
    }

    console.log('Sample view data created successfully.')
  } finally {
    await connection.disconnect()
  }
}

simulateEvents().catch((err) => {
  console.error('error simulating events', err)
  process.exitCode = 1
})