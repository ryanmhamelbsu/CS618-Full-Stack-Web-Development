export function Post({ title, contents, author }) {
  return (
    <article>
      <h3>{title}</h3>
      <div>{contents}</div>
      <br />
      <i>Written by {author}</i>
    </article>
  )
}
