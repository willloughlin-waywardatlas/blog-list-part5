import  { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibilty = () => {
    setVisible(!visible)
  }

  const addLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    await blogService.update(updatedBlog)
    const updatedBlogList = blogs.map((entry) => {
      return entry.id === blog.id ? updatedBlog : entry
    })
    const sortedBlogs = updatedBlogList.toSorted((a, b) => b.likes - a.likes)
    setBlogs( sortedBlogs )
  }

  const remove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      await blogService.remove(blog)
      const updatedBlogList = blogs.filter((blogObj) => blogObj.id !== blog.id)
      setBlogs( updatedBlogList )
    }
  }

  return(
    <div className={'blog'}>
      {blog.title} {blog.author}<button onClick={toggleVisibilty}>{visible ? 'hide' : 'view'}</button>
      <div style={{ display: visible ? 'inherit' : 'none' }}>
        <div>url: {blog.url ? blog.url : ''}</div>
        <div>likes: {blog.likes} <button onClick={addLike}>like</button></div>
        <div>Added by: {blog.user ? blog.user.username : ''}</div>
        <button onClick={remove} style={{ marginLeft: 0 }}>remove</button>
      </div>
    </div>
  )
}

export default Blog