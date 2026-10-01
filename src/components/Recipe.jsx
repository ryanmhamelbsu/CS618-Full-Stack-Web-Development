import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Recipe({ title, ingredients, image, author }) {
  return (
    <article>
      <h3>{title}</h3>

      {image && (
        <img
          src={image}
          alt={title}
          width='300'
        />
      )}

      <h4>Ingredients</h4>

      <ul>
        {ingredients.map((ingredient, index) => (
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
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  image: PropTypes.string,
  author: PropTypes.string,
}