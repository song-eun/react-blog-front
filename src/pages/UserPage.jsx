import React, { useEffect, useState } from 'react'
import css from './Userpage.module.css'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getUserComments, getUserInfo, getUserLikes, getUserPosts } from '../apis/userApi'
import { formatDate } from '../util/feature'
import noCoverImg from '../assets/no-img.png'
import { MoveRight } from 'lucide-react'

export const UserPage = () => {
  const { username } = useParams()
  const [userData, setUserData] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [userComments, setUserComments] = useState([])
  const [userLikes, setUserLikes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const userInfo = useSelector(state => state.user.info)
  const isCurrentUser = userInfo && userInfo.username === username

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const fetchedUserData = await getUserInfo(username)
        const fetchedPosts = await getUserPosts(username)
        const fetchedComments = await getUserComments(username)
        const fetchedLikes = await getUserLikes(username)

        setUserData(fetchedUserData)
        setUserPosts(fetchedPosts)
        setUserComments(fetchedComments)
        setUserLikes(fetchedLikes)
      } catch (error) {
        console.error('사용자 데이터 로딩 실패:', error)
        setError('사용자 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserData()
  }, [username])

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>{error}</div>
  if (!userData) return <div>사용자를 찾을 수 없습니다.</div>

  return (
    <main className={css.userpage}>
      <h2>사용자페이지</h2>
      <section>
        <h3>사용자 정보</h3>
        <div className={css.userInfo}>
          <p>이름: {userData.username}</p>
          <p>가입일: {formatDate(userData.createdAt)}</p>

          {isCurrentUser && (
            <div>
              <Link to={``}>내 정보 수정</Link>
            </div>
          )}
        </div>
      </section>
      <section>
        <h3>작성한 글 ({userPosts.length})</h3>
        {userPosts.length > 0 ? (
          <ul className={css.postList}>
            {userPosts.map(post => (
              <li key={post._id} className={css.postCard}>
                <Link to={`/post/${post._id}`}>
                  <p className={css.title}>{post.title}</p>
                  <p className={css.postDate}>{formatDate(post.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 글이 없습니다.</p>
        )}
      </section>
      <section>
        <h3>작성한 댓글 ({userComments.length})</h3>
        {userComments.length > 0 ? (
          <ul className={css.commentList}>
            {userComments.map(comment => (
              <li key={comment._id} className={css.commentCard}>
                <Link to={`/post/${comment.postId}`}>
                  <p className={css.commentContent}>"{comment.content}"</p>
                  <div className={css.commentMeta}>
                    <p className={css.postDate}>{formatDate(comment.createdAt)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>작성한 댓글이 없습니다.</p>
        )}
      </section>
      <section>
        <h3>좋아요 클릭한 글 ({userLikes.length})</h3>
        {userLikes.length > 0 ? (
          <ul className={css.likeList}>
            {userLikes.map(post => (
              <li key={post._id} className={css.likeCard}>
                <Link to={`/post/${post._id}`}>
                  {post.cover ? (
                    <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
                  ) : (
                    <img src={noCoverImg} alt="기본 이미지" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>좋아요 클릭한 글이 없습니다.</p>
        )}
      </section>
    </main>
  )
}
