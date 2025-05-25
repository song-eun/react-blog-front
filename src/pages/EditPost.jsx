import { useEffect, useState } from 'react'
import QuillEditor from '../components/QuillEditor'
import css from './editpost.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getPostDetail, updatePost } from '../apis/postApi'

export const EditPost = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.info)

  const [formData, setFormData] = useState({ title: '', summary: '', files: '', content: '' })
  const [currentImage, setCurrentImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || !user.username) {
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const postData = await getPostDetail(postId)

        if (postData.author !== user?.username) {
          setError('자신의 글만 수정할 수 있습니다')
          navigate('/')
          return
        }

        setFormData({ ...postData, files: postData.cover ? postData.cover : '' })
        setCurrentImage(`${import.meta.env.VITE_BACK_URL}/${postData.cover}`)
      } catch (error) {
        console.error('글 정보 불러오기 실패:', error)
        setError('글 정보를 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.username) {
      fetchPost()
    }
  }, [postId, user?.username, navigate])

  const handleSubmit = async e => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.summary) {
      setError('모든 필드를 입력해주세요')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const sendData = new FormData()
      sendData.append('title', formData.title)
      sendData.append('summary', formData.summary)
      sendData.append('content', formData.content)

      if (formData.files) {
        sendData.append('files', formData.files)
      }
      await updatePost(postId, sendData)
      navigate(`/post/${postId}`)
    } catch (error) {
      console.error('글 수정 실패:', error)
      setError(error.response?.data?.error || '글 수정에 실패했습니다')
    } finally {
      setIsSubmitting(false)
      setError('')
    }
  }

  const handleContentChange = value => {
    setFormData(prev => ({
      ...prev,
      content: value,
    }))
  }

  const handleChange = e => {
    const { name, value, files } = e.target

    setFormData(prev => ({ ...prev, [name]: name === 'files' ? files[0] : value }))
  }

  if (isLoading) {
    return <div className={css.loading}>글 정보를 불러오는 중...</div>
  }

  return (
    <main className={css.editPost}>
      <h2>글 수정하기</h2>
      {error && <div className={css.error}>{error}</div>}
      <form className={css.writecon} onSubmit={handleSubmit}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
        />

        <label htmlFor="summary">요약 내용</label>
        <input
          type="text"
          id="summary"
          name="summary"
          onChange={handleChange}
          value={formData.summary}
          required
        />

        <label>대표 이미지 </label>
        <div className={css.previewImage}>
          {currentImage && <img src={currentImage} alt={formData.title} />}
          <label htmlFor="files" hidden>
            파일
          </label>
          <input type="file" id="files" name="files" accept="image/*" onChange={handleChange} />
        </div>
        {currentImage && (
          <p className={css.imageNote}>새 이미지를 업로드하면 기존 이미지는 대체됩니다.</p>
        )}

        <label htmlFor="content">내용</label>
        <div className={css.editorWrapper}>
          <QuillEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder={'내용을 입력해주세요'}
          />
        </div>
        <button type="submit" disabled={isSubmitting} className={css.submitButton}>
          {isSubmitting ? '수정중' : '수정'}
        </button>
      </form>
    </main>
  )
}
