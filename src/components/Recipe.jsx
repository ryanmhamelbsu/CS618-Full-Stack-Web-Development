import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { User } from './User.jsx'

export function Recipe({
  _id,
  title,
  ingredients,
  image,
  author,
  fullRecipe = false,
}) {
  return (
    <article>
      <h3>
        {fullRecipe ? (
          title
        ) : (
          <Link to={`/recipes/${_id}`}>{title}</Link>
        )}
      </h3>

      {image && (
        <img
          src={image}
          alt={title}
          width='300'
        />
      )}

      <h4>Ingredients</h4>

      <ul>
        {(ingredients ?? []).map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      {author && (
        <em>
          Written by <User id={author} />
        </em>
      )}
    </article>
  )
}

Recipe.propTypes = {
  _id: PropTypes.string,
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  image: PropTypes.string,
  author: PropTypes.string,
  fullRecipe: PropTypes.bool,
}