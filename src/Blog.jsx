import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPosts, createPost } from './api/posts.js'
import { PostList } from './components/PostList.jsx'
import { CreatePost } from './components/CreatePost.jsx'

export function Blog() {
  const queryClient = useQueryClient()

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posts'] }),
  })

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts({}),
  })

  const posts = postsQuery.data ?? []

  return (
    <div>
      <h1>Blog</h1>

      <CreatePost onCreate={(post) => createPostMutation.mutate(post)} />

      <hr />

      <PostList posts={posts} />
    </div>
  )
}
