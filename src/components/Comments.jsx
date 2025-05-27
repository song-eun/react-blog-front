import React, { useEffect, useState } from 'react'
import css from './Comments.module.css'
import { CircleArrowUp } from 'lucide-react'
import { CircleCheck } from 'lucide-react'
import { CircleX } from 'lucide-react'
import { createComment, deleteComment, getComments, updateComment } from '../apis/commentApi'
import { useSelector } from 'react-redux'
import { formatDate } from '../util/feature'
import Modal from './Modal'

export const Comments = ({ postId, postAuthor, onCommentCountChange }) => {
  const userInfo = useSelector(state => state.user.info)

  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [comments, setComments] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)

  const [editState, setEditState] = useState({ id: null, content: '' })

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(postId)
        setComments(response)
        onCommentCountChange(response.length)
      } catch (error) {
        console.error('댓글 목록 조회 실패:', error)
        alert('댓글 목록 조회에 실패했습니다.')
      }
    }
    fetchComments()
  }, [postId, onCommentCountChange])

  const handleSubmit = async e => {
    e.preventDefault()
    console.log('submit')

    if (!newComment) {
      alert('댓글을 입력하세요')
      return
    }

    try {
      setIsLoading(true)
      const commentData = { postId, content: newComment }
      const response = await createComment(commentData)
      const updatedComments = [response, ...comments]

      setComments(updatedComments)
      setNewComment('')
      onCommentCountChange(updatedComments.length)
    } catch (error) {
      console.error('댓글 등록 실패', error)
      alert('댓글 등록에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = e => {
    setNewComment(e.target.value)
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      await deleteComment(commentToDelete)
      const updatedComments = comments.filter(comment => comment._id !== commentToDelete)
      setComments(updatedComments)
      onCommentCountChange(updatedComments.length)
    } catch (error) {
      console.error('댓글 삭제 실패', error)
      alert('댓글 삭제에 실패했습니다.')
    } finally {
      setIsLoading(false)
      setIsModalOpen(false)
      document.body.style.overflow = ''
      setCommentToDelete(null)
    }
  }

  const handleConfirmDelete = commentId => {
    setCommentToDelete(commentId)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const handleEditMode = comment => {
    setEditState({ id: comment._id, content: comment.content })
  }

  const handleUpdateComment = async () => {
    if (!editState.content.trim()) {
      alert('댓글 내용을 입력하세요')
      return
    }

    try {
      setIsLoading(true)
      await updateComment(editState.id, editState.content)

      setComments(prev =>
        prev.map(comment =>
          comment._id === editState.id ? { ...comment, content: editState.content } : comment
        )
      )

      handleCancelEdit()
    } catch (error) {
      console.error('댓글 수정 실패:', error)
      alert('댓글 수정에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditState({ id: null, content: '' })
  }

  const renderCommentItem = comment => {
    return (
      <li className={css.list} key={comment._id}>
        {editState.id === comment._id ? (
          <>
            <div className={css.comment}>
              <p className={css.author}>{comment.author}</p>
              <p className={css.date}>{formatDate(comment.createdAt)}</p>
              <textarea
                value={editState.content}
                onChange={e => setEditState({ ...editState, content: e.target.value })}
                className={css.text}
                disabled={isLoading}
              ></textarea>
            </div>
            <div className={css.btns}>
              <button onClick={() => handleUpdateComment(comment._id)} disabled={isLoading}>
                완료
              </button>
              <button onClick={handleCancelEdit} disabled={isLoading}>
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={css.comment}>
              <p className={css.author}>{comment.author}</p>
              <p className={css.date}>{formatDate(comment.createdAt)}</p>
              <p className={css.text}>{comment.content}</p>
            </div>

            <div className={css.btns}>
              {userInfo.username === comment.author && (
                <button onClick={() => handleEditMode(comment)}>수정</button>
              )}
              {(userInfo.username === comment.author || userInfo.username === postAuthor) && (
                <button onClick={() => handleConfirmDelete(comment._id)}>삭제</button>
              )}
            </div>
          </>
        )}
      </li>
    )
  }

  return (
    <section className={css.comments}>
      <h3 className={css.title}>댓글</h3>
      {userInfo.username ? (
        <form onSubmit={handleSubmit}>
          <textarea
            type="text"
            value={newComment}
            placeholder="댓글 추가"
            onChange={handleChange}
          ></textarea>
          <button type="submit" className={css.submitBtn} disabled={isLoading}>
            <CircleArrowUp
              fill={newComment.length > 0 ? '#2383E2' : '#D3D1CB'}
              stroke="white"
              size={28}
            />
          </button>
        </form>
      ) : (
        <p className={css.logMessage}>댓글을 작성하려면 로그인이 필요합니다.</p>
      )}
      <ul>
        {comments && comments.length > 0 ? (
          comments.map(renderCommentItem)
        ) : (
          <li className={css.list}>
            <p className={css.text}>등록된 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
          </li>
        )}
      </ul>
      {isModalOpen && (
        <Modal
          message={'이 댓글을 삭제하시겠습니까?'}
          action={'삭제'}
          onCancel={() => {
            setIsModalOpen(false)
            setCommentToDelete(null)
            document.body.style.overflow = ''
          }}
          onConfirm={handleDelete}
        />
      )}
    </section>
  )
}
