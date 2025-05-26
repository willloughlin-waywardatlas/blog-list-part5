import loginService from './services/login'
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user,setUser] = useState(null)
  const [message, setMessage] = useState({ content:'-', class:'inActive' })

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes)
      setBlogs( sortedBlogs )
    }
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const Notification = ({ message }) => {
    return (
      <div className={`notification ${message.class}`}>
        <p>{message.content}</p>
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage({ content:'Log in successful', class:'success' })
      setTimeout(() => {
        setMessage({ content:'Log in successful', class:'inActive' })
      },5000)
    } catch (exception) {
      setMessage({ content:'Wrong credentials', class:'error' })
      setTimeout(() => {
        setMessage({ content:'Wrong credentials', class:'inActive' })
      },5000)
    }
  }

  const handleCreate = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility()
      const response = await blogService.create(newBlog)
      const updatedBlogList = blogs.concat(response)
      setBlogs(updatedBlogList)
      setMessage({ content:'New blog created', class:'success' })
      setTimeout(() => {
        setMessage({ content:'New blog created', class:'inActive' })
      },5000)
    } catch (error) {
      const errorMessage = error.response.data.error
      setMessage({ content:`${errorMessage}`, class:'error' })
      setTimeout(() => {
        setMessage({ content:`${errorMessage}`, class:'inActive' })
      },5000)
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setMessage({ content:'Log out successful', class:'success' })
    setTimeout(() => {
      setMessage({ content:'Log out successful', class:'inActive' })
    },5000)
  }

  const loggedInUser = () => {
    return(
      <div>
        {user.username} is logged in
        <button onClick={logout}>logout</button>
      </div>
    )
  }

  const createBlog = () => {
    return(
      <div>
        <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
          <BlogForm
            handleCreate={handleCreate}
          />
        </Togglable>
      </div>
    )
  }

  const login = () => {
    return(
      <Togglable buttonLabel='Login'>
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </Togglable>
    )
  }

  const addLike = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    await blogService.update(updatedBlog)
    const updatedBlogList = blogs.map((entry) => {
      return entry.id === blog.id ? updatedBlog : entry
    })
    const sortedBlogs = updatedBlogList.toSorted((a, b) => b.likes - a.likes)
    setBlogs( sortedBlogs )
  }

  return (
    <div>
      <h2>blogs</h2>
      <div>
        {user ? loggedInUser(): '' }
      </div>
      <Notification message={message}/>
      {user ? createBlog() : login() }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} addLike={addLike}/>
      )}
    </div>
  )
}

export default App