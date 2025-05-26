import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toggleLike } from '../apis/postApi'
import { ThumbsUp } from 'lucide-react'

export const LikeButton = ({ postId, likes }) => {
  const navigate = useNavigate()
  const user = useSelector(state => state.user.info)
  const userId = user?.id

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes.length)

  useEffect(() => {
    if (userId) {
      setIsLiked(likes.includes(userId))
    } else {
      setIsLiked(false)
    }
  }, [likes, userId])

  const handleLikeToggle = async e => {
    e.stopPropagation()

    if (!userId) {
      alert('로그인이 필요합니다')
      navigate('/login')
      return
    }

    try {
      const newLiked = !isLiked
      setIsLiked(newLiked)
      setLikesCount(prev => (newLiked ? prev + 1 : prev - 1))

      const updatedPost = await toggleLike(postId)

      setIsLiked(updatedPost.liked)
      setIsLiked(updatedPost.likesCount)
    } catch (error) {
      console.error('좋아요 토글 실패: ', error)
      if (error.response && error.response.status === 401) {
        alert('로그인이 필요합니다')
        navigate('/login')
      }
    }
  }

  return (
    <span>
      <span onClick={handleLikeToggle} style={{ cursor: 'pointer', marginRight: '0.2rem' }}>
        <ThumbsUp size={16} fill={isLiked ? 'black' : 'none'} />
      </span>
      <span>{likesCount}</span>
    </span>
  )
}
