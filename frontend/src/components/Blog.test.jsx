import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'John Smith',
  url: 'www.example.com',
  likes: 6,
}

test('renders content', () => {

  const { container } = render(<Blog blog={blog} />)

  const title = screen.getByText('Component testing is done with react-testing-library John Smith')
  const blogDetails = container.querySelector('.blog-details')
  expect(blogDetails).toHaveStyle('display: none')
  expect(title).toBeDefined()
})

test('clicking the "view" button reveals togglable content', async () => {

  render(
    <Blog blog={blog}/>
  )
  const element = screen.getByText('Component testing is done with react-testing-library John Smith')
  const user = userEvent.setup()
  const button = screen.getByText('view')
  const blogDetails = element.querySelector('.blog-details')
  expect(blogDetails).toHaveStyle('display: none')
  await user.click(button)
  expect(blogDetails).not.toHaveStyle('display: none')

})

test('clicking the like button twice triggers event handler twice', async () => {

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} addLike={mockHandler}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates props state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm handleCreate={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')

  const createButton = screen.getByText('create')

  await user.type(titleInput, 'test title...')
  await user.type(authorInput, 'test author...')
  await user.type(urlInput, 'test url...')
  await user.click(createButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title...')
  expect(createBlog.mock.calls[0][0].author).toBe('test author...')
  expect(createBlog.mock.calls[0][0].url).toBe('test url...')
})







