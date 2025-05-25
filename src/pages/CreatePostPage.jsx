import { useEffect, useState } from 'react'
import QuillEditor from '../components/QuillEditor'
import css from './EditPost.module.css'
import { createPost } from '../apis/postApi'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export const CreatePostPage = () => {
  const [formData, setFormData] = useState({ title: '', summary: '', files: '', content: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const user = useSelector(state => state.user.info)

  useEffect(() => {
    if (!user || !user.username) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleCreatePost = async e => {
    e.preventDefault()

    if (!formData.title || !formData.content || !formData.summary) {
      setError('모든 필드를 입력해주세요')
      return
    }

    setIsSubmitting(true)
    setError('')

    const sendData = new FormData()
    sendData.append('title', formData.title)
    sendData.append('summary', formData.summary)
    sendData.append('content', formData.content)

    if (formData.files) {
      sendData.append('files', formData.files)
    }

    try {
      await createPost(sendData)
      setIsSubmitting(false)
      navigate('/')
    } catch (error) {
      console.error(error)
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

  return (
    <main className={css.createPost}>
      <h2>CreatePostPage</h2>
      {error && <div className={css.error}>{error}</div>}
      <form className={css.writecon} onSubmit={handleCreatePost}>
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

        <label htmlFor="files">파일</label>
        <input type="file" id="files" name="files" accept="image/*" onChange={handleChange} />

        <label htmlFor="content">내용</label>
        <div className={css.editorWrapper}>
          <QuillEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder={'내용을 입력해주세요'}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록중' : '등록'}
        </button>
      </form>
    </main>
  )
}
