import loginService from './services/login'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const [user,setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })
  const [message, setMessage] = useState({content:'-', class:'inActive'})


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const Notification = ({message}) => {
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
      setMessage({content:`Log in successful`, class:'success'})
      setTimeout(() => {
        setMessage({content:`Log in successful`, class:'inActive'})
      },5000)
    } catch (exception) {
      setMessage({content:`'Wrong credentials'`, class:'error'})
      setTimeout(() => {
        setMessage({content:`'Wrong credentials'`, class:'inActive'})
      },5000)
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const response = await blogService.create(newBlog)
      const updatedBlogList = blogs.concat(response)
      setNewBlog({
        title: '',
        author: '',
        url: ''
      })
      setBlogs(updatedBlogList)
      setMessage({content:`New blog created`, class:'success'})
      setTimeout(() => {
        setMessage({content:`New blog created`, class:'inActive'})
      },5000)
    } catch (error) {
      const errorMessage = error.response.data.error
      setMessage({content:`${errorMessage}`, class:'error'})
      setTimeout(() => {
        setMessage({content:`${errorMessage}`, class:'inActive'})
      },5000)
    }

  }


  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setMessage({content:`Log out successful`, class:'success'})
    setTimeout(() => {
      setMessage({content:`Log out successful`, class:'inActive'})
    },5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => {
    return(
      <div>
        <div>
          {user.username} is logged in
          <button onClick={logout}>logout</button>
        </div>
        <h2>Create new</h2>
        <form onSubmit={handleCreate}>
          <div>
            title
              <input
              type="text"
              value={newBlog.title}
              name="Title"
              onChange={({ target }) => setNewBlog({...newBlog, title:target.value})}
            />
          </div>
          <div>
            author
              <input
              type="text"
              value={newBlog.author}
              name="Author"
              onChange={({ target }) => setNewBlog({...newBlog, author:target.value})}
            />
          </div>
          <div>
            url
              <input
              type="text"
              value={newBlog.url}
              name="Url"
              onChange={({ target }) => setNewBlog({...newBlog, url:target.value})}
            />
          </div>
          <button type="submit">create</button>
        </form>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message}/>
      {user === null ? loginForm(): blogForm()}
    </div>
  )
}

export default App