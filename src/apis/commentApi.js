import axios from 'axios'
axios.defaults.withCredentials = true
const API_URL = import.meta.env.VITE_BACK_URL

export const createComment = async commentData => {
  const response = await axios.post(`${API_URL}/comment`, commentData)
  return response.data
}

export const getComments = async postId => {
  const response = await axios.get(`${API_URL}/comment/${postId}`)
  return response.data
}

export const deleteComment = async commentId => {
  const response = await axios.delete(`${API_URL}/comment/${commentId}`)
  return response.data
}

export const updateComment = async (commentId, content) => {
  const response = await axios.put(`${API_URL}/comment/${commentId}`, { content })
  return response.data
}
