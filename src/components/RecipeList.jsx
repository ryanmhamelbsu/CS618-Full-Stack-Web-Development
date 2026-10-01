import PropTypes from 'prop-types'
import { Recipe } from './Recipe.jsx'

export function RecipeList({ recipes = [] }) {
  return (
    <div>
      {recipes.map((recipe) => (
        <Recipe
          key={recipe._id}
          title={recipe.title}
          ingredients={recipe.ingredients}
          image={recipe.image}
          author={recipe.author}
        />
      ))}
    </div>
  )
}

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
      image: PropTypes.string,
      author: PropTypes.string,
    }),
  ),
}