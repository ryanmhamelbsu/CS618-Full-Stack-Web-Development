import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { Header } from '../components/Header.jsx'
import { Recipe } from '../components/Recipe.jsx'
import { RecipeStats } from '../components/RecipeStats.jsx'
import { getRecipeById } from '../api/recipes.js'
import { postTrackEvent } from '../api/events.js'

export function ViewRecipe() {
  const { recipeId } = useParams()
  const queryClient = useQueryClient()
  const sessionRef = useRef(null)

  const recipeQuery = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
  })

  useEffect(() => {
    let active = true
    let started = false
    let session = null

    const timeout = setTimeout(async () => {
      try {
        const data = await postTrackEvent({
          recipeId,
          action: 'startView',
        })

        started = true
        session = data.session
        sessionRef.current = session

        if (active) {
          queryClient.invalidateQueries({
            queryKey: ['totalViews', recipeId],
          })

          queryClient.invalidateQueries({
            queryKey: ['dailyViews', recipeId],
          })
        } else {
          await postTrackEvent({
            recipeId,
            session,
            action: 'endView',
          })
        }
      } catch (err) {
        console.error('error tracking recipe view', err)
      }
    }, 1000)

    return () => {
      active = false
      clearTimeout(timeout)

      if (started && session) {
        postTrackEvent({
          recipeId,
          session,
          action: 'endView',
        }).catch((err) => {
          console.error('error ending recipe view', err)
        })
      }
    }
  }, [recipeId, queryClient])

  const recipe = recipeQuery.data

  return (
    <div>
      <Header />

      <br />
      <hr />

      <Link to='/'>Back to main page</Link>

      <hr />

      {recipeQuery.isLoading && <p>Loading recipe...</p>}

      {recipeQuery.isError && (
        <p>Recipe not found.</p>
      )}

      {recipe && (
        <div>
          <Recipe {...recipe} fullRecipe />

          <hr />

          <RecipeStats recipeId={recipeId} />
        </div>
      )}
    </div>
  )
}