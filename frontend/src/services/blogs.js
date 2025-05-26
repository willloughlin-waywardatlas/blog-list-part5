import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const update = async updatedBlog => {
  const response = await axios
    .put(`${baseUrl}/${updatedBlog.id}`, updatedBlog)
  return response.data
}

const remove = async blog => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios
    .delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

export default {
  getAll,
  create,
  setToken,
  update,
  remove
}