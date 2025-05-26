import axios from 'axios'
axios.defaults.withCredentials = true // 모든 요청에 대해 withCredentials 설정
const API_URL = import.meta.env.VITE_BACK_URL

export const createPost = async postData => {
  const response = await axios.post(`${API_URL}/postWrite`, postData)
  return response.data
}

export const getPostList = async (page = 0, limit = 3) => {
  const response = await axios.get(`${API_URL}/postList`, { params: { page, limit } })
  return response.data
}

export const getPostDetail = async postId => {
  const response = await axios.get(`${API_URL}/post/${postId}`)
  console.log('getPostDetail')
  return response.data
}

export const deletePost = async postId => {
  const response = await axios.delete(`${API_URL}/post/${postId}`)
  return response.data
}

export const updatePost = async (postId, postData) => {
  const response = await axios.put(`${API_URL}/post/${postId}`, postData)
  return response.data
}

export const toggleLike = async postId => {
  const response = await axios.post(`${API_URL}/like/${postId}`)
  return response.data
}
