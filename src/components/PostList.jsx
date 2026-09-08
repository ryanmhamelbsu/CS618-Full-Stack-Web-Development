import { Post } from './Post.jsx'

export function PostList({ posts = [] }) {
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post._id}
          title={post.title}
          contents={post.contents}
          author={post.author}
        />
      ))}
    </div>
  )
}
