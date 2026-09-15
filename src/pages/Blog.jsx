import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../api/posts.js'
import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { Header } from '../components/Header.jsx'

export function Blog() {
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts({}),
  })

  const posts = postsQuery.data ?? []

  return (
    <div>
      <Header />
      <br />
      <hr />

      <h1>Blog</h1>

      <CreatePost />

      <hr />

      <PostList posts={posts} />
    </div>
  )
}

