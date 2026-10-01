import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createRecipe } from '../api/recipes.js'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [image, setImage] = useState('')
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const createRecipeMutation = useMutation({
    mutationFn: () =>
      createRecipe(token, {
        title,
        ingredients: ingredients
          .split('\n')
          .map((ingredient) => ingredient.trim())
          .filter((ingredient) => ingredient),
        image,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      setTitle('')
      setIngredients('')
      setImage('')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
  }

  if (!token) {
    return <div>Please log in to create new recipes.</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Recipe Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label htmlFor='create-ingredients'>Ingredients: </label>
        <br />
        <textarea
          name='create-ingredients'
          id='create-ingredients'
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder='Enter one ingredient per line'
        />
      </div>

      <br />

      <div>
        <label htmlFor='create-image'>Image URL: </label>
        <input
          type='text'
          name='create-image'
          id='create-image'
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <br />

      <input
        type='submit'
        value={
          createRecipeMutation.isPending ? 'Creating....' : 'Create Recipe'
        }
        disabled={!title || !ingredients || !image}
      />

      {createRecipeMutation.isSuccess ? (
        <>
          <br />
          Recipe created successfully!
        </>
      ) : null}
    </form>
  )
}