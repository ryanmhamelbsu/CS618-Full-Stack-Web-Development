import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/recipes.js'
import { RecipeList } from '../components/RecipeList.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { Header } from '../components/Header.jsx'

export function Blog() {
  const recipesQuery = useQuery({
    queryKey: ['recipes'],
    queryFn: () => getRecipes({}),
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

      <RecipeList recipes={recipes} />
    </div>
  )
}