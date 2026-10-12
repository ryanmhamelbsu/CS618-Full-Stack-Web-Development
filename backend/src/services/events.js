import { v4 as uuidv4 } from 'uuid'
import { Event } from '../db/models/event.js'

export async function trackEvent({
  recipeId,
  action,
  session = uuidv4(),
  date = Date.now(),
}) {
  const event = new Event({
    recipe: recipeId,
    action,
    session,
    date,
  })

  return await event.save()
}

export async function getTotalViews(recipeId) {
  return {
    views: await Event.countDocuments({
      recipe: recipeId,
      action: 'startView',
    }),
  }
}

export async function getDailyViews(recipeId) {
  return await Event.aggregate([
    {
      $match: {
        recipe: recipeId,
        action: 'startView',
      },
    },
    {
      $group: {
        _id: {
          $dateTrunc: { date: '$date', unit: 'day' },
        },
        views: { $count: {} },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])
}