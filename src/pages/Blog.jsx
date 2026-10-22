import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/recipes.js'
import { RecipeList } from '../components/RecipeList.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { Header } from '../components/Header.jsx'
import { Chat } from '../components/Chat.jsx'

export function Blog() {
  const [sortOrder, setSortOrder] = useState('descending')

  const recipesQuery = useQuery({
    queryKey: ['recipes', sortOrder],
    queryFn: () =>
      getRecipes({
        sortBy: 'likes',
        sortOrder,
      }),
  })

  const recipes = recipesQuery.data ?? []

  return (
    <div>
      <Header />

      <br />
      <hr />

      <h1>Recipe Sharing App</h1>

      <CreateRecipe />

      <hr />

      <Chat />

      <hr />

      <h3>Sort Recipes by Popularity</h3>

      <label htmlFor='sort-recipes'>Sort by: </label>
      <select
        id='sort-recipes'
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value='descending'>
          Most Liked First
        </option>
        <option value='ascending'>
          Least Liked First
        </option>
      </select>

      <hr />

      {recipesQuery.isLoading && <p>Loading recipes...</p>}

      {recipesQuery.isError && <p>Unable to load recipes.</p>}

      <RecipeList recipes={recipes} />
    </div>
  )
}