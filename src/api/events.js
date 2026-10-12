export const postTrackEvent = (event) =>
  fetch(`${import.meta.env.VITE_BACKEND_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  }).then((res) => {
    if (!res.ok) throw new Error('failed to track event')
    return res.json()
  })

export const getTotalViews = (recipeId) =>
  fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/totalViews/${recipeId}`,
  ).then((res) => {
    if (!res.ok) throw new Error('failed to get total views')
    return res.json()
  })

export const getDailyViews = (recipeId) =>
  fetch(
    `${import.meta.env.VITE_BACKEND_URL}/events/dailyViews/${recipeId}`,
  ).then((res) => {
    if (!res.ok) throw new Error('failed to get daily views')
    return res.json()
  })
  