import { Link, useNavigate, useParams } from 'react-router-dom'
import css from './postdetailpage.module.css'
import { useEffect, useState } from 'react'
import { deletePost, getPostDetail } from '../apis/postApi'
import DOMPurify from 'dompurify'
import { formatDate } from '../util/feature'
import { useSelector } from 'react-redux'
import Modal from '../components/Modal'
import { LikeButton } from '../components/LikeButton'
import { Comments } from '../components/Comments'

export const PostDetailPage = () => {
  const { postId } = useParams()
  const username = useSelector(state => state.user.info.username)
  const navigate = useNavigate()

  const [post, setPost] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  // 나중에 사용 예정
  const [commentCount, setCommentCount] = useState(0)

  const clean = DOMPurify.sanitize(post?.content)

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const data = await getPostDetail(postId)
        setPost(data)
        setCommentCount(data.commentCount || 0)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPostDetail()
  }, [postId])

  const updateCommentCount = count => {
    setCommentCount(count)
  }

  const handleDeletePost = async () => {
    try {
      const response = await deletePost(postId)
      setIsModalOpen(false)
      alert(response.message)
      navigate('/')
    } catch (error) {
      console.error('글 삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    } finally {
      document.body.style.overflow = ''
    }
  }

  const handleConfirmDeletePost = () => {
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  return (
    <main className={css.postdetailpage}>
      <div className={css.detailImg}>
        {post.cover && (
          <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
        )}
      </div>
      <section className={css.postSection}>
        <div className={css.controls}></div>
        <h1>{post.title}</h1>
        <div className={css.info}>
          <p className={css.author}>{post.author}</p>
          <p className={css.date}>{formatDate(post.createdAt)}</p>
        </div>

        <div className={css.btns}>
          {username === post.author && (
            <>
              <Link to={`/edit/${postId}`}>수정</Link>
              <button onClick={handleConfirmDeletePost}>삭제</button>
            </>
          )}
        </div>
        <div className={css.summary}>{post.summary}</div>
        <div
          className={`${css.content} ql-content`}
          dangerouslySetInnerHTML={{ __html: clean }}
        ></div>
        {post.likes && <LikeButton postId={postId} likes={post.likes} />}
        {/* <div className={css.comment}>댓글 리스트</div> */}
        <Comments
          postId={postId}
          postAuthor={post.author}
          onCommentCountChange={updateCommentCount}
        />
      </section>
      {isModalOpen && (
        <Modal
          message={'이 게시글을 삭제하시겠습니까?'}
          action={'삭제'}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={handleDeletePost}
        />
      )}
    </main>
  )
}
