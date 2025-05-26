import  { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, addLike }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibilty = () => {
    setVisible(!visible)
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
      <div className={ 'blog-details' } style={{ display: visible ? 'inherit' : 'none' }}>
        <div>url: {blog.url ? blog.url : ''}</div>
        <div>likes: {blog.likes} <button onClick={ () => addLike(blog) }>like</button></div>
        <div>Added by: {blog.user ? blog.user.username : ''}</div>
        <button onClick={remove} style={{ marginLeft: 0 }}>remove</button>
      </div>
    </div>
  )
}

export default Blog