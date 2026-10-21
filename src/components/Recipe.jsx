
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from './User.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { likeRecipe } from '../api/recipes.js'

export function Recipe({
  _id,
  title,
  ingredients,
  image,
  author,
  likes = [],
  fullRecipe = false,
}) {
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: () => likeRecipe(token, _id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['recipe', _id] })
    },
  })

  const handleLike = () => {
    likeMutation.mutate()
  }

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

      <p>
        <strong>Likes: {likes?.length ?? 0}</strong>
      </p>

      {fullRecipe && token && (
        <button
          type='button'
          onClick={handleLike}
          disabled={likeMutation.isPending}
        >
          {likeMutation.isPending ? 'Liking...' : 'Like Recipe'}
        </button>
      )}

      {likeMutation.isError && (
        <p>Unable to like recipe.</p>
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
  likes: PropTypes.arrayOf(PropTypes.string),
  fullRecipe: PropTypes.bool,
}
